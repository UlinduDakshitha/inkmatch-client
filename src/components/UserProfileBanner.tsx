"use client";

import {
  getArtistProfileByOwner,
  getCurrentUser,
  getStudioProfileByOwner,
  normalizeRole,
} from "@/utils/appData";

const roleLabels = {
  CUSTOMER: "Customer",
  ARTIST: "Tattoo Artist",
  STUDIO_OWNER: "Studio Owner",
  ADMIN: "Admin",
} as const;

export default function UserProfileBanner() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const role = normalizeRole(user.role);
  const displayName = user.name || "User";
  const displayEmail = user.email || "No email";

  let profileImage = "";
  if (user.email && role === "ARTIST") {
    profileImage = getArtistProfileByOwner(user.email)?.profileImage || "";
  }
  if (user.email && role === "STUDIO_OWNER") {
    profileImage = getStudioProfileByOwner(user.email)?.profileImage || "";
  }

  return (
    <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={displayName}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="heading-3" style={{ margin: 0 }}>
            {displayName}
          </p>
          <p className="text-secondary" style={{ marginTop: "0.2rem" }}>
            {displayEmail}
          </p>
          <p className="text-secondary" style={{ marginTop: "0.2rem" }}>
            Role: {roleLabels[role]}
          </p>
        </div>
      </div>
    </div>
  );
}
