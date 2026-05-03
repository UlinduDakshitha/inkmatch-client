"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, normalizeRole } from "@/utils/appData";
import StudioBookings from "@/components/StudioBookings";
import Link from "next/link";

export default function StudioDashboardPage() {
  const user = getCurrentUser();
  const role = normalizeRole(user?.role);
  const [activeTab, setActiveTab] = useState("bookings");

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

  if (role !== "STUDIO") {
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
      <h1 className="heading-2">
        Studio <span className="text-gradient">Dashboard</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        Manage your bookings and studio profile.
      </p>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "1rem",
        }}
      >
        <button
          onClick={() => setActiveTab("bookings")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px 8px 0 0",
            background:
              activeTab === "bookings"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color:
              activeTab === "bookings" ? "#60a5fa" : "rgba(255, 255, 255, 0.6)",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          className="hover:text-white"
        >
          Booking Requests
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px 8px 0 0",
            background:
              activeTab === "profile"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color:
              activeTab === "profile" ? "#60a5fa" : "rgba(255, 255, 255, 0.6)",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          className="hover:text-white"
        >
          Studio Profile
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "bookings" && (
        <div style={{ marginBottom: "3rem" }}>
          {/* Info Box */}
          <div
            className="glass-card"
            style={{
              marginBottom: "2rem",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              background: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              ℹ️ Manage all booking requests for your studio. Accept or reject
              customer bookings and track your revenue. All confirmations are
              final.
            </p>
          </div>
          <StudioBookings studioId={user.id || user.email} />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="glass-card">
          <h2 className="heading-3">Studio Profile</h2>
          <p className="text-secondary mt-4">
            <strong>Studio Name:</strong> {user.name || "Not set"}
          </p>
          <p className="text-secondary mt-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-secondary mt-2">
            <strong>Role:</strong> {role}
          </p>
          <p className="text-secondary mt-2">
            <strong>User ID:</strong> {user.id || "Not available"}
          </p>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 className="heading-4">Studio Information</h3>
            <p
              className="text-secondary"
              style={{ marginTop: "1rem", fontSize: "0.875rem" }}
            >
              📍 Location details and studio settings coming soon...
            </p>
            <p
              className="text-secondary"
              style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              🎨 Edit studio styles, hours, and services coming soon...
            </p>
            <p
              className="text-secondary"
              style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              💰 View revenue and earnings reports coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
