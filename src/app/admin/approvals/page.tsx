"use client";

import { useState, useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import {
  getArtistProfiles,
  getStudioProfiles,
  getCustomerProfiles,
} from "@/utils/appData";

type ApprovalRequest = {
  id: string;
  name: string;
  type: "artist" | "studio" | "account";
  status: "pending" | "approved" | "rejected";
  details: string;
  requestDate: string;
  requiredDocs?: string[];
};

export default function ApprovalsPage() {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set(),
  );

  const approvalRequests = useMemo<ApprovalRequest[]>(() => {
    const requests: ApprovalRequest[] = [];

    getArtistProfiles().forEach((artist) => {
      requests.push({
        id: `artist-${artist.id}`,
        name: artist.ownerName || "Unnamed",
        type: "artist",
        status: "pending",
        details: `Portfolio verification • ${artist.style || "Unknown style"}`,
        requestDate: "2025-01-15",
        requiredDocs: ["ID", "Portfolio samples", "Certificate"],
      });
    });

    getStudioProfiles().forEach((studio) => {
      requests.push({
        id: `studio-${studio.id}`,
        name: studio.name || "Unnamed",
        type: "studio",
        status: "pending",
        details: `Business registration • ${studio.address || "Location"}`,
        requestDate: "2025-01-14",
        requiredDocs: ["Business license", "Insurance", "Safety cert"],
      });
    });

    return requests;
  }, []);

  const filteredRequests = useMemo(() => {
    return approvalRequests.filter(
      (req) => filterStatus === "all" || req.status === filterStatus,
    );
  }, [approvalRequests, filterStatus]);

  const handleToggleRequest = (id: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRequests(newSelected);
  };

  const handleApprove = () => {
    if (selectedRequests.size === 0) return;
    alert(`Approved ${selectedRequests.size} request(s).`);
    setSelectedRequests(new Set());
  };

  const handleReject = () => {
    if (selectedRequests.size === 0) return;
    const reason = prompt("Rejection reason:");
    if (reason) {
      alert(`Rejected ${selectedRequests.size} request(s). Reason: ${reason}`);
      setSelectedRequests(new Set());
    }
  };

  const statusColors: Record<"pending" | "approved" | "rejected", string> = {
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#ef4444",
  };

  const typeIcons: Record<"artist" | "studio" | "account", string> = {
    artist: "🎨",
    studio: "🏢",
    account: "👤",
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
            ✍️ Approve / Reject Accounts
          </h1>
          <p className="text-secondary">
            Review pending account approval requests. Check documentation and
            approve or reject.
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
            {
              label: "Pending",
              value: approvalRequests.filter((r) => r.status === "pending")
                .length,
              color: "#f59e0b",
            },
            {
              label: "Approved",
              value: approvalRequests.filter((r) => r.status === "approved")
                .length,
              color: "#10b981",
            },
            {
              label: "Rejected",
              value: approvalRequests.filter((r) => r.status === "rejected")
                .length,
              color: "#ef4444",
            },
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
        <div style={{ padding: "1.5rem" }}>
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
                  e.target.value as "all" | "pending" | "approved" | "rejected",
                )
              }
              style={{
                width: "100%",
                maxWidth: "300px",
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.size > 0 && (
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
              {selectedRequests.size} request(s) selected
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
                ✓ Approve Selected
              </button>
              <button
                onClick={handleReject}
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
                ✕ Reject Selected
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden",
            }}
          >
            {filteredRequests.length === 0 ? (
              <div
                style={{
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.1rem" }}>
                  No requests to review
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0" }}>
                {filteredRequests.map((request, index) => (
                  <div
                    key={request.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 1fr auto",
                      alignItems: "start",
                      gap: "1rem",
                      padding: "1.2rem 1.5rem",
                      borderBottom:
                        index < filteredRequests.length - 1
                          ? "1px solid rgba(96,165,250,0.08)"
                          : "none",
                      background: selectedRequests.has(request.id)
                        ? "rgba(96,165,250,0.08)"
                        : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRequests.has(request.id)}
                      onChange={() => handleToggleRequest(request.id)}
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
                          gap: "0.5rem",
                          marginBottom: "0.35rem",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>
                          {typeIcons[request.type]}
                        </span>
                        <span style={{ color: "white", fontWeight: 600 }}>
                          {request.name}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "0.35rem 0 0",
                          color: "rgba(255,255,255,0.55)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {request.details}
                      </p>
                      {request.requiredDocs && (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {request.requiredDocs.map((doc) => (
                            <span
                              key={doc}
                              style={{
                                fontSize: "0.8rem",
                                padding: "0.25rem 0.6rem",
                                background: "rgba(96,165,250,0.15)",
                                color: "#60a5fa",
                                borderRadius: "4px",
                              }}
                            >
                              📄 {doc}
                            </span>
                          ))}
                        </div>
                      )}
                      <p
                        style={{
                          margin: "0.5rem 0 0",
                          color: "rgba(255,255,255,0.45)",
                          fontSize: "0.8rem",
                        }}
                      >
                        Requested: {request.requestDate}
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
                          background: `${statusColors[request.status]}20`,
                          color: statusColors[request.status],
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {request.status === "pending"
                          ? "⏳"
                          : request.status === "approved"
                            ? "✓"
                            : "✕"}{" "}
                        {request.status}
                      </span>
                      <button
                        onClick={() =>
                          alert(`View full details for ${request.name}`)
                        }
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
