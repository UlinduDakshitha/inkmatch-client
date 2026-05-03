"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";
import ThemeToggle from "./ThemeToggle";
import {
  APP_DATA_UPDATED_EVENT,
  ensureWelcomeNotification,
  getAdminProfileByOwner,
  getArtistProfileByOwner,
  getCustomerProfileByOwner,
  getCurrentUser,
  getUnreadNotificationsCount,
  getStudioProfileByOwner,
  normalizeRole,
  type AppRole,
  type AppUser,
} from "@/utils/appData";

type NavbarUserState = {
  user: AppUser | null;
  roleLabel: string;
  profileImage: string;
  displayName: string;
};

type ProfileStatusState = {
  stateLabel: string;
  completionLabel: string;
  details: string[];
  ctaLabel: string;
  ctaHref: string;
};

function countFilled(values: Array<string | undefined>): number {
  return values.filter((item) => (item || "").trim().length > 0).length;
}

function createProfileStatus(user: AppUser, role: AppRole): ProfileStatusState {
  if (!user.email) {
    return {
      stateLabel: "Profile unavailable",
      completionLabel: "No account email found",
      details: ["Please log in again to load your profile status."],
      ctaLabel: "Go Home",
      ctaHref: "/",
    };
  }

  const normalizedEmail = user.email.toLowerCase();

  if (role === "ADMIN") {
    const profile = getAdminProfileByOwner(normalizedEmail);
    const filled = profile
      ? countFilled([profile.ownerName, profile.phone, profile.accessNote])
      : 0;
    const completion = profile ? Math.round((filled / 3) * 100) : 0;

    return {
      stateLabel: profile
        ? "Admin profile active"
        : "Admin profile not created",
      completionLabel: `${completion}% complete`,
      details: profile
        ? [
            `Name: ${profile.ownerName || "-"}`,
            `Phone: ${profile.phone || "Not added"}`,
            `Access Note: ${profile.accessNote ? "Added" : "Missing"}`,
          ]
        : ["Create your admin profile to maintain role consistency."],
      ctaLabel: "Open Admin Console",
      ctaHref: "/admin",
    };
  }

  if (role === "ARTIST") {
    const profile = getArtistProfileByOwner(normalizedEmail);
    const filled = profile
      ? countFilled([
          profile.ownerName,
          profile.style,
          profile.bio,
          profile.location,
          profile.rateRange,
          profile.profileImage,
        ])
      : 0;
    const completion = profile ? Math.round((filled / 6) * 100) : 0;

    return {
      stateLabel: profile ? "Portfolio available" : "Portfolio not created",
      completionLabel: `${completion}% complete`,
      details: profile
        ? [
            `Style: ${profile.style || "Missing"}`,
            `Location: ${profile.location || "Missing"}`,
            `Gallery images: ${profile.galleryImages.length}`,
          ]
        : ["Create your artist portfolio to start receiving bookings."],
      ctaLabel: "Open Portfolio",
      ctaHref: "/portfolios/me",
    };
  }

  if (role === "STUDIO_OWNER") {
    const profile = getStudioProfileByOwner(normalizedEmail);
    const filled = profile
      ? countFilled([
          profile.ownerName,
          profile.name,
          profile.address,
          profile.description,
          profile.profileImage,
        ])
      : 0;
    const completion = profile ? Math.round((filled / 5) * 100) : 0;

    return {
      stateLabel: profile
        ? "Studio profile active"
        : "Studio profile not created",
      completionLabel: `${completion}% complete`,
      details: profile
        ? [
            `Studio: ${profile.name || "Missing"}`,
            `Address: ${profile.address || "Missing"}`,
            `Gallery images: ${profile.galleryImages.length}`,
          ]
        : ["Create your studio profile to publish studio details."],
      ctaLabel: "Open Studio Page",
      ctaHref: "/studios",
    };
  }

  const customerProfile = getCustomerProfileByOwner(normalizedEmail);
  const filled = customerProfile
    ? countFilled([
        customerProfile.ownerName,
        customerProfile.phone,
        customerProfile.city,
        customerProfile.bio,
        customerProfile.profileImage,
      ])
    : 0;
  const completion = customerProfile ? Math.round((filled / 5) * 100) : 0;

  return {
    stateLabel: customerProfile
      ? "Customer profile active"
      : "Customer profile not created",
    completionLabel: `${completion}% complete`,
    details: customerProfile
      ? [
          `Phone: ${customerProfile.phone || "Missing"}`,
          `City: ${customerProfile.city || "Missing"}`,
          `Bio: ${customerProfile.bio ? "Added" : "Missing"}`,
          `Photo: ${customerProfile.profileImage ? "Added" : "Missing"}`,
        ]
      : ["Create your customer profile from dashboard."],
    ctaLabel: "Open Dashboard",
    ctaHref: "/dashboard",
  };
}

