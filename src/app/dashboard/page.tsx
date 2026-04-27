"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleHomePath } from "@/utils/roleRedirect";
import {
  APP_DATA_UPDATED_EVENT,
  type AppUser,
  type AppRole,
  type Booking,
  type AppNotification,
  deleteCustomerProfileByOwner,
  getAdminProfileByOwner,
  getArtistProfiles,
  getBookings,
  getBookingsForCustomer,
  getCurrentUser,
  getCustomerProfileByOwner,
  getNotificationsByUser,
  getStudioProfiles,
  normalizeRole,
  upsertCustomerProfile,
  type CustomerProfile,
} from "@/utils/appData";

const ROLE_BY_EMAIL_KEY = "inkmatch.roleByEmail";

function getEffectiveRole(user: AppUser | null): AppRole {
  const normalizedRole = normalizeRole(user?.role);
  if (!user?.email || typeof window === "undefined") {
    return normalizedRole;
  }

  const normalizedEmail = user.email.toLowerCase();
  const roleByEmail = JSON.parse(
    localStorage.getItem(ROLE_BY_EMAIL_KEY) || "{}",
  ) as Record<string, string>;
  const mappedRole = normalizeRole(roleByEmail[normalizedEmail]);

  if (mappedRole === "ADMIN") {
    return "ADMIN";
  }

  if (getAdminProfileByOwner(normalizedEmail)) {
    return "ADMIN";
  }

  return normalizedRole;
}

type DashboardStats = {
  myBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  unreadNotifications: number;
  totalArtists: number;
  totalStudios: number;
  totalSystemBookings: number;
  recentBookings: Booking[];
  recentNotifications: AppNotification[];
};

