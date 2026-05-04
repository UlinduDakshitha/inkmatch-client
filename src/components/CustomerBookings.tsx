"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/utils/appData";

interface Booking {
  id: number;
  artistId?: string | number;
  studioId?: string | number;
  artist?: {
    fullName: string;
    email?: string;
  };
  studio?: {
    name: string;
    email?: string;
  };
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED";
  createdAt?: string;
}

interface CustomerBookingsProps {
  customerId: string | number;
}

export default function CustomerBookings({
  customerId,
}: CustomerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [retrying, setRetrying] = useState(false);

  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED"
  >("ALL");

  useEffect(() => {
    fetchBookings();
  }, [customerId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/customer/${customerId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = (err as any).message || String(err);
      try {
        const local = getBookings().filter(
          (b) =>
            b.customerEmail === String(customerId) ||
            String(b.customerEmail) === String(customerId),
        );

        const mapped = local.map((b) => ({
          id:
            typeof b.id === "string" && !Number.isNaN(Number(b.id))
              ? Number(b.id)
              : b.id,
          artistId: b.targetType === "ARTIST" ? b.targetId : undefined,
          studioId: b.targetType === "STUDIO" ? b.targetId : undefined,
          artist:
            b.targetType === "ARTIST"
              ? { fullName: b.targetName, email: undefined }
              : undefined,
          studio:
            b.targetType === "STUDIO"
              ? { name: b.targetName, email: undefined }
              : undefined,
          date: b.appointmentDate?.includes("T")
            ? b.appointmentDate.split("T")[0]
            : b.appointmentDate || "",
          time: b.appointmentDate?.includes("T")
            ? b.appointmentDate.split("T")[1]
            : "",
          status: b.status as any,
          createdAt: b.createdAt,
        }));

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Waiting for artist/studio to confirm";
      case "CONFIRMED":
        return "Your booking is confirmed! See you soon!";
      case "REJECTED":
        return "Unfortunately, this booking was rejected";
      case "COMPLETED":
        return "Booking completed successfully";
      default:
        return status;
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const rejectedBookings = bookings.filter((b) => b.status === "REJECTED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  const filteredBookings =
    filterStatus === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

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
            borderLeft: "4px solid #10b981",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => setFilterStatus("CONFIRMED")}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(16, 185, 129, 0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
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
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => setFilterStatus("REJECTED")}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(239, 68, 68, 0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
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
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => setFilterStatus("COMPLETED")}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(139, 92, 246, 0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
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

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFilterStatus("ALL")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border:
              filterStatus === "ALL"
                ? "1px solid #60a5fa"
                : "1px solid rgba(255, 255, 255, 0.2)",
            background:
              filterStatus === "ALL"
                ? "rgba(59, 130, 246, 0.2)"
                : "transparent",
            color:
              filterStatus === "ALL" ? "#60a5fa" : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("PENDING")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border:
              filterStatus === "PENDING"
                ? "1px solid #f59e0b"
                : "1px solid rgba(255, 255, 255, 0.2)",
            background:
              filterStatus === "PENDING"
                ? "rgba(245, 158, 11, 0.2)"
                : "transparent",
            color:
              filterStatus === "PENDING"
                ? "#f59e0b"
                : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("CONFIRMED")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border:
              filterStatus === "CONFIRMED"
                ? "1px solid #10b981"
                : "1px solid rgba(255, 255, 255, 0.2)",
            background:
              filterStatus === "CONFIRMED"
                ? "rgba(16, 185, 129, 0.2)"
                : "transparent",
            color:
              filterStatus === "CONFIRMED"
                ? "#10b981"
                : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilterStatus("REJECTED")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border:
              filterStatus === "REJECTED"
                ? "1px solid #ef4444"
                : "1px solid rgba(255, 255, 255, 0.2)",
            background:
              filterStatus === "REJECTED"
                ? "rgba(239, 68, 68, 0.2)"
                : "transparent",
            color:
              filterStatus === "REJECTED"
                ? "#ef4444"
                : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilterStatus("COMPLETED")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border:
              filterStatus === "COMPLETED"
                ? "1px solid #8b5cf6"
                : "1px solid rgba(255, 255, 255, 0.2)",
            background:
              filterStatus === "COMPLETED"
                ? "rgba(139, 92, 246, 0.2)"
                : "transparent",
            color:
              filterStatus === "COMPLETED"
                ? "#8b5cf6"
                : "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Completed
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="glass-card"
          style={{
            marginBottom: "1.5rem",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            background: "rgba(239, 68, 68, 0.1)",
            padding: "1.5rem",
          }}
        >
          <p
            style={{
              color: "#ef4444",
              margin: "0 0 0.5rem 0",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            ⚠️ Error Loading Bookings
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
              fontSize: "0.85rem",
            }}
          >
            {error}
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              margin: "0.5rem 0 0 0",
              fontSize: "0.8rem",
            }}
          >
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            padding: "2.5rem",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            background: "rgba(59, 130, 246, 0.05)",
          }}
        >
          <p
            style={{
              fontSize: "3.5rem",
              margin: "0 0 1rem 0",
            }}
          >
            📭
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              margin: "0 0 0.5rem 0",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            {filterStatus === "ALL"
              ? "No bookings found"
              : `No ${filterStatus.toLowerCase()} bookings`}
          </p>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0 0 1.5rem 0",
              fontSize: "0.9rem",
            }}
          >
            {filterStatus === "ALL"
              ? "You haven't scheduled any consultations yet. Start by browsing our talented artists and studios to find your perfect match!"
              : `There are no bookings with ${filterStatus.toLowerCase()} status. Check other status filters or schedule a new consultation.`}
          </p>
          <button
            onClick={() => {
              if (filterStatus !== "ALL") {
                setFilterStatus("ALL");
              }
            }}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              background: "rgba(59, 130, 246, 0.3)",
              border: "1px solid rgba(59, 130, 246, 0.6)",
              color: "#60a5fa",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(59, 130, 246, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(59, 130, 246, 0.3)";
            }}
          >
            {filterStatus === "ALL"
              ? "✨ Schedule First Booking"
              : "View All Bookings"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredBookings.map((booking) => (
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
                    {booking.artist?.fullName ||
                      booking.studio?.name ||
                      "Unknown"}
                  </h3>
                  {(booking.artist?.email || booking.studio?.email) && (
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      📧 {booking.artist?.email || booking.studio?.email}
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

              {/* Status Message */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: `${getStatusColor(booking.status)}15`,
                  border: `1px solid ${getStatusColor(booking.status)}40`,
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: getStatusColor(booking.status),
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {getStatusMessage(booking.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
