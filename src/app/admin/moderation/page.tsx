"use client";

import { useState, useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import { getNotifications, getAdminProfiles } from "@/utils/appData";

type ModerationItem = {
  id: string;
  type: "comment" | "profile" | "message" | "image";
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reportedAt: string;
  content: string;
};

export default function ModerationPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "reviewed" | "resolved" | "dismissed"
  >("pending");
  const [filterType, setFilterType] = useState<
    "all" | "comment" | "profile" | "message" | "image"
  >("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const moderationItems = useMemo<ModerationItem[]>(() => {
    const notifications = getNotifications();
    return notifications.slice(0, 10).map((notif, idx) => ({
      id: `mod-${idx}`,
      type: ["comment", "profile", "message", "image"][idx % 4] as any,
      reportedBy: `User ${idx}`,
      reportedUser: `Artist ${idx + 1}`,
      reason: [
        "Inappropriate content",
        "Spam",
        "Misleading information",
        "Offensive language",
      ][idx % 4],
      status: idx % 4 === 0 ? "pending" : "reviewed",
      reportedAt: new Date(Date.now() - idx * 86400000)
        .toISOString()
        .split("T")[0],
      content: "Sample content that needs review...",
    }));
  }, []);

  const filteredItems = useMemo(() => {
    return moderationItems.filter((item) => {
      const matchStatus =
        filterStatus === "all" || item.status === filterStatus;
      const matchType = filterType === "all" || item.type === filterType;
      return matchStatus && matchType;
    });
  }, [moderationItems, filterStatus, filterType]);

  const handleToggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleApprove = () => {
    if (selectedItems.size === 0) return;
    alert(`Approved ${selectedItems.size} item(s).`);
    setSelectedItems(new Set());
  };

  const handleRemove = () => {
    if (selectedItems.size === 0) return;
    alert(`Removed ${selectedItems.size} item(s) from platform.`);
    setSelectedItems(new Set());
  };

  const handleSuspendUser = () => {
    if (selectedItems.size === 0) return;
    alert(`Suspended user(s) responsible for ${selectedItems.size} item(s).`);
    setSelectedItems(new Set());
  };

  const statusColors: Record<ModerationItem["status"], string> = {
    pending: "#f59e0b",
    reviewed: "#60a5fa",
    resolved: "#10b981",
    dismissed: "#8b5cf6",
  };

  const typeIcons: Record<ModerationItem["type"], string> = {
    comment: "💬",
    profile: "👤",
    message: "✉️",
    image: "🖼️",
  };

  const stats = {
    total: moderationItems.length,
    pending: moderationItems.filter((i) => i.status === "pending").length,
    reviewed: moderationItems.filter((i) => i.status === "reviewed").length,
    resolved: moderationItems.filter((i) => i.status === "resolved").length,
    dismissed: moderationItems.filter((i) => i.status === "dismissed").length,
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
            🛡️ Content Moderation
          </h1>
          <p className="text-secondary">
            Review reported content and manage community violations.
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
            { label: "Total Reports", value: stats.total, color: "#60a5fa" },
            { label: "Pending", value: stats.pending, color: "#f59e0b" },
            { label: "Reviewed", value: stats.reviewed, color: "#60a5fa" },
            { label: "Resolved", value: stats.resolved, color: "#10b981" },
            { label: "Dismissed", value: stats.dismissed, color: "#8b5cf6" },
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
              Filter by status
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "pending"
                    | "reviewed"
                    | "resolved"
                    | "dismissed",
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
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
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
              Filter by type
            </label>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value as
                    | "all"
                    | "comment"
                    | "profile"
                    | "message"
                    | "image",
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
              <option value="all">All Types</option>
              <option value="comment">Comments</option>
              <option value="profile">Profiles</option>
              <option value="message">Messages</option>
              <option value="image">Images</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.24)",
              margin: "0 1.5rem",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.8)" }}>
              {selectedItems.size} item(s) selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={handleApprove}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#10b981",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Approve
              </button>
              <button
                onClick={handleRemove}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Remove Content
              </button>
              <button
                onClick={handleSuspendUser}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "#f59e0b",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Suspend User
              </button>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden",
            }}
          >
            {filteredItems.length === 0 ? (
              <div
                style={{
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  No reports to review
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0" }}>
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 1fr auto",
                      alignItems: "start",
                      gap: "1rem",
                      padding: "1.2rem 1.5rem",
                      borderBottom:
                        index < filteredItems.length - 1
                          ? "1px solid rgba(96,165,250,0.08)"
                          : "none",
                      background: selectedItems.has(item.id)
                        ? "rgba(96,165,250,0.08)"
                        : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1.3rem" }}>
                          {typeIcons[item.type]}
                        </span>
                        <div>
                          <div style={{ color: "white", fontWeight: 600 }}>
                            {item.reportedUser} - {item.type.toUpperCase()}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            Reported by {item.reportedBy}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.75rem 1rem",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <strong>Reason:</strong> {item.reason}
                      </div>
                      <p
                        style={{
                          margin: "0.5rem 0 0",
                          color: "rgba(255,255,255,0.45)",
                          fontSize: "0.8rem",
                        }}
                      >
                        Reported: {item.reportedAt}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-end",
                        minWidth: "120px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.35rem 0.75rem",
                          background: `${statusColors[item.status]}20`,
                          color: statusColors[item.status],
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.status === "pending"
                          ? "⏳"
                          : item.status === "reviewed"
                            ? "👁️"
                            : item.status === "resolved"
                              ? "✓"
                              : "✕"}{" "}
                        {item.status}
                      </span>
                      <button
                        onClick={() => alert(`Review details for ${item.id}`)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#60a5fa",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.85rem",
                        }}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
