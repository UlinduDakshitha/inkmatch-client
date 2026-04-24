"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Navbar.css";
import ThemeToggle from "./ThemeToggle";
import {
  getArtistProfileByOwner,
  getCurrentUser,
  getStudioProfileByOwner,
  normalizeRole,
  type AppUser,
} from "@/utils/appData";

type NavbarUserState = {
  user: AppUser | null;
  roleLabel: string;
  profileImage: string;
};

export default function Navbar() {
  const [navbarUser, setNavbarUser] = useState<NavbarUserState>({
    user: null,
    roleLabel: "Guest",
    profileImage: "",
  });
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setNavbarUser({
      user: null,
      roleLabel: "Guest",
      profileImage: "",
    });
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
        });
        return;
      }

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
      if (user.email && role === "ARTIST") {
        profileImage = getArtistProfileByOwner(user.email)?.profileImage || "";
      }
      if (user.email && role === "STUDIO_OWNER") {
        profileImage = getStudioProfileByOwner(user.email)?.profileImage || "";
      }

      setNavbarUser({ user, roleLabel, profileImage });
    }

    loadNavbarUser();
    window.addEventListener("storage", loadNavbarUser);
    return () => {
      window.removeEventListener("storage", loadNavbarUser);
    };
  }, []);

  const displayName = navbarUser.user?.name || "Customer";

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo">
          <span className="text-gradient heading-3">InkMatch</span>
        </Link>
        <div className="navbar-links">
          <Link href="/artists" className="nav-link">
            Artists
          </Link>
          <Link href="/studios" className="nav-link">
            Studios
          </Link>
        </div>
        <div className="navbar-actions">
          {navbarUser.user && (
            <>
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
                  <span className="navbar-user-role">
                    {navbarUser.roleLabel}
                  </span>
                  <span className="navbar-user-name">{displayName}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Log Out
              </button>
            </>
          )}
          <ThemeToggle />
          {!navbarUser.user && (
            <>
              <Link href="/login" className="btn-secondary">
                Log In
              </Link>
              <Link href="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
