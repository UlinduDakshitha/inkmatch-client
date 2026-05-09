"use client";

import { useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getArtistProfiles,
  getStudioProfiles,
  getCustomerProfiles,
  getBookings,
} from "@/utils/appData";

export default function AnalyticsDashboard() {
  const stats = useMemo(() => {
    const artists = getArtistProfiles();
    const studios = getStudioProfiles();
    const customers = getCustomerProfiles();
    const bookings = getBookings();

    return {
      totalUsers: artists.length + studios.length + customers.length,
      artists: artists.length,
      studios: studios.length,
      customers: customers.length,
      totalBookings: bookings.length,
      bookedBookings: bookings.filter((b) => b.status === "confirmed").length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      completedBookings: bookings.filter((b) => b.status === "completed")
        .length,
    };
  }, []);

  const userGrowthData = [
    { month: "Jan", users: 45, artists: 12, studios: 5, customers: 28 },
    { month: "Feb", users: 52, artists: 14, studios: 6, customers: 32 },
    { month: "Mar", users: 68, artists: 18, studios: 8, customers: 42 },
    { month: "Apr", users: 82, artists: 22, studios: 10, customers: 50 },
    {
      month: "May",
      users: stats.totalUsers,
      artists: stats.artists,
      studios: stats.studios,
      customers: stats.customers,
    },
  ];

  const bookingTrendData = [
    { date: "Mon", bookings: 8 },
    { date: "Tue", bookings: 12 },
    { date: "Wed", bookings: 15 },
    { date: "Thu", bookings: 11 },
    { date: "Fri", bookings: 18 },
    { date: "Sat", bookings: 25 },
    { date: "Sun", bookings: 14 },
  ];

  const userDistribution = [
    { name: "Artists", value: stats.artists, color: "#10b981" },
    { name: "Studios", value: stats.studios, color: "#c084fc" },
    { name: "Customers", value: stats.customers, color: "#22c55e" },
  ];

  const bookingStatusData = [
    { name: "Pending", value: stats.pendingBookings, color: "#f59e0b" },
    { name: "Confirmed", value: stats.bookedBookings, color: "#10b981" },
    { name: "Completed", value: stats.completedBookings, color: "#22c55e" },
  ];

  return (
    <AdminShell>
      <div style={{ paddingTop: "120px" }}>
        {/* Header */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            margin: "1.5rem",
            marginBottom: "0",
            border: "1px solid rgba(96,165,250,0.24)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 42%, rgba(88,28,135,0.20) 100%)",
          }}
        >
          <h1 className="heading-2" style={{ marginBottom: "0.5rem" }}>
            📈 Analytics Dashboard
          </h1>
          <p className="text-secondary">
            View system analytics, user growth, booking trends, and performance
            metrics.
          </p>
        </div>

        {/* Key Metrics */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              color: "#60a5fa",
              icon: "👥",
            },
            {
              title: "Artists",
              value: stats.artists,
              color: "#10b981",
              icon: "🎨",
            },
            {
              title: "Studios",
              value: stats.studios,
              color: "#c084fc",
              icon: "🏢",
            },
            {
              title: "Customers",
              value: stats.customers,
              color: "#22c55e",
              icon: "👤",
            },
            {
              title: "Total Bookings",
              value: stats.totalBookings,
              color: "#f59e0b",
              icon: "📅",
            },
            {
              title: "Conversion Rate",
              value: `${((stats.bookedBookings / stats.totalBookings) * 100).toFixed(1)}%`,
              color: "#ec4899",
              icon: "📊",
            },
          ].map((metric) => (
            <div
              key={metric.title}
              className="glass-card"
              style={{
                padding: "1rem",
                border: `1px solid ${metric.color}30`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{metric.icon}</span>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "0.85rem",
                  }}
                >
                  {metric.title}
                </p>
              </div>
              <p
                style={{
                  margin: "0",
                  color: metric.color,
                  fontSize: "1.85rem",
                  fontWeight: 800,
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* User Growth Chart */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              User Growth (Monthly)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="artists" stackId="a" fill="#10b981" />
                <Bar dataKey="studios" stackId="a" fill="#c084fc" />
                <Bar dataKey="customers" stackId="a" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Trend Chart */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              Weekly Booking Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ fill: "#60a5fa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              User Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              Booking Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              System Summary
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "Average Bookings/Day",
                  value: "3.2",
                  trend: "↑ +12% this week",
                },
                {
                  label: "User Retention Rate",
                  value: "87%",
                  trend: "↑ +3% this month",
                },
                {
                  label: "Avg Booking Value",
                  value: "$95",
                  trend: "↓ -5% this week",
                },
                {
                  label: "System Uptime",
                  value: "99.8%",
                  trend: "↑ Excellent",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "1rem",
                    background: "rgba(96,165,250,0.05)",
                    borderRadius: "10px",
                    border: "1px solid rgba(96,165,250,0.1)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.62)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      margin: "0.5rem 0 0",
                      color: "#60a5fa",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
