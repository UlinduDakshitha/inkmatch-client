"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";
import ThemeToggle from "./ThemeToggle";
import {
  APP_DATA_UPDATED_EVENT,
  ensureWelcomeNotification,
  getArtistProfileByOwner,
  getCustomerProfileByOwner,
  getCurrentUser,
  getUnreadNotificationsCount,
  getStudioProfileByOwner,
  normalizeRole,
  type AppUser,
} from "@/utils/appData";

type NavbarUserState = {
  user: AppUser | null;
  roleLabel: string;
  profileImage: string;
  displayName: string;
};

export default function Navbar() {
  const [navbarUser, setNavbarUser] = useState<NavbarUserState>({
    user: null,
    roleLabel: "Guest",
    profileImage: "",
    displayName: "Guest",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    setSettingsOpen(false);
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
        displayName = customerProfile?.ownerName || displayName;
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
        setSettingsOpen(false);
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
          {navbarUser.user && (
            <div className="navbar-user-pill" aria-label="Logged-in user">
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
                <span className="navbar-user-role">{navbarUser.roleLabel}</span>
                <span className="navbar-user-name">{displayName}</span>
              </div>
            </div>
          )}
          <div className="navbar-user-wrapper" ref={settingsRef}>
            <button
              type="button"
              className="navbar-settings-btn"
              onClick={() => setSettingsOpen((current) => !current)}
              aria-label="Open settings"
              title="Settings"
              aria-expanded={settingsOpen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.63l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.1 7.1 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.7 8.85a.5.5 0 0 0 .12.63l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.63l1.92 3.32c.13.22.39.31.61.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54c.04.24.25.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.58-.23 1.13-.54 1.63-.94l2.39.96c.22.09.48 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.63l-2.03-1.58ZM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2Z" />
              </svg>
            </button>
            {settingsOpen && (
              <div className="navbar-settings-menu">
                <div className="navbar-settings-section">
                  <p className="navbar-settings-label">Settings</p>
                  <ThemeToggle compact />
                </div>
                {navbarUser.user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-settings-action"
                  >
                    Logout
                  </button>
                )}
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
