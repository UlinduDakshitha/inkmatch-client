"use client";

import { useEffect, useState } from "react";
import {
  getBookings,
  updateBookingStatus,
  addNotification,
  getCurrentUser,
} from "@/utils/appData";

interface Booking {
  id: number;
  customerId: string | number;
  customer: {
    fullName: string;
    email?: string;
  };
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED";
  createdAt?: string;
}

interface ArtistBookingsProps {
  artistId: string | number;
}

export default function ArtistBookings({ artistId }: ArtistBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | number | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [artistId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/artist/${artistId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = (err as any).message || String(err);
      // Attempt to load local bookings as a fallback
      try {
        const local = getBookings().filter(
          (b) =>
            b.targetType === "ARTIST" &&
            String(b.targetId) === String(artistId),
        );

        const mapped = local.map((b) => {
          let date = "";
          let time = "";
          if (b.appointmentDate) {
            if (b.appointmentDate.includes("T")) {
              const parts = b.appointmentDate.split("T");
              date = parts[0];
              time = parts[1];
            } else {
              date = b.appointmentDate;
            }
          }

          return {
            id:
              typeof b.id === "string" && !Number.isNaN(Number(b.id))
                ? Number(b.id)
                : b.id,
            customerId: b.customerEmail || b.customerName,
            customer: {
              fullName: b.customerName || "",
              email: b.customerEmail || undefined,
            },
            date,
            time,
            status:
              (b.status as any) === "CANCELLED"
                ? "REJECTED"
                : (b.status as any),
            createdAt: b.createdAt,
          } as Booking;
        });

        setBookings(mapped);
        setError(
          "Failed to load bookings from backend: " +
            msg +
            ". Showing local bookings.",
        );
      } catch (localErr) {
        setError("Failed to load bookings: " + msg);
        setBookings([]);
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchBookings();
  };

  const confirm = async (id: string | number) => {
    setActionLoading(id);
    setSuccessMessage("");
    const artist = getCurrentUser();
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/confirm/${id}`,
        { method: "PUT" },
      );

      if (!response.ok) {
        throw new Error("Failed to confirm booking");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "CONFIRMED" as const } : b,
        ),
      );

      // Log activity notification for artist
      const booking = bookings.find((b) => b.id === id);
      if (booking && artist?.email) {
        addNotification({
          userEmail: artist.email,
          title: "✅ Booking Confirmed",
          message: `You confirmed a booking with ${booking.customer.fullName} for ${booking.date} at ${booking.time}`,
          isRead: false,
          category: "BOOKING",
        });
      }

      // Notify customer of confirmation
      if (booking) {
        addNotification({
          userEmail: booking.customer.email || String(booking.customerId),
          title: "✅ Booking Confirmed",
          message: `Your booking for ${booking.date} at ${booking.time} has been confirmed!`,
          isRead: false,
          category: "BOOKING",
        });
      }

      setSuccessMessage("✅ Booking confirmed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // Try to persist confirmation locally
      try {
        updateBookingStatus(String(id), "CONFIRMED");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "CONFIRMED" as const } : b,
          ),
        );

        // Log activity notification for artist
        const booking = bookings.find((b) => b.id === id);
        if (booking && artist?.email) {
          addNotification({
            userEmail: artist.email,
            title: "✅ Booking Confirmed",
            message: `You confirmed a booking with ${booking.customer.fullName} for ${booking.date} at ${booking.time}`,
            isRead: false,
            category: "BOOKING",
          });
        }

        // Notify customer of confirmation
        if (booking) {
          addNotification({
            userEmail: booking.customer.email || String(booking.customerId),
            title: "✅ Booking Confirmed",
            message: `Your booking for ${booking.date} at ${booking.time} has been confirmed!`,
            isRead: false,
            category: "BOOKING",
          });
        }

        setSuccessMessage("✅ Booking confirmed locally (offline)");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (localErr) {
        setError("Error confirming booking: " + (err as any).message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: string | number) => {
    setActionLoading(id);
    setSuccessMessage("");
    const artist = getCurrentUser();
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/reject/${id}`,
        { method: "PUT" },
      );

      if (!response.ok) {
        throw new Error("Failed to reject booking");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "REJECTED" as const } : b,
        ),
      );

      // Log activity notification for artist
      const booking = bookings.find((b) => b.id === id);
      if (booking && artist?.email) {
        addNotification({
          userEmail: artist.email,
          title: "❌ Booking Declined",
          message: `You declined a booking request from ${booking.customer.fullName} for ${booking.date} at ${booking.time}`,
          isRead: false,
          category: "BOOKING",
        });
      }

      // Notify customer of rejection
      if (booking) {
        addNotification({
          userEmail: booking.customer.email || String(booking.customerId),
          title: "❌ Booking Declined",
          message: `Your booking request for ${booking.date} at ${booking.time} has been declined. Please try another date or artist.`,
          isRead: false,
          category: "BOOKING",
        });
      }

      setSuccessMessage("❌ Booking rejected");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // Try to persist rejection locally (map to CANCELLED in storage)
      try {
        updateBookingStatus(String(id), "CANCELLED");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "REJECTED" as const } : b,
          ),
        );

        // Log activity notification for artist
        const booking = bookings.find((b) => b.id === id);
        if (booking && artist?.email) {
          addNotification({
            userEmail: artist.email,
            title: "❌ Booking Declined",
            message: `You declined a booking request from ${booking.customer.fullName} for ${booking.date} at ${booking.time}`,
            isRead: false,
            category: "BOOKING",
          });
        }

        // Notify customer of rejection
        if (booking) {
          addNotification({
            userEmail: booking.customer.email || String(booking.customerId),
            title: "❌ Booking Declined",
            message: `Your booking request for ${booking.date} at ${booking.time} has been declined. Please try another date or artist.`,
            isRead: false,
            category: "BOOKING",
          });
        }

        setSuccessMessage("❌ Booking rejected locally (offline)");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (localErr) {
        setError("Error rejecting booking: " + (err as any).message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b"; // Amber
      case "CONFIRMED":
        return "#10b981"; // Green
      case "REJECTED":
        return "#ef4444"; // Red
      case "COMPLETED":
        return "#8b5cf6"; // Purple
      default:
        return "#6b7280"; // Gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "CONFIRMED":
        return "✅";
      case "REJECTED":
        return "❌";
      case "COMPLETED":
        return "🎉";
      default:
        return "❓";
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const rejectedBookings = bookings.filter((b) => b.status === "REJECTED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  if (loading) {
    return (
      <div
        className="glass-card"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            borderLeft: "4px solid #f59e0b",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>
            {pendingBookings.length}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Pending
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            textAlign: "center",
            borderLeft: "4px solid #10b981",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>
            {confirmedBookings.length}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Confirmed
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            textAlign: "center",
            borderLeft: "4px solid #ef4444",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>
            {rejectedBookings.length}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Rejected
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            textAlign: "center",
            borderLeft: "4px solid #8b5cf6",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>
            {completedBookings.length}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Completed
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="glass-card"
          style={{
            marginBottom: "1.5rem",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            background: "rgba(239, 68, 68, 0.08)",
            padding: "1rem",
          }}
        >
          <p
            style={{
              color: "#ef4444",
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            ⚠️ Error Loading Bookings
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "0.5rem 0 0 0" }}>
            {error}
          </p>

          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="btn-primary"
              style={{ padding: "0.5rem 0.75rem" }}
            >
              {retrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="glass-card"
          style={{
            marginBottom: "1.5rem",
            border: "1px solid rgba(34, 197, 94, 0.5)",
            background: "rgba(34, 197, 94, 0.1)",
            padding: "1rem",
          }}
        >
          <p style={{ color: "#22c55e", margin: 0, fontSize: "0.9rem" }}>
            {successMessage}
          </p>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div
          className="glass-card"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p
            style={{
              fontSize: "3rem",
              margin: "0 0 1rem 0",
            }}
          >
            📭
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
            }}
          >
            No bookings yet. When customers book consultations, they'll appear
            here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card"
              style={{
                padding: "1.5rem",
                borderLeft: `4px solid ${getStatusColor(booking.status)}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3 className="heading-4" style={{ margin: "0 0 0.5rem 0" }}>
                    {booking.customer.fullName}
                  </h3>
                  {booking.customer.email && (
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      📧 {booking.customer.email}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.875rem",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      background: `${getStatusColor(booking.status)}20`,
                      color: getStatusColor(booking.status),
                      fontWeight: "500",
                    }}
                  >
                    {getStatusIcon(booking.status)} {booking.status}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    📅 Date
                  </p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "500" }}>
                    {new Date(booking.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 0.25rem 0",
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    ⏰ Time
                  </p>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: "500" }}>
                    {booking.time}
                  </p>
                </div>
              </div>

              {booking.status === "PENDING" && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    onClick={() => confirm(booking.id)}
                    disabled={actionLoading === booking.id}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      opacity: actionLoading === booking.id ? 0.6 : 1,
                      cursor: actionLoading === booking.id ? "wait" : "pointer",
                    }}
                  >
                    {actionLoading === booking.id
                      ? "Confirming..."
                      : "✅ Accept Request"}
                  </button>

                  <button
                    onClick={() => reject(booking.id)}
                    disabled={actionLoading === booking.id}
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      cursor: actionLoading === booking.id ? "wait" : "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.2s",
                      opacity: actionLoading === booking.id ? 0.6 : 1,
                    }}
                  >
                    {actionLoading === booking.id
                      ? "Rejecting..."
                      : "❌ Reject Request"}
                  </button>
                </div>
              )}

              {booking.status === "CONFIRMED" && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#10b981",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    ✅ This booking is confirmed
                  </p>
                </div>
              )}

              {booking.status === "REJECTED" && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#ef4444",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    ❌ This booking was rejected
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