const EMPTY_STATS: DashboardStats = {
  myBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  unreadNotifications: 0,
  totalArtists: 0,
  totalStudios: 0,
  totalSystemBookings: 0,
  recentBookings: [],
  recentNotifications: [],
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const router = useRouter();
  const [user] = useState<AppUser | null>(() => {
    return getCurrentUser();
  });
  const role = getEffectiveRole(user);
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(() => {
      if (role !== "CUSTOMER" || !user?.email) {
        return null;
      }

      return (
        getCustomerProfileByOwner(user.email) ?? {
          id: `local-customer-${encodeURIComponent(user.email)}`,
          ownerEmail: user.email,
          ownerName: user.name || "Customer",
          phone: "",
          city: "",
          bio: "",
        }
      );
    });

  const refreshDashboardData = () => {
    if (!user?.email || role !== "CUSTOMER") {
      setStats(EMPTY_STATS);
      return;
    }

    const myBookings = getBookingsForCustomer(user.email).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const notifications = getNotificationsByUser(user.email);

    setStats({
      myBookings: myBookings.length,
      pendingBookings: myBookings.filter((item) => item.status === "PENDING")
        .length,
      confirmedBookings: myBookings.filter(
        (item) => item.status === "CONFIRMED",
      ).length,
      cancelledBookings: myBookings.filter(
        (item) => item.status === "CANCELLED",
      ).length,
      unreadNotifications: notifications.filter((item) => !item.isRead).length,
      totalArtists: getArtistProfiles().length,
      totalStudios: getStudioProfiles().length,
      totalSystemBookings: getBookings().length,
      recentBookings: myBookings.slice(0, 4),
      recentNotifications: notifications.slice(0, 4),
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const roleHomePath = getRoleHomePath(role);
    if (roleHomePath !== "/dashboard") {
      router.replace(roleHomePath);
    }
  }, [router, role]);

  useEffect(() => {
    refreshDashboardData();

    function syncDashboard() {
      refreshDashboardData();
      if (!user?.email || role !== "CUSTOMER") {
        return;
      }

      const latestProfile = getCustomerProfileByOwner(user.email);
      setCustomerProfile(
        latestProfile ?? {
          id: `local-customer-${encodeURIComponent(user.email)}`,
          ownerEmail: user.email,
          ownerName: user.name || "Customer",
          phone: "",
          city: "",
          bio: "",
        },
      );
    }

    window.addEventListener("storage", syncDashboard);
    window.addEventListener(APP_DATA_UPDATED_EVENT, syncDashboard);
    return () => {
      window.removeEventListener("storage", syncDashboard);
      window.removeEventListener(APP_DATA_UPDATED_EVENT, syncDashboard);
    };
  }, [user?.email, user?.name, role]);

  const saveCustomerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerProfile) {
      return;
    }

    upsertCustomerProfile(customerProfile);

    const latestUser = getCurrentUser();
    if (latestUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...latestUser, name: customerProfile.ownerName }),
      );
    }

    setNotice("Customer profile saved successfully.");
    refreshDashboardData();
  };

  const deleteCustomerProfile = () => {
    if (!user?.email) {
      return;
    }

    deleteCustomerProfileByOwner(user.email);
    setCustomerProfile({
      id: `local-customer-${encodeURIComponent(user.email)}`,
      ownerEmail: user.email,
      ownerName: user.name || "Customer",
      phone: "",
      city: "",
      bio: "",
    });
    setNotice("Customer profile deleted.");
    refreshDashboardData();
  };

  const profileCompletion = customerProfile
    ? [
        customerProfile.ownerName,
        customerProfile.phone,
        customerProfile.city,
        customerProfile.bio,
      ].filter((value) => value.trim().length > 0).length
    : 0;
  const profileCompletionPercent = Math.round((profileCompletion / 4) * 100);

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Welcome Back,
        <span className="text-gradient"> {user?.name ?? "Customer"}</span>
      </h1>
      <p className="text-secondary mt-2">
        Live dashboard powered by current data in your InkMatch system.
      </p>

      <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Your Activity</h2>
        <p className="text-secondary mt-2">
          Real-time booking, notification, and profile insights.
        </p>

        {notice && (
          <div className="glass" style={{ marginTop: "1rem", padding: "1rem" }}>
            <p className="text-secondary">{notice}</p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "1rem",
            marginTop: "1.4rem",
          }}
        >
          <div className="glass-card item-card">
            <h3 className="item-title">My Bookings</h3>
            <p className="text-secondary mt-2">{stats.myBookings} total</p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Pending</h3>
            <p className="text-secondary mt-2">{stats.pendingBookings}</p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Confirmed</h3>
            <p className="text-secondary mt-2">{stats.confirmedBookings}</p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Unread Alerts</h3>
            <p className="text-secondary mt-2">{stats.unreadNotifications}</p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Artists</h3>
            <p className="text-secondary mt-2">
              {stats.totalArtists} available
            </p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Studios</h3>
            <p className="text-secondary mt-2">{stats.totalStudios} listed</p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">System Bookings</h3>
            <p className="text-secondary mt-2">
              {stats.totalSystemBookings} total
            </p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Profile Completion</h3>
            <p className="text-secondary mt-2">
              {profileCompletionPercent}% complete
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "1.4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          <div className="glass-card item-card">
            <h3 className="item-title">Recent Bookings</h3>
            {stats.recentBookings.length === 0 ? (
              <p className="text-secondary mt-2">No bookings yet.</p>
            ) : (
              <div
                style={{ marginTop: "0.8rem", display: "grid", gap: "0.65rem" }}
              >
                {stats.recentBookings.map((item) => (
                  <div
                    key={item.id}
                    className="glass"
                    style={{ padding: "0.65rem" }}
                  >
                    <strong>{item.targetName}</strong>
                    <p className="text-secondary mt-2">
                      {formatDate(item.appointmentDate)}
                    </p>
                    <p className="text-secondary mt-2">Status: {item.status}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/bookings"
              className="btn-secondary"
              style={{ marginTop: "1rem" }}
            >
              Open Bookings
            </Link>
          </div>

          <div className="glass-card item-card">
            <h3 className="item-title">Recent Notifications</h3>
            {stats.recentNotifications.length === 0 ? (
              <p className="text-secondary mt-2">No notifications yet.</p>
            ) : (
              <div
                style={{ marginTop: "0.8rem", display: "grid", gap: "0.65rem" }}
              >
                {stats.recentNotifications.map((item) => (
                  <div
                    key={item.id}
                    className="glass"
                    style={{ padding: "0.65rem" }}
                  >
                    <strong>{item.title}</strong>
                    <p className="text-secondary mt-2">{item.message}</p>
                    <p className="text-secondary mt-2">
                      {formatDate(item.createdAt)} |{" "}
                      {item.isRead ? "Read" : "Unread"}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/notifications"
              className="btn-secondary"
              style={{ marginTop: "1rem" }}
            >
              Open Notifications
            </Link>
          </div>
        </div>

        {role === "CUSTOMER" && customerProfile && (
          <form onSubmit={saveCustomerProfile} style={{ marginTop: "2rem" }}>
            <h3 className="heading-3">My Profile</h3>
            <p className="text-secondary mt-2">
              Update your profile details before making bookings.
            </p>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                className="input-field"
                placeholder="Full Name"
                value={customerProfile.ownerName}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    ownerName: e.target.value,
                  })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Phone Number"
                value={customerProfile.phone}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    phone: e.target.value,
                  })
                }
              />
              <input
                className="input-field"
                placeholder="City"
                value={customerProfile.city}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    city: e.target.value,
                  })
                }
              />
            </div>
            <textarea
              className="input-field"
              style={{
                marginTop: "1rem",
                minHeight: "100px",
                resize: "vertical",
              }}
              placeholder="About your tattoo idea or style preferences"
              value={customerProfile.bio}
              onChange={(e) =>
                setCustomerProfile({
                  ...customerProfile,
                  bio: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Save Profile
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={deleteCustomerProfile}
              style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
            >
              Delete Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