export default function Navbar() {
  const [navbarUser, setNavbarUser] = useState<NavbarUserState>({
    user: null,
    roleLabel: "Guest",
    profileImage: "",
    displayName: "Guest",
  });
  const [profileStatus, setProfileStatus] = useState<ProfileStatusState>({
    stateLabel: "Profile unavailable",
    completionLabel: "Sign in to see profile status",
    details: [""],
    ctaLabel: "Go Home",
    ctaHref: "/",
  });
  const [profileStatusOpen, setProfileStatusOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setNavbarUser({
      user: null,
      roleLabel: "Guest",
      profileImage: "",
      displayName: "Guest",
    });
    setProfileStatusOpen(false);
    router.push("/");
  };

  useEffect(() => {
    function loadNavbarUser() {
      const user = getCurrentUser();

      if (!user) {
        setNavbarUser({
          user: null,
          roleLabel: "Guest",
          profileImage: "",
          displayName: "Guest",
        });
        setProfileStatus({
          stateLabel: "Profile unavailable",
          completionLabel: "Sign in to see profile status",
          details: [""],
          ctaLabel: "Go Home",
          ctaHref: "/",
        });
        setUnreadCount(0);
        return;
      }

      ensureWelcomeNotification(user);

      const role = normalizeRole(user.role);
      const roleLabel =
        role === "ARTIST"
          ? "Artist"
          : role === "STUDIO_OWNER"
            ? "Studio Owner"
            : role === "ADMIN"
              ? "Admin"
              : "Customer";

      let profileImage = "";
      let displayName = user.name || "Customer";
      if (user.email && role === "ARTIST") {
        const artistProfile = getArtistProfileByOwner(user.email);
        profileImage = artistProfile?.profileImage || "";
        displayName = artistProfile?.ownerName || displayName;
      }
      if (user.email && role === "STUDIO_OWNER") {
        const studioProfile = getStudioProfileByOwner(user.email);
        profileImage = studioProfile?.profileImage || "";
        displayName = studioProfile?.ownerName || displayName;
      }
      if (user.email && role === "CUSTOMER") {
        const customerProfile = getCustomerProfileByOwner(user.email);
        profileImage = customerProfile?.profileImage || "";
        displayName = customerProfile?.ownerName || displayName;
      }
      if (user.email && role === "ADMIN") {
        const adminProfile = getAdminProfileByOwner(user.email);
        displayName = adminProfile?.ownerName || displayName;
      }

      if (user.email && displayName === user.email.split("@")[0]) {
        const nameByEmail = JSON.parse(
          localStorage.getItem("inkmatch.nameByEmail") || "{}",
        ) as Record<string, string>;
        const mappedName = nameByEmail[user.email.toLowerCase()];
        if (mappedName) {
          displayName = mappedName;
        }
      }

      setNavbarUser({ user, roleLabel, profileImage, displayName });
      setProfileStatus(createProfileStatus(user, role));
      if (user.email) {
        setUnreadCount(getUnreadNotificationsCount(user.email));
      }
    }

    loadNavbarUser();
    window.addEventListener("storage", loadNavbarUser);
    window.addEventListener(APP_DATA_UPDATED_EVENT, loadNavbarUser);
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setProfileStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      window.removeEventListener("storage", loadNavbarUser);
      window.removeEventListener(APP_DATA_UPDATED_EVENT, loadNavbarUser);
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const displayName = navbarUser.displayName || "Customer";
  const isAdmin = normalizeRole(navbarUser.user?.role) === "ADMIN";

  return (
    <nav className="navbar navbar-light">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-mark" aria-hidden="true">
            <img src="/brand/inkmatch-mark.svg" alt="" />
          </span>
          <span className="navbar-logo-copy">
            <strong>InkMatch</strong>
            <span>Book trusted tattoo artists and studios in Sri Lanka</span>
          </span>
        </Link>
        <div className="navbar-links">
          <Link href="/artists" className="nav-link">
            Artists
          </Link>
          <Link href="/studios" className="nav-link">
            Studios
          </Link>
          {isAdmin && (
            <Link href="/admin" className="nav-link">
              Admin
            </Link>
          )}
          <Link href="/contact-us" className="nav-link">
            Contact Us
          </Link>
        </div>
        <div className="navbar-actions">
          <ThemeToggle compact />
          {navbarUser.user && (
            <Link
              href="/notifications"
              className="navbar-notification-btn"
              aria-label="Open notifications"
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a6 6 0 0 0-6 6v3.13c0 .84-.3 1.66-.85 2.3l-1.02 1.2A1 1 0 0 0 4.9 16h14.2a1 1 0 0 0 .77-1.64l-1.02-1.2a3.54 3.54 0 0 1-.85-2.3V8a6 6 0 0 0-6-6Zm0 20a3.01 3.01 0 0 0 2.83-2h-5.66A3.01 3.01 0 0 0 12 22Z" />
              </svg>
              {unreadCount > 0 && (
                <span className="navbar-notification-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          <div className="navbar-user-wrapper" ref={settingsRef}>
            {navbarUser.user && (
              <button
                type="button"
                className="navbar-user-pill"
                aria-label="Open profile status"
                aria-expanded={profileStatusOpen}
                onClick={() => {
                  setProfileStatusOpen((current) => !current);
                }}
              >
                {navbarUser.profileImage ? (
                  <img
                    src={navbarUser.profileImage}
                    alt={displayName}
                    className="navbar-user-avatar"
                  />
                ) : (
                  <span className="navbar-user-avatar navbar-user-initial">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="navbar-user-meta">
                  <span className="navbar-user-role">
                    {navbarUser.roleLabel}
                  </span>
                  <span className="navbar-user-name">{displayName}</span>
                </div>
              </button>
            )}

            {profileStatusOpen && navbarUser.user && (
              <div className="navbar-profile-status-menu">
                <p className="navbar-settings-label">Profile Status</p>
                <h4 className="navbar-profile-status-title">
                  {profileStatus.stateLabel}
                </h4>
                <p className="navbar-profile-status-completion">
                  {profileStatus.completionLabel}
                </p>
                <div className="navbar-profile-status-list">
                  {profileStatus.details.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))}
                </div>
                <Link
                  href={profileStatus.ctaHref}
                  className="navbar-settings-action"
                  onClick={() => setProfileStatusOpen(false)}
                >
                  {profileStatus.ctaLabel}
                </Link>

                {/* Dashboard Links */}
                {navbarUser.user && (
                  <>
                    {normalizeRole(navbarUser.user.role) === "ARTIST" && (
                      <>
                        <Link
                          href="/artist-dashboard"
                          className="navbar-settings-action"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)",
                            color: "#60a5fa",
                            border: "1.5px solid rgba(59, 130, 246, 0.4)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            marginTop: "1rem",
                            paddingTop: "0.875rem",
                            paddingBottom: "0.875rem",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            borderRadius: "8px",
                          }}
                          onClick={() => setProfileStatusOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(59, 130, 246, 0.6)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 16px rgba(59, 130, 246, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(59, 130, 246, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <span>📊</span> Artist Dashboard
                        </Link>

                        {/* Quick Links for Artist */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Link
                            href="/artist-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(59, 130, 246, 0.08)",
                              color: "rgba(96, 165, 250, 0.9)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            📅 Availability
                          </Link>
                          <Link
                            href="/artist-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(59, 130, 246, 0.08)",
                              color: "rgba(96, 165, 250, 0.9)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            📋 Bookings
                          </Link>
                          <Link
                            href="/artist-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(59, 130, 246, 0.08)",
                              color: "rgba(96, 165, 250, 0.9)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              gridColumn: "1 / -1",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            👤 Profile
                          </Link>
                        </div>
                      </>
                    )}
                    {normalizeRole(navbarUser.user.role) === "STUDIO_OWNER" && (
                      <>
                        <Link
                          href="/studio-dashboard"
                          className="navbar-settings-action"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)",
                            color: "#c4b5fd",
                            border: "1.5px solid rgba(139, 92, 246, 0.4)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            marginTop: "1rem",
                            paddingTop: "0.875rem",
                            paddingBottom: "0.875rem",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            borderRadius: "8px",
                          }}
                          onClick={() => setProfileStatusOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(139, 92, 246, 0.6)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 16px rgba(139, 92, 246, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(139, 92, 246, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <span>📊</span> Studio Dashboard
                        </Link>

                        {/* Quick Links for Studio */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Link
                            href="/studio-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(139, 92, 246, 0.08)",
                              color: "rgba(196, 181, 253, 0.9)",
                              border: "1px solid rgba(139, 92, 246, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              gridColumn: "1 / -1",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(139, 92, 246, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(139, 92, 246, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            📋 Booking Requests
                          </Link>
                          <Link
                            href="/studio-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(139, 92, 246, 0.08)",
                              color: "rgba(196, 181, 253, 0.9)",
                              border: "1px solid rgba(139, 92, 246, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(139, 92, 246, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(139, 92, 246, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            🏢 Studio Profile
                          </Link>
                        </div>
                      </>
                    )}
                    {normalizeRole(navbarUser.user.role) === "CUSTOMER" && (
                      <>
                        <Link
                          href="/customer-dashboard"
                          className="navbar-settings-action"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)",
                            color: "#86efac",
                            border: "1.5px solid rgba(34, 197, 94, 0.4)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            marginTop: "1rem",
                            paddingTop: "0.875rem",
                            paddingBottom: "0.875rem",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            borderRadius: "8px",
                          }}
                          onClick={() => setProfileStatusOpen(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(34, 197, 94, 0.6)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 16px rgba(34, 197, 94, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)";
                            e.currentTarget.style.borderColor =
                              "rgba(34, 197, 94, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <span>📊</span> My Dashboard
                        </Link>

                        {/* Quick Links for Customer */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Link
                            href="/customer-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(34, 197, 94, 0.08)",
                              color: "rgba(134, 239, 172, 0.9)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            📋 My Bookings
                          </Link>
                          <Link
                            href="/customer-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(34, 197, 94, 0.08)",
                              color: "rgba(134, 239, 172, 0.9)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            👤 Profile
                          </Link>
                          <Link
                            href="/customer-dashboard"
                            className="navbar-settings-action"
                            style={{
                              padding: "0.6rem 0.75rem",
                              fontSize: "0.8rem",
                              background: "rgba(34, 197, 94, 0.08)",
                              color: "rgba(134, 239, 172, 0.9)",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                              borderRadius: "6px",
                              transition: "all 0.2s",
                              gridColumn: "1 / -1",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(34, 197, 94, 0.08)";
                            }}
                            onClick={() => setProfileStatusOpen(false)}
                          >
                            ⭐ Quick Actions
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="navbar-settings-action"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {!navbarUser.user && (
            <>
              <Link href="/login" className="btn-secondary navbar-auth-login">
                Log In
              </Link>
              <Link
                href="/register"
                className="btn-primary navbar-auth-register"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
