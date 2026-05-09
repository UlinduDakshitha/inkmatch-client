"use client";

import { useState, useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import { getBookings } from "@/utils/appData";

type BookingDisplay = {
  id: string;
  customerName: string;
  targetName: string;
  targetType: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  appointmentDate: string;
  amount?: string;
};

export default function BookingsMonitoringPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const bookings = useMemo<BookingDisplay[]>(() => {
    return getBookings().map((booking) => ({
      id: booking.id,
      customerName: booking.customerName,
      targetName: booking.targetName,
      targetType: booking.targetType,
      status: (booking.status || "pending") as BookingDisplay["status"],
      appointmentDate: booking.appointmentDate,
      amount: `$${(Math.random() * 200 + 50).toFixed(0)}`,
    }));
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchStatus =
        filterStatus === "all" || booking.status === filterStatus;
      const matchSearch =
        booking.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  const statusColors: Record<BookingDisplay["status"], string> = {
    pending: "#f59e0b",
    confirmed: "#10b981",
    completed: "#22c55e",
    cancelled: "#ef4444",
  };

  const statusIcons: Record<BookingDisplay["status"], string> = {
    pending: "⏳",
    confirmed: "✓",
    completed: "✅",
    cancelled: "✕",
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

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
            📅 Monitor Bookings
          </h1>
          <p className="text-secondary">
            Track all bookings across the platform. View status, dates, and
            customer details.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "Total", value: stats.total, color: "#60a5fa" },
            { label: "Pending", value: stats.pending, color: "#f59e0b" },
            { label: "Confirmed", value: stats.confirmed, color: "#10b981" },
            { label: "Completed", value: stats.completed, color: "#22c55e" },
            { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card"
              style={{
                padding: "1rem",
                border: `1px solid ${stat.color}30`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: "0.85rem",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  color: stat.color,
                  fontSize: "1.85rem",
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "rgba(255,255,255,0.72)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Search bookings
            </label>
            <input
              type="text"
              placeholder="Customer, artist/studio, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "white",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "rgba(255,255,255,0.72)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Filter by status
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "pending"
                    | "confirmed"
                    | "completed"
                    | "cancelled",
                )
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "white",
                fontSize: "0.95rem",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(96,165,250,0.12)",
                    background: "rgba(96,165,250,0.05)",
                  }}
                >
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Booking ID
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Artist / Studio
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      color: "rgba(255,255,255,0.72)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "2rem 1rem",
                        textAlign: "center",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderBottom: "1px solid rgba(96,165,250,0.08)",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          color: "#60a5fa",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        #{booking.id.slice(0, 8)}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "white",
                        }}
                      >
                        {booking.customerName}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        <div>{booking.targetName}</div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {booking.targetType}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {booking.appointmentDate}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            background: `${statusColors[booking.status]}20`,
                            color: statusColors[booking.status],
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {statusIcons[booking.status]} {booking.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() =>
                            alert(
                              `View booking details for ${booking.customerName}`,
                            )
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#60a5fa",
                            cursor: "pointer",
                            textDecoration: "underline",
                            fontSize: "0.9rem",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "1rem",
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.9rem",
            }}
          >
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
