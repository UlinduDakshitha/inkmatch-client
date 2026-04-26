"use client";

import Link from "next/link";
import {
  getArtistProfiles,
  getBookings,
  getCurrentUser,
  getNotificationsByUser,
  getStudioProfiles,
  normalizeRole,
} from "@/utils/appData";

const featureLinks = [
  {
    href: "/dashboard",
    title: "Customer Dashboard",
    description: "Check customer widgets and profile controls.",
  },
  {
    href: "/artists",
    title: "Artists",
    description: "Browse artists and verify portfolio listings.",
  },
  {
    href: "/studios",
    title: "Studios",
    description: "Review studio cards and owner profile entries.",
  },
  {
    href: "/bookings",
    title: "Bookings",
    description: "Inspect the current booking feed output.",
  },
  {
    href: "/consultations",
    title: "Consultations",
    description: "Open consultation tracking view.",
  },
  {
    href: "/favorites",
    title: "Favorites",
    description: "Validate saved favorites experience.",
  },
  {
    href: "/notifications",
    title: "Notifications",
    description: "Manage notifications and read/unread status.",
  },
  {
    href: "/contact-us",
    title: "Contact Us",
    description: "Review customer contact and support view.",
  },
];

export default function AdminPage() {
  const user = getCurrentUser();
  const role = normalizeRole(user?.role);

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

  const artistCount = getArtistProfiles().length;
  const studioCount = getStudioProfiles().length;
  const bookingCount = getBookings().length;
  const myNotificationCount = getNotificationsByUser(user.email).length;

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Admin <span className="text-gradient">Control Center</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        Use this page to quickly visit and verify every key InkMatch feature.
      </p>

      <div
        style={{
          marginTop: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="glass-card item-card">
          <h3 className="item-title">Artists</h3>
          <p className="text-secondary mt-2">
            {artistCount} local profile records
          </p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Studios</h3>
          <p className="text-secondary mt-2">
            {studioCount} local studio records
          </p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Bookings</h3>
          <p className="text-secondary mt-2">{bookingCount} booking records</p>
        </div>
        <div className="glass-card item-card">
          <h3 className="item-title">Notifications</h3>
          <p className="text-secondary mt-2">
            {myNotificationCount} admin notifications
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">All Feature Routes</h2>
        <p className="text-secondary mt-2" style={{ marginBottom: "1.1rem" }}>
          Open any module directly for testing or manual verification.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.9rem",
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
              <h3 style={{ fontSize: "1.02rem", marginBottom: "0.35rem" }}>
                {item.title}
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
