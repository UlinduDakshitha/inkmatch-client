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
  availableArtists: number;
  availableStudios: number;
  recentBookings: Booking[];
  recentNotifications: AppNotification[];
};

const EMPTY_STATS: DashboardStats = {
  myBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  unreadNotifications: 0,
  availableArtists: 0,
  availableStudios: 0,
  recentBookings: [],
  recentNotifications: [],
};

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

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
          profileImage: "",
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
      availableArtists: getArtistProfiles().length,
      availableStudios: getStudioProfiles().length,
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
          profileImage: "",
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
      profileImage: "",
    });
    setNotice("Customer profile deleted.");
    refreshDashboardData();
  };

  const handleCustomerProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!customerProfile) {
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const imageData = await fileToDataUrl(file);
    setCustomerProfile({
      ...customerProfile,
      profileImage: imageData,
    });
  };

  const profileCompletion = customerProfile
    ? [
        customerProfile.ownerName,
        customerProfile.phone,
        customerProfile.city,
        customerProfile.bio,
        customerProfile.profileImage,
      ].filter((value) => value.trim().length > 0).length
    : 0;
  const profileCompletionPercent = Math.round((profileCompletion / 5) * 100);

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Welcome Back,
        <span className="text-gradient"> {user?.name ?? "Customer"}</span>
      </h1>
      <p className="text-secondary mt-2">
        Customer dashboard for booking services, tracking progress, and managing
        your profile.
      </p>

      <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Customer Service Dashboard</h2>
        <p className="text-secondary mt-2">
          Everything you need as a customer: bookings, alerts, and profile
          readiness.
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
              {stats.availableArtists} available
            </p>
          </div>
          <div className="glass-card item-card">
            <h3 className="item-title">Studios</h3>
            <p className="text-secondary mt-2">
              {stats.availableStudios} listed
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
            marginTop: "1.2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.8rem",
          }}
        >
          <Link href="/artists" className="glass" style={{ padding: "0.9rem" }}>
            <strong>Browse Artists</strong>
            <p className="text-secondary mt-2">
              Find style-matched tattoo artists.
            </p>
          </Link>
          <Link href="/studios" className="glass" style={{ padding: "0.9rem" }}>
            <strong>Browse Studios</strong>
            <p className="text-secondary mt-2">
              Compare studios near your location.
            </p>
          </Link>
          <Link
            href="/bookings"
            className="glass"
            style={{ padding: "0.9rem" }}
          >
            <strong>Track Bookings</strong>
            <p className="text-secondary mt-2">
              Review and manage upcoming sessions.
            </p>
          </Link>
          <Link
            href="/notifications"
            className="glass"
            style={{ padding: "0.9rem" }}
          >
            <strong>Check Notifications</strong>
            <p className="text-secondary mt-2">
              Stay updated with booking alerts.
            </p>
          </Link>
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
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.65rem" }}>
              <label className="text-secondary">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                onChange={handleCustomerProfileImageChange}
              />
              {customerProfile.profileImage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <img
                    src={customerProfile.profileImage}
                    alt="Customer profile"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      setCustomerProfile({
                        ...customerProfile,
                        profileImage: "",
                      })
                    }
                  >
                    Remove Picture
                  </button>
                </div>
              )}
            </div>
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
