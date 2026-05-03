"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/appData";
import CustomerBookings from "@/components/CustomerBookings";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState("bookings");

  if (!user?.email) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Please log in first</h1>
          <p className="text-secondary mt-2">
            You need to be logged in to access your dashboard.
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

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        My <span className="text-gradient">Bookings</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        View and manage all your consultation bookings.
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
          My Bookings
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
        <button
          onClick={() => setActiveTab("actions")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px 8px 0 0",
            background:
              activeTab === "actions"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color:
              activeTab === "actions" ? "#60a5fa" : "rgba(255, 255, 255, 0.6)",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          className="hover:text-white"
        >
          Quick Actions
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
              ℹ️ Track all your consultation bookings. Click the status badges
              above to filter by booking status.
            </p>
          </div>
          <CustomerBookings customerId={user.id || user.email} />
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
            <strong>User ID:</strong> {user.id || "Not available"}
          </p>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 className="heading-4">Account Information</h3>
            <p
              className="text-secondary"
              style={{ marginTop: "1rem", fontSize: "0.875rem" }}
            >
              🎨 Upload profile photo and bio coming soon...
            </p>
            <p
              className="text-secondary"
              style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              🔔 Notification preferences coming soon...
            </p>
            <p
              className="text-secondary"
              style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
            >
              🔐 Update password and security settings coming soon...
            </p>
          </div>
        </div>
      )}

      {activeTab === "actions" && (
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Schedule New Booking */}
            <Link href="/schedule-consultation">
              <div
                className="glass-card"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(59, 130, 246, 0.8)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(59, 130, 246, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(59, 130, 246, 0.3)";
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <p style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>✨</p>
                <h3
                  className="heading-4"
                  style={{ margin: "0 0 0.5rem 0", color: "#60a5fa" }}
                >
                  Schedule New Booking
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Book a consultation with your favorite artist
                </p>
              </div>
            </Link>

            {/* View Artists */}
            <Link href="/artists">
              <div
                className="glass-card"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(34, 197, 94, 0.8)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(34, 197, 94, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(34, 197, 94, 0.3)";
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <p style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>👨‍🎨</p>
                <h3
                  className="heading-4"
                  style={{ margin: "0 0 0.5rem 0", color: "#22c55e" }}
                >
                  Browse Artists
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Discover talented tattoo artists
                </p>
              </div>
            </Link>

            {/* View Studios */}
            <Link href="/studios">
              <div
                className="glass-card"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(139, 92, 246, 0.8)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(139, 92, 246, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(139, 92, 246, 0.3)";
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <p style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>🏢</p>
                <h3
                  className="heading-4"
                  style={{ margin: "0 0 0.5rem 0", color: "#8b5cf6" }}
                >
                  Browse Studios
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Explore professional tattoo studios
                </p>
              </div>
            </Link>

            {/* Favorites */}
            <Link href="/favorites">
              <div
                className="glass-card"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: "1px solid rgba(248, 113, 113, 0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(248, 113, 113, 0.8)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(248, 113, 113, 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(248, 113, 113, 0.3)";
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <p style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>❤️</p>
                <h3
                  className="heading-4"
                  style={{ margin: "0 0 0.5rem 0", color: "#f87171" }}
                >
                  My Favorites
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  View your saved favorites
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
