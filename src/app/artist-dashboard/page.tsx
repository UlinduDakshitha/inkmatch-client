"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, normalizeRole } from "@/utils/appData";
import ArtistAvailability from "@/components/ArtistAvailability";
import Link from "next/link";

export default function ArtistDashboardPage() {
  const user = getCurrentUser();
  const role = normalizeRole(user?.role);
  const [activeTab, setActiveTab] = useState("availability");

  if (!user?.email) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Please log in first</h1>
          <p className="text-secondary mt-2">
            You need to be logged in to access the artist dashboard.
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

  if (role !== "ARTIST") {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Artist access only</h1>
          <p className="text-secondary mt-2">
            This page is for registered artists only.
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
        Artist <span className="text-gradient">Dashboard</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        Manage your profile and availability.
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
          onClick={() => setActiveTab("availability")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px 8px 0 0",
            background:
              activeTab === "availability"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color:
              activeTab === "availability"
                ? "#60a5fa"
                : "rgba(255, 255, 255, 0.6)",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          className="hover:text-white"
        >
          Manage Availability
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
          Profile
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "availability" && (
        <div style={{ marginBottom: "3rem" }}>
          {/* Info Box */}
          <div
            className="glass-card"
            style={{
              marginBottom: "2rem",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              background: "rgba(34, 197, 94, 0.05)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              ✨ <strong>Unified Calendar</strong>: Set your availability times
              below. Slots marked with 📅 are booked by customers in real-time.
              You can block times by toggling them, but cannot remove customer
              bookings directly.
            </p>
          </div>
          <ArtistAvailability artistId={user.id || user.email} />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="glass-card">
          <h2 className="heading-3">Your Profile</h2>
          <p className="text-secondary mt-4">
            <strong>Name:</strong> {user.name || "Not set"}
          </p>
          <p className="text-secondary mt-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-secondary mt-2">
            <strong>Role:</strong> {role}
          </p>
          <p className="text-secondary mt-4" style={{ fontSize: "0.875rem" }}>
            More profile editing features coming soon...
          </p>
        </div>
      )}
    </div>
  );
}
