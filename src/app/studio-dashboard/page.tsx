"use client";

import { useEffect, useState } from "react";
import {
  getBookings,
  getCurrentUser,
  getStudioProfileByOwner,
  normalizeRole,
} from "@/utils/appData";
import StudioBookings from "@/components/StudioBookings";
import Link from "next/link";

export default function StudioDashboardPage() {
  const [user, setUser] = useState(() => ({ email: undefined }) as any);
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [loaded, setLoaded] = useState(false);

  const studioProfile = user?.email
    ? getStudioProfileByOwner(user.email)
    : null;
  const studioBookings = user?.email
    ? getBookings().filter(
        (booking) =>
          booking.targetType === "STUDIO" &&
          String(booking.targetId) === String(user.id || user.email),
      )
    : [];

  const pendingCount = studioBookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;
  const confirmedCount = studioBookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;
  const rejectedCount = studioBookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;
  const profileCompletion = studioProfile
    ? Math.round(
        ((studioProfile.ownerName ? 1 : 0) +
          (studioProfile.name ? 1 : 0) +
          (studioProfile.address ? 1 : 0) +
          (studioProfile.description ? 1 : 0) +
          (studioProfile.profileImage ? 1 : 0)) /
          5,
      ) * 100
    : 0;

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u as any);
    setRole(normalizeRole(u?.role));
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <p className="text-secondary">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Please log in first</h1>
          <p className="text-secondary mt-2">
            You need to be logged in to access the studio dashboard.
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

  if (role !== "STUDIO_OWNER") {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Studio access only</h1>
          <p className="text-secondary mt-2">
            This page is for registered studios only.
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

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          marginBottom: "2rem",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(59, 130, 246, 0.08) 45%, rgba(17, 24, 39, 0.85) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.9rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Studio Control Center
            </p>
            <h1 className="heading-2" style={{ marginTop: "0.5rem" }}>
              Studio <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-secondary mt-2" style={{ maxWidth: "720px" }}>
              Track booking requests, manage studio presence, and keep your
              profile polished from one place.
            </p>
          </div>

          <div
            style={{
              minWidth: "240px",
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.85rem",
              }}
            >
              Studio owner
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "1.05rem",
                fontWeight: 700,
              }}
            >
              {user.name || user.email}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.85rem",
              }}
            >
              {user.email}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {[
            { label: "Pending", value: pendingCount, accent: "#f59e0b" },
            { label: "Confirmed", value: confirmedCount, accent: "#10b981" },
            { label: "Rejected", value: rejectedCount, accent: "#ef4444" },
            {
              label: "Profile",
              value: `${profileCompletion}%`,
              accent: "#8b5cf6",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "1rem",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${item.accent}33`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "0.82rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "1.65rem",
                  fontWeight: 800,
                  color: item.accent,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px minmax(0, 1fr)",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        <aside
          className="glass-card"
          style={{ padding: "1.25rem", position: "sticky", top: "120px" }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Quick Actions
          </p>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              onClick={() => setActiveTab("bookings")}
              className="btn-primary"
              style={{ justifyContent: "flex-start" }}
            >
              Booking Requests
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className="btn-secondary"
              style={{ justifyContent: "flex-start" }}
            >
              Studio Profile
            </button>
            <Link
              href="/studios"
              className="btn-secondary"
              style={{ justifyContent: "flex-start" }}
            >
              View Public Listing
            </Link>
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.82rem",
              }}
            >
              Profile status
            </p>
            <p style={{ margin: "0.35rem 0 0", fontWeight: 700 }}>
              {studioProfile
                ? "Studio profile active"
                : "Studio profile missing"}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.85rem",
              }}
            >
              Keep your name, address, and description updated for customers.
            </p>
          </div>
        </aside>

        <main style={{ display: "grid", gap: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("bookings")}
              style={{
                padding: "0.85rem 1.2rem",
                borderRadius: "999px",
                border:
                  activeTab === "bookings"
                    ? "1px solid rgba(96,165,250,0.55)"
                    : "1px solid rgba(255,255,255,0.12)",
                background:
                  activeTab === "bookings"
                    ? "rgba(59,130,246,0.18)"
                    : "rgba(255,255,255,0.03)",
                color:
                  activeTab === "bookings"
                    ? "#93c5fd"
                    : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Booking Requests
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              style={{
                padding: "0.85rem 1.2rem",
                borderRadius: "999px",
                border:
                  activeTab === "profile"
                    ? "1px solid rgba(196,181,253,0.55)"
                    : "1px solid rgba(255,255,255,0.12)",
                background:
                  activeTab === "profile"
                    ? "rgba(139,92,246,0.18)"
                    : "rgba(255,255,255,0.03)",
                color:
                  activeTab === "profile" ? "#ddd6fe" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Studio Profile
            </button>
          </div>

          {activeTab === "bookings" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                className="glass-card"
                style={{
                  border: "1px solid rgba(59, 130, 246, 0.25)",
                  background: "rgba(59, 130, 246, 0.05)",
                }}
              >
                <p style={{ margin: 0, color: "rgba(255,255,255,0.8)" }}>
                  Manage booking requests, confirm the right sessions, and keep
                  your studio calendar clean. Use the side panel for fast
                  navigation.
                </p>
              </div>

              <StudioBookings studioId={user.id || user.email} />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h2 className="heading-3" style={{ marginBottom: "0.35rem" }}>
                    Studio Profile
                  </h2>
                  <p className="text-secondary">
                    Review the account details that appear to customers.
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "14px",
                    background: "rgba(139, 92, 246, 0.08)",
                    border: "1px solid rgba(139, 92, 246, 0.22)",
                    minWidth: "220px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.82rem",
                    }}
                  >
                    Profile completion
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "#c4b5fd",
                    }}
                  >
                    {profileCompletion}%
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.25rem",
                }}
              >
                <InfoCard
                  label="Studio Name"
                  value={studioProfile?.name || user.name || "Not set"}
                />
                <InfoCard label="Email" value={user.email} />
                <InfoCard label="Role" value={role || "Unknown"} />
                <InfoCard label="User ID" value={user.id || "Not available"} />
                <InfoCard
                  label="Address"
                  value={studioProfile?.address || "Not added"}
                />
                <InfoCard
                  label="Gallery Images"
                  value={String(studioProfile?.galleryImages?.length || 0)}
                />
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 className="heading-4">Studio Information</h3>
                <div
                  style={{
                    display: "grid",
                    gap: "0.6rem",
                    marginTop: "0.9rem",
                  }}
                >
                  <p className="text-secondary" style={{ margin: 0 }}>
                    📍 Keep your address accurate so customers can find you
                    easily.
                  </p>
                  <p className="text-secondary" style={{ margin: 0 }}>
                    🎨 Add a strong description and profile image to build
                    trust.
                  </p>
                  <p className="text-secondary" style={{ margin: 0 }}>
                    💰 Use bookings and availability together to manage your day
                    cleanly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.82rem",
        }}
      >
        {label}
      </p>
      <p style={{ margin: "0.35rem 0 0", fontSize: "1rem", fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
}
