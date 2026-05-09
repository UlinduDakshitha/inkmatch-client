"use client";

import { useState, useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import {
  getArtistProfiles,
  getStudioProfiles,
  getCustomerProfiles,
  getAdminProfiles,
} from "@/utils/appData";

type User = {
  id: string;
  name: string;
  email?: string;
  role: "artist" | "studio" | "customer" | "admin";
  status: "active" | "inactive" | "suspended";
  joinDate?: string;
  source: any;
};

export default function UserManagementPage() {
  const [filterRole, setFilterRole] = useState<"all" | User["role"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const users = useMemo<User[]>(() => {
    const allUsers: User[] = [];

    getArtistProfiles().forEach((artist) => {
      allUsers.push({
        id: artist.id,
        name: artist.ownerName || "Unnamed",
        role: "artist",
        status: "active",
        source: artist,
      });
    });

    getStudioProfiles().forEach((studio) => {
      allUsers.push({
        id: studio.id,
        name: studio.name || "Unnamed",
        role: "studio",
        status: "active",
        source: studio,
      });
    });

    getCustomerProfiles().forEach((customer) => {
      allUsers.push({
        id: customer.id,
        name: customer.name || "Unnamed",
        role: "customer",
        status: "active",
        source: customer,
      });
    });

    getAdminProfiles().forEach((admin) => {
      allUsers.push({
        id: admin.id,
        name: admin.name || "Admin",
        role: "admin",
        status: "active",
        source: admin,
      });
    });

    return allUsers;
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchRole = filterRole === "all" || user.role === filterRole;
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, filterRole, searchQuery]);

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleDeleteUsers = () => {
    if (selectedUsers.size === 0) return;
    const confirmDelete = confirm(
      `Delete ${selectedUsers.size} user(s)? This action cannot be undone.`,
    );
    if (confirmDelete) {
      alert(`Deleted ${selectedUsers.size} user(s) from system.`);
      setSelectedUsers(new Set());
    }
  };

  const handleSuspendUsers = () => {
    if (selectedUsers.size === 0) return;
    alert(`Suspended ${selectedUsers.size} user(s).`);
    setSelectedUsers(new Set());
  };

  const roleColors: Record<User["role"], string> = {
    artist: "#10b981",
    studio: "#c084fc",
    customer: "#22c55e",
    admin: "#f59e0b",
  };

  const roleIcons: Record<User["role"], string> = {
    artist: "🎨",
    studio: "🏢",
    customer: "👤",
    admin: "👑",
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
            👥 User Management
          </h1>
          <p className="text-secondary">
            Manage all users in the system. View, filter, and perform bulk
            actions.
          </p>
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
              Search users
            </label>
            <input
              type="text"
              placeholder="Name, ID, email..."
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
              Filter by role
            </label>
            <select
              value={filterRole}
              onChange={(e) =>
                setFilterRole(e.target.value as "all" | User["role"])
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
              <option value="all">All Roles</option>
              <option value="artist">Artists</option>
              <option value="studio">Studios</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
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
              {selectedUsers.size} user(s) selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={handleSuspendUsers}
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
                Suspend
              </button>
              <button
                onClick={handleDeleteUsers}
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
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
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
                  <th style={{ width: "50px", padding: "1rem" }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length}
                      onChange={handleSelectAll}
                      style={{ cursor: "pointer" }}
                    />
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
                    User
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
                    Role
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "2rem 1rem",
                        textAlign: "center",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid rgba(96,165,250,0.08)",
                        background: selectedUsers.has(user.id)
                          ? "rgba(96,165,250,0.08)"
                          : "transparent",
                      }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleToggleUser(user.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "white",
                          fontWeight: 500,
                        }}
                      >
                        <div>
                          <div>{user.name}</div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            {user.id}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            background: `${roleColors[user.role]}20`,
                            color: roleColors[user.role],
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {roleIcons[user.role]} {user.role}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            background: "rgba(16,185,129,0.1)",
                            color: "#10b981",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Active
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          textAlign: "right",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.9rem",
                        }}
                      >
                        <button
                          onClick={() => alert(`View details for ${user.name}`)}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.9rem",
            }}
          >
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
            <span>
              {filterRole === "all"
                ? "All roles"
                : `Filtered by: ${filterRole}`}
            </span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
