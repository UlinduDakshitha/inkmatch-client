"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addNotification,
  APP_DATA_UPDATED_EVENT,
  deleteAdminProfileByOwner,
  deleteArtistProfileByOwner,
  deleteBookingById,
  deleteBookingsByCustomer,
  deleteCustomerProfileByOwner,
  deleteNotificationById,
  deleteNotificationsByUser,
  deleteStudioProfileByOwner,
  getAdminProfileByOwner,
  getAdminProfiles,
  getArtistProfiles,
  getBookings,
  getCurrentUser,
  getCustomerProfiles,
  getNotifications,
  getStudioProfiles,
  normalizeRole,
  updateBookingStatus,
  upsertAdminProfile,
  type AdminProfile,
} from "@/utils/appData";

const ROLE_BY_EMAIL_KEY = "inkmatch.roleByEmail";
const NAME_BY_EMAIL_KEY = "inkmatch.nameByEmail";

type AccountRow = {
  email: string;
  role: string;
  name: string;
};

function safeParseMap(value: string | null): Record<string, string> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getRegisteredAccounts(): AccountRow[] {
  if (typeof window === "undefined") {
    return [];
  }

  const roleByEmail = safeParseMap(localStorage.getItem(ROLE_BY_EMAIL_KEY));
  const nameByEmail = safeParseMap(localStorage.getItem(NAME_BY_EMAIL_KEY));
  const emails = Array.from(
    new Set([...Object.keys(roleByEmail), ...Object.keys(nameByEmail)]),
  );

  return emails
    .map((email) => ({
      email,
      role: normalizeRole(roleByEmail[email]),
      name: nameByEmail[email] || email.split("@")[0] || "User",
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
}

function getSystemAdminEmails(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const roleByEmail = safeParseMap(localStorage.getItem(ROLE_BY_EMAIL_KEY));
  return Object.keys(roleByEmail).filter(
    (email) => normalizeRole(roleByEmail[email]) === "ADMIN",
  );
}

const featureLinks = [
  {
    href: "/dashboard",
    title: "Customer Dashboard",
  },
  {
    href: "/artists",
    title: "Artists",
  },
  {
    href: "/studios",
    title: "Studios",
  },
  {
    href: "/bookings",
    title: "Bookings",
  },
  {
    href: "/consultations",
    title: "Consultations",
  },
  {
    href: "/favorites",
    title: "Favorites",
  },
  {
    href: "/notifications",
    title: "Notifications",
  },
  {
    href: "/contact-us",
    title: "Contact Us",
  },
];

export default function AdminPage() {
  const user = getCurrentUser();
  const role = normalizeRole(user?.role);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(() => {
    if (!user?.email) {
      return null;
    }

    return (
      getAdminProfileByOwner(user.email) ?? {
        id: `local-admin-${encodeURIComponent(user.email)}`,
        ownerEmail: user.email,
        ownerName: user.name || "System Admin",
        phone: "",
        accessNote: "",
      }
    );
  });

  useEffect(() => {
    function syncData() {
      setRefreshKey((current) => current + 1);
      if (!user?.email) {
        return;
      }

      const stored = getAdminProfileByOwner(user.email);
      setAdminProfile(
        stored ?? {
          id: `local-admin-${encodeURIComponent(user.email)}`,
          ownerEmail: user.email,
          ownerName: user.name || "System Admin",
          phone: "",
          accessNote: "",
        },
      );
    }

    window.addEventListener("storage", syncData);
    window.addEventListener(APP_DATA_UPDATED_EVENT, syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener(APP_DATA_UPDATED_EVENT, syncData);
    };
  }, [user?.email, user?.name]);

  if (!user?.email) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card" style={{ marginTop: "1.5rem" }}>
          <h1 className="heading-3">Please log in first</h1>
          <p className="text-secondary mt-2">
            Admin access requires a logged-in account.
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card" style={{ marginTop: "1.5rem" }}>
          <h1 className="heading-3">Admin access only</h1>
          <p className="text-secondary mt-2">
            Your account does not have admin privileges.
          </p>
          <Link
            href="/"
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const artistProfiles = getArtistProfiles();
  const studioProfiles = getStudioProfiles();
  const customerProfiles = getCustomerProfiles();
  const bookingRecords = getBookings();
  const notificationRecords = getNotifications();
  const pendingBookings = bookingRecords.filter(
    (item) => item.status === "PENDING",
  ).length;
  const confirmedBookings = bookingRecords.filter(
    (item) => item.status === "CONFIRMED",
  ).length;
  const unreadNotifications = notificationRecords.filter(
    (item) => !item.isRead,
  ).length;
  const adminProfiles = getAdminProfiles();
  const registeredAccounts = getRegisteredAccounts();
  const systemAdminEmails = getSystemAdminEmails();
  const hasExtraAdminAccounts = systemAdminEmails.length > 1;

  const saveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) {
      return;
    }

    upsertAdminProfile(adminProfile);
    const latestUser = getCurrentUser();
    if (latestUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...latestUser, name: adminProfile.ownerName }),
      );
    }

    const nameByEmail = safeParseMap(localStorage.getItem(NAME_BY_EMAIL_KEY));
    nameByEmail[adminProfile.ownerEmail.toLowerCase()] = adminProfile.ownerName;
    localStorage.setItem(NAME_BY_EMAIL_KEY, JSON.stringify(nameByEmail));

    setNotice("Admin profile saved.");
    setRefreshKey((current) => current + 1);
  };

  const resetAdminProfile = () => {
    if (!user?.email) {
      return;
    }

    deleteAdminProfileByOwner(user.email);
    setAdminProfile({
      id: `local-admin-${encodeURIComponent(user.email)}`,
      ownerEmail: user.email,
      ownerName: user.name || "System Admin",
      phone: "",
      accessNote: "",
    });
    setNotice("Admin profile removed.");
  };

  const removeRegisteredAccount = (email: string) => {
    if (email.toLowerCase() === user.email?.toLowerCase()) {
      setNotice("You cannot remove your own active admin account mapping.");
      return;
    }

    const roleByEmail = safeParseMap(localStorage.getItem(ROLE_BY_EMAIL_KEY));
    const nameByEmail = safeParseMap(localStorage.getItem(NAME_BY_EMAIL_KEY));

    delete roleByEmail[email.toLowerCase()];
    delete nameByEmail[email.toLowerCase()];

    localStorage.setItem(ROLE_BY_EMAIL_KEY, JSON.stringify(roleByEmail));
    localStorage.setItem(NAME_BY_EMAIL_KEY, JSON.stringify(nameByEmail));

    deleteArtistProfileByOwner(email);
    deleteStudioProfileByOwner(email);
    deleteCustomerProfileByOwner(email);
    deleteAdminProfileByOwner(email);
    deleteBookingsByCustomer(email);
    deleteNotificationsByUser(email);

    setNotice(`${email} removed from system mappings and local records.`);
    setRefreshKey((current) => current + 1);
  };

  const removeExtraAdminAccounts = () => {
    if (!user?.email) {
      return;
    }

    const currentAdminEmail = user.email.toLowerCase();
    const roleByEmail = safeParseMap(localStorage.getItem(ROLE_BY_EMAIL_KEY));
    const extraAdmins = Object.keys(roleByEmail).filter(
      (email) =>
        normalizeRole(roleByEmail[email]) === "ADMIN" &&
        email.toLowerCase() !== currentAdminEmail,
    );

    if (extraAdmins.length === 0) {
      setNotice("No extra admin accounts found.");
      return;
    }

    extraAdmins.forEach((email) => {
      delete roleByEmail[email];
      deleteAdminProfileByOwner(email);
    });

    localStorage.setItem(ROLE_BY_EMAIL_KEY, JSON.stringify(roleByEmail));
    window.dispatchEvent(new Event(APP_DATA_UPDATED_EVENT));
    setNotice(
      "Extra admin accounts removed. System now has one admin account.",
    );
    setRefreshKey((current) => current + 1);
  };

  const verifyBooking = (
    bookingId: string,
    nextStatus: "CONFIRMED" | "CANCELLED",
    customerEmail: string,
    targetName: string,
    appointmentDate: string,
  ) => {
    updateBookingStatus(bookingId, nextStatus);
    addNotification({
      userEmail: customerEmail.toLowerCase(),
      title:
        nextStatus === "CONFIRMED" ? "Booking Confirmed" : "Booking Cancelled",
      message:
        nextStatus === "CONFIRMED"
          ? `Your booking with ${targetName} on ${appointmentDate || "the selected date"} has been approved by admin.`
          : `Your booking with ${targetName} on ${appointmentDate || "the selected date"} has been declined by admin.`,
      isRead: false,
      category: "BOOKING",
    });
    setNotice(
      nextStatus === "CONFIRMED"
        ? `Booking ${bookingId} verified and confirmed.`
        : `Booking ${bookingId} marked as cancelled.`,
    );
    setRefreshKey((current) => current + 1);
  };

  void refreshKey;

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Owner <span className="text-gradient">Control Deck</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        This is the owner dashboard. Manage platform-level data, users, and
        system cleanup from one place.
      </p>

      <div
        className="glass-card"
        style={{
          marginTop: "1rem",
          border: "1px solid rgba(255, 51, 102, 0.25)",
          background:
            "linear-gradient(135deg, rgba(255, 51, 102, 0.12), rgba(255, 153, 51, 0.08))",
        }}
      >
        <h2 className="heading-3">Platform Ownership Summary</h2>
        <p className="text-secondary mt-2">
          Admin account: <strong>{user.email}</strong>
        </p>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.8rem",
          }}
        >
          <div className="glass" style={{ padding: "0.8rem" }}>
            <strong>{registeredAccounts.length}</strong>
            <p className="text-secondary mt-2">Registered Accounts</p>
          </div>
          <div className="glass" style={{ padding: "0.8rem" }}>
            <strong>{pendingBookings}</strong>
            <p className="text-secondary mt-2">Pending Bookings</p>
          </div>
          <div className="glass" style={{ padding: "0.8rem" }}>
            <strong>{confirmedBookings}</strong>
            <p className="text-secondary mt-2">Confirmed Bookings</p>
          </div>
          <div className="glass" style={{ padding: "0.8rem" }}>
            <strong>{unreadNotifications}</strong>
            <p className="text-secondary mt-2">Unread Notifications</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "1rem" }}>
        <h2 className="heading-3">Admin Account Policy</h2>
        <p className="text-secondary mt-2">
          Only one system admin account is allowed.
        </p>
        <p className="text-secondary mt-2">
          Active admin accounts:{" "}
          {systemAdminEmails.join(", ") || "No admin mapped"}
        </p>
        {hasExtraAdminAccounts && (
          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={removeExtraAdminAccounts}
          >
            Remove Extra Admin Accounts
          </button>
        )}
      </div>

      {notice && (
        <div className="glass-card" style={{ marginTop: "1rem" }}>
          <p className="text-secondary">{notice}</p>
        </div>
      )}

      <div
        style={{
          marginTop: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="glass-card item-card">
          <h3 className="item-title">Admins</h3>
          <p className="text-secondary mt-2">{adminProfiles.length} profiles</p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Artists</h3>
          <p className="text-secondary mt-2">
            {artistProfiles.length} profiles
          </p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Studios</h3>
          <p className="text-secondary mt-2">
            {studioProfiles.length} profiles
          </p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Customers</h3>
          <p className="text-secondary mt-2">
            {customerProfiles.length} profiles
          </p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Bookings</h3>
          <p className="text-secondary mt-2">{bookingRecords.length} records</p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Notifications</h3>
          <p className="text-secondary mt-2">
            {notificationRecords.length} records
          </p>
        </div>
      </div>

      {adminProfile && (
        <div className="glass-card" style={{ marginTop: "2rem" }}>
          <h2 className="heading-3">My Admin Profile</h2>
          <p className="text-secondary mt-2">
            Keep your system administrator details up to date.
          </p>
          <form onSubmit={saveAdminProfile} style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                className="input-field"
                placeholder="Full Name"
                value={adminProfile.ownerName}
                onChange={(e) =>
                  setAdminProfile({
                    ...adminProfile,
                    ownerName: e.target.value,
                  })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Phone Number"
                value={adminProfile.phone}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, phone: e.target.value })
                }
              />
            </div>
            <textarea
              className="input-field"
              placeholder="Access notes, responsibilities, escalation details"
              value={adminProfile.accessNote}
              onChange={(e) =>
                setAdminProfile({ ...adminProfile, accessNote: e.target.value })
              }
              style={{
                marginTop: "1rem",
                minHeight: "100px",
                resize: "vertical",
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Save Admin Profile
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={resetAdminProfile}
              style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
            >
              Delete My Profile
            </button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Registered Accounts</h2>
        <p className="text-secondary mt-2" style={{ marginBottom: "1rem" }}>
          Remove stale account mappings and linked local records.
        </p>
        {registeredAccounts.length === 0 ? (
          <p className="text-secondary">No local account mappings yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {registeredAccounts.map((account) => (
              <div
                key={account.email}
                className="glass"
                style={{
                  padding: "0.9rem",
                  borderRadius: "12px",
                  display: "grid",
                  gap: "0.35rem",
                }}
              >
                <strong>{account.name}</strong>
                <p className="text-secondary">{account.email}</p>
                <p className="text-secondary">Role: {account.role}</p>
                <div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => removeRegisteredAccount(account.email)}
                  >
                    Remove Account And Local Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Owner Quick Access</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.9rem",
            marginTop: "1rem",
          }}
        >
          {featureLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-card"
              style={{
                padding: "1rem",
                borderRadius: "16px",
                border: "1px solid var(--glass-border)",
              }}
            >
              <h3 style={{ fontSize: "1rem" }}>{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Artist Profiles</h2>
        {artistProfiles.length === 0 ? (
          <p className="text-secondary mt-2">No artist records found.</p>
        ) : (
          <div className="grid-list" style={{ marginTop: "1rem" }}>
            {artistProfiles.map((item) => (
              <div key={item.id} className="glass-card item-card">
                <h3 className="item-title">{item.ownerName}</h3>
                <p className="text-secondary mt-2">{item.ownerEmail}</p>
                <p className="text-secondary mt-2">Style: {item.style}</p>
                <p className="text-secondary mt-2">Location: {item.location}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    deleteArtistProfileByOwner(item.ownerEmail);
                    setNotice(`Artist profile removed: ${item.ownerEmail}`);
                    setRefreshKey((current) => current + 1);
                  }}
                >
                  Delete Artist Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Studio Profiles</h2>
        {studioProfiles.length === 0 ? (
          <p className="text-secondary mt-2">No studio records found.</p>
        ) : (
          <div className="grid-list" style={{ marginTop: "1rem" }}>
            {studioProfiles.map((item) => (
              <div key={item.id} className="glass-card item-card">
                <h3 className="item-title">{item.name || "Studio"}</h3>
                <p className="text-secondary mt-2">{item.ownerEmail}</p>
                <p className="text-secondary mt-2">Address: {item.address}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    deleteStudioProfileByOwner(item.ownerEmail);
                    setNotice(`Studio profile removed: ${item.ownerEmail}`);
                    setRefreshKey((current) => current + 1);
                  }}
                >
                  Delete Studio Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Customer Profiles</h2>
        {customerProfiles.length === 0 ? (
          <p className="text-secondary mt-2">No customer records found.</p>
        ) : (
          <div className="grid-list" style={{ marginTop: "1rem" }}>
            {customerProfiles.map((item) => (
              <div key={item.id} className="glass-card item-card">
                <h3 className="item-title">{item.ownerName}</h3>
                <p className="text-secondary mt-2">{item.ownerEmail}</p>
                <p className="text-secondary mt-2">
                  Phone: {item.phone || "-"}
                </p>
                <p className="text-secondary mt-2">City: {item.city || "-"}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    deleteCustomerProfileByOwner(item.ownerEmail);
                    setNotice(`Customer profile removed: ${item.ownerEmail}`);
                    setRefreshKey((current) => current + 1);
                  }}
                >
                  Delete Customer Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Booking Records</h2>
        <p className="text-secondary mt-2">
          Verify new bookings from customers. Pending bookings require owner
          review.
        </p>
        {bookingRecords.length === 0 ? (
          <p className="text-secondary mt-2">No booking records found.</p>
        ) : (
          <div className="grid-list" style={{ marginTop: "1rem" }}>
            {bookingRecords.map((item) => (
              <div key={item.id} className="glass-card item-card">
                <h3 className="item-title">{item.targetName}</h3>
                <p className="text-secondary mt-2">
                  Customer: {item.customerEmail}
                </p>
                <p className="text-secondary mt-2">
                  Date: {item.appointmentDate}
                </p>
                <p className="text-secondary mt-2">Status: {item.status}</p>
                {item.status === "PENDING" && (
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      gap: "0.6rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() =>
                        verifyBooking(
                          item.id,
                          "CONFIRMED",
                          item.customerEmail,
                          item.targetName,
                          item.appointmentDate,
                        )
                      }
                    >
                      Verify And Confirm
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        verifyBooking(
                          item.id,
                          "CANCELLED",
                          item.customerEmail,
                          item.targetName,
                          item.appointmentDate,
                        )
                      }
                    >
                      Reject Booking
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    deleteBookingById(item.id);
                    setNotice(`Booking deleted: ${item.id}`);
                    setRefreshKey((current) => current + 1);
                  }}
                >
                  Delete Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="glass-card"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <h2 className="heading-3">Notification Records</h2>
        {notificationRecords.length === 0 ? (
          <p className="text-secondary mt-2">No notification records found.</p>
        ) : (
          <div className="grid-list" style={{ marginTop: "1rem" }}>
            {notificationRecords.map((item) => (
              <div key={item.id} className="glass-card item-card">
                <h3 className="item-title">{item.title}</h3>
                <p className="text-secondary mt-2">User: {item.userEmail}</p>
                <p className="text-secondary mt-2">Category: {item.category}</p>
                <p className="text-secondary mt-2">
                  Read: {item.isRead ? "Yes" : "No"}
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    deleteNotificationById(item.id);
                    setNotice(`Notification deleted: ${item.id}`);
                    setRefreshKey((current) => current + 1);
                  }}
                >
                  Delete Notification
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
