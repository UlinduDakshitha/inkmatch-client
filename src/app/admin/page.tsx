"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getAdminProfiles,
  getArtistProfiles,
  getBookings,
  getCustomerProfiles,
  getNotifications,
  getStudioProfiles,
} from "@/utils/appData";

type AdminStats = {
  users: number;
  artists: number;
  bookings: number;
  pendingArtists: number;
  studios?: number;
  customers?: number;
  notifications?: number;
};


type DashboardCard = {
  title: string;
  value: string | number;
  accent: string;
  note: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [source, setSource] = useState<"backend" | "local">("local");
  const [error, setError] = useState<string>("");

  const localStats = useMemo<AdminStats>(() => {
    const artists = getArtistProfiles();
    const studios = getStudioProfiles();
    const customers = getCustomerProfiles();
    const bookings = getBookings();
    const notifications = getNotifications();
    const admins = getAdminProfiles();

    return {
      users: artists.length + studios.length + customers.length + admins.length,
      artists: artists.length,
      bookings: bookings.length,
      pendingArtists: artists.length,
      studios: studios.length,
      customers: customers.length,
      notifications: notifications.length,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("http://localhost:8080/api/admin/stats");
        if (!response.ok) {
          throw new Error(`Stats endpoint returned ${response.status}`);
        }

        const data = (await response.json()) as AdminStats;
        if (!cancelled) {
          setStats({
            ...localStats,
            ...data,
          });
          setSource("backend");
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setStats(localStats);
          setSource("local");
          setError(
            "Backend admin stats unavailable. Showing local system data.",
          );
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [localStats]);

  if (!stats) return <p className="text-white p-6">Loading admin console...</p>;

  const data = [
    { name: "Users", value: stats.users },
    { name: "Artists", value: stats.artists },
    { name: "Studios", value: stats.studios ?? 0 },
    { name: "Bookings", value: stats.bookings },
    { name: "Pending Artists", value: stats.pendingArtists },
  ];

  const cards: DashboardCard[] = [
    {
      title: "Total Users",
      value: stats.users,
      accent: "#60a5fa",
      note:
        source === "backend"
          ? "Backend + local summary"
          : "Local system snapshot",
    },
    {
      title: "Artists",
      value: stats.artists,
      accent: "#10b981",
      note: `${stats.pendingArtists} pending verification`,
    },
    {
      title: "Studios",
      value: stats.studios ?? 0,
      accent: "#c084fc",
      note: "Registered studio accounts",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      accent: "#f59e0b",
      note: "All tracked consultations and studio bookings",
    },
    {
      title: "Customers",
      value: stats.customers ?? 0,
      accent: "#22c55e",
      note: "Active customer profiles",
    },
    {
      title: "Notifications",
      value: stats.notifications ?? 0,
      accent: "#fb7185",
      note: "Unread + system alerts in store",
    },
  ];

  const recentBookings = getBookings().slice(0, 5);
  const recentArtists = getArtistProfiles().slice(0, 5);
  const recentStudios = getStudioProfiles().slice(0, 5);

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          marginBottom: "1.5rem",
          border: "1px solid rgba(96,165,250,0.24)",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 42%, rgba(88,28,135,0.20) 100%)",
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
                color: "rgba(255,255,255,0.62)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.82rem",
              }}
            >
              Administrator Console
            </p>
            <h1 className="heading-2" style={{ marginTop: "0.5rem" }}>
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-secondary mt-2" style={{ maxWidth: "760px" }}>
              Review the whole system in one place. Track users, bookings,
              studios, artists, notifications, and verification activity from a
              single command center.
            </p>
          </div>

          <div
            style={{
              minWidth: "240px",
              padding: "1rem 1.1rem",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.62)",
                fontSize: "0.82rem",
              }}
            >
              Data source
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "1rem",
                fontWeight: 700,
              }}
            >
              {source === "backend" ? "Backend API" : "Local fallback"}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.84rem",
              }}
            >
              {error || "Live console ready"}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="glass-card"
            style={{
              padding: "1rem 1.1rem",
              border: `1px solid ${card.accent}30`,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.62)",
                fontSize: "0.82rem",
              }}
            >
              {card.title}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: card.accent,
                fontSize: "1.85rem",
                fontWeight: 800,
              }}
            >
              {card.value}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.84rem",
              }}
            >
              {card.note}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.9fr)",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        <section className="glass-card" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2 className="heading-3" style={{ marginBottom: "0.25rem" }}>
                System Overview
              </h2>
              <p className="text-secondary">
                User base, bookings, and verification status in one chart.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Link href="/admin/verification" className="btn-primary">
                Artist Verification
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                Main Dashboard
              </Link>
            </div>
          </div>

          <div
            className="h-80 bg-white/5 p-4 rounded-xl"
            style={{ minHeight: "320px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                  labelStyle={{ color: "white" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={{ display: "grid", gap: "1rem" }}>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h3 className="heading-4" style={{ marginBottom: "0.8rem" }}>
              Management Links
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <Link href="/admin/verification" className="btn-primary">
                Review Artists
              </Link>
              <Link href="/artists" className="btn-secondary">
                Browse Artists
              </Link>
              <Link href="/studios" className="btn-secondary">
                Browse Studios
              </Link>
              <Link href="/bookings" className="btn-secondary">
                View Bookings
              </Link>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h3 className="heading-4" style={{ marginBottom: "0.8rem" }}>
              Live System Snapshot
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <SnapshotRow
                label="Artists"
                value={String(recentArtists.length)}
              />
              <SnapshotRow
                label="Studios"
                value={String(recentStudios.length)}
              />
              <SnapshotRow
                label="Bookings"
                value={String(recentBookings.length)}
              />
              <SnapshotRow
                label="Notifications"
                value={String(stats.notifications ?? 0)}
              />
              <SnapshotRow
                label="Verification queue"
                value={String(stats.pendingArtists)}
              />
            </div>
          </div>
        </section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "1.25rem",
        }}
      >
        <ListPanel title="Recent Bookings" accent="#f59e0b">
          {recentBookings.length === 0 ? (
            <EmptyState text="No bookings stored yet." />
          ) : (
            recentBookings.map((booking) => (
              <ListItem
                key={booking.id}
                title={`${booking.customerName} → ${booking.targetName}`}
                subtitle={`${booking.targetType} | ${booking.status} | ${booking.appointmentDate}`}
              />
            ))
          )}
        </ListPanel>

        <ListPanel title="Artists Pending Review" accent="#10b981">
          {recentArtists.length === 0 ? (
            <EmptyState text="No artist profiles found." />
          ) : (
            recentArtists.map((artist) => (
              <ListItem
                key={artist.id}
                title={artist.ownerName || "Unnamed artist"}
                subtitle={`${artist.style || "Style not set"} | ${artist.location || "Location not set"}`}
              />
            ))
          )}
        </ListPanel>

        <ListPanel title="Registered Studios" accent="#c084fc">
          {recentStudios.length === 0 ? (
            <EmptyState text="No studio profiles found." />
          ) : (
            recentStudios.map((studio) => (
              <ListItem
                key={studio.id}
                title={studio.name || "Unnamed studio"}
                subtitle={`${studio.address || "Address not set"} | ${studio.ownerName || "Owner missing"}`}
              />
            ))
          )}
        </ListPanel>
      </div>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.8rem 0.9rem",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.68)" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ListPanel({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem",
        border: `1px solid ${accent}22`,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <h3
        className="heading-4"
        style={{ marginBottom: "0.85rem", color: accent }}
      >
        {title}
      </h3>
      <div style={{ display: "grid", gap: "0.75rem" }}>{children}</div>
    </div>
  );
}

function ListItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        padding: "0.95rem 1rem",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: "rgba(255,255,255,0.65)",
          fontSize: "0.86rem",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.68)",
      }}
    >
      {text}
    </div>
  );
}
