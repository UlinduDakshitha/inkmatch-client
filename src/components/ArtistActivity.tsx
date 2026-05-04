"use client";

import { useEffect, useState } from "react";
import { getNotificationsByUser, AppNotification } from "@/utils/appData";

interface ArtistActivityProps {
  artistEmail: string;
}

export default function ArtistActivity({ artistEmail }: ArtistActivityProps) {
  const [activities, setActivities] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const notifs = getNotificationsByUser(artistEmail);
    setActivities(notifs);
    setLoading(false);
  }, [artistEmail]);

  if (loading) {
    return (
      <div className="glass-card">
        <p className="text-secondary">Loading activity...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="glass-card">
        <p className="text-secondary">
          No activities yet. New bookings and updates will appear here.
        </p>
      </div>
    );
  }

  const getActivityIcon = (category: string): string => {
    switch (category) {
      case "BOOKING":
        return "📅";
      case "SYSTEM":
        return "⚙️";
      case "PROMOTION":
        return "🎉";
      default:
        return "📌";
    }
  };

  const getActivityColor = (category: string): string => {
    switch (category) {
      case "BOOKING":
        return "rgba(59, 130, 246, 0.1)"; // Blue
      case "SYSTEM":
        return "rgba(34, 197, 94, 0.1)"; // Green
      case "PROMOTION":
        return "rgba(168, 85, 247, 0.1)"; // Purple
      default:
        return "rgba(107, 114, 128, 0.1)"; // Gray
    }
  };

  return (
    <div>
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
          📊 <strong>Your Activity Feed</strong>: Track your bookings,
          confirmations, rejections, and system updates here.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="glass-card"
            style={{
              background: getActivityColor(activity.category),
              borderLeft: `4px solid ${
                activity.category === "BOOKING"
                  ? "#60a5fa"
                  : activity.category === "SYSTEM"
                    ? "#34d399"
                    : activity.category === "PROMOTION"
                      ? "#a855f7"
                      : "#9ca3af"
              }`,
              paddingLeft: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>
                    {getActivityIcon(activity.category)}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    {activity.title}
                  </h3>
                  {!activity.isRead && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#60a5fa",
                        marginLeft: "0.5rem",
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.95rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.5",
                  }}
                >
                  {activity.message}
                </p>
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "right",
                  marginLeft: "1rem",
                  minWidth: "80px",
                }}
              >
                {new Date(activity.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
