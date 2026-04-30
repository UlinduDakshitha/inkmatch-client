"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./shared.css";
import {
  getArtistProfileByOwner,
  getArtistProfiles,
  getCurrentUser,
  normalizeRole,
} from "@/utils/appData";

type Artist = {
  id: number | string;
  style?: string;
  userId?: {
    name?: string;
  };
};

type ArtistCard = {
  id: string;
  name: string;
  style: string;
  profileImage?: string;
  source: "backend" | "local";
};

export default function ArtistsPage() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080";
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);
  const myPortfolio =
    role === "ARTIST" && currentUser?.email
      ? getArtistProfileByOwner(currentUser.email)
      : null;

  useEffect(() => {
    const localProfiles = getArtistProfiles();
    const controller = new AbortController();

    // Fetch from Spring Boot Backend
    fetch(`${apiBaseUrl}/api/artists`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json() as Promise<Artist[]>;
      })
      .then((data: Artist[]) => {
        const backendCards: ArtistCard[] = data.map((artist) => ({
          id: String(artist.id),
          name: artist.userId?.name || "Unknown Artist",
          style: artist.style || "Various Styles",
          profileImage: "",
          source: "backend",
        }));

        const localCards: ArtistCard[] = localProfiles.map((profile) => ({
          id: profile.id,
          name: profile.ownerName,
          style: profile.style || "Custom Style",
          profileImage: profile.profileImage,
          source: "local",
        }));

        const merged = [...localCards, ...backendCards];
        setArtists(merged);
        setLoading(false);
      })
      .catch(() => {
        const localCards: ArtistCard[] = localProfiles.map((profile) => ({
          id: profile.id,
          name: profile.ownerName,
          style: profile.style || "Custom Style",
          profileImage: profile.profileImage,
          source: "local",
        }));
        setArtists(localCards);
        if (localCards.length === 0) {
          setError("Unable to load backend artists right now.");
        }
        setLoading(false);
      });

    function syncLocalData() {
      const latestLocalCards: ArtistCard[] = getArtistProfiles().map(
        (profile) => ({
          id: profile.id,
          name: profile.ownerName,
          style: profile.style || "Custom Style",
          profileImage: profile.profileImage,
          source: "local",
        }),
      );
      setArtists((prev) => {
        const backendOnly = prev.filter((item) => item.source === "backend");
        return [...latestLocalCards, ...backendOnly];
      });
    }

    window.addEventListener("storage", syncLocalData);
    return () => {
      controller.abort();
      window.removeEventListener("storage", syncLocalData);
    };
  }, [apiBaseUrl]);

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1 className="heading-2">
          Tattoo <span className="text-gradient">Artists</span>
        </h1>
        <p className="text-secondary mt-2">
          Discover talented artists matching your style.
        </p>
      </div>

      {role === "ARTIST" && (
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h2 className="heading-3">
            {myPortfolio ? "Manage Your Portfolio" : "Create Your Portfolio"}
          </h2>
          <p className="text-secondary mt-2" style={{ marginBottom: "1rem" }}>
            Keep your profile updated so customers can book you.
          </p>
          <Link href="/portfolios/me" className="btn-primary">
            {myPortfolio ? "Edit Portfolio" : "Create Portfolio"}
          </Link>
        </div>
      )}

      {error && (
        <div className="empty-state glass" style={{ marginBottom: "2rem" }}>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid-list">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card item-card">
              <div className="skeleton avatar-skeleton"></div>
              <div className="skeleton text-skeleton mt-4"></div>
              <div className="skeleton text-skeleton short"></div>
            </div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="empty-state glass">
          <p>
            No artists found yet. Artists can create their portfolio after
            login.
          </p>
        </div>
      ) : (
        <div className="grid-list">
          {artists.map((artist) => (
            <div key={artist.id} className="glass-card item-card artist-card">
              <div className="artist-media">
                {artist.profileImage ? (
                  <img
                    src={artist.profileImage}
                    alt={artist.name}
                    className="artist-thumb"
                  />
                ) : (
                  <div className="artist-thumb artist-thumb-fallback">
                    {artist.name.charAt(0) || "A"}
                  </div>
                )}
                <div className="artist-media-overlay" aria-hidden="true" />
                <div className="artist-media-meta">
                  <h3 className="artist-name">{artist.name}</h3>
                  <p className="artist-style">{artist.style}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/portfolios/${artist.id}`}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  View Portfolio
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
