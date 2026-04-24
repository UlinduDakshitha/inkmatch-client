"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./shared.css";
import {
  getArtistProfileByOwner,
  getArtistProfiles,
  getCurrentUser,
  normalizeRole,
  upsertArtistProfile,
  type ArtistProfile,
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
  source: "backend" | "local";
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);
  const isArtist = role === "ARTIST";

  const [myPortfolio, setMyPortfolio] = useState<ArtistProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const localProfiles = getArtistProfiles();

    if (isArtist && currentUser?.email) {
      const own = getArtistProfileByOwner(currentUser.email) ?? {
        id: `local-${encodeURIComponent(currentUser.email)}`,
        ownerEmail: currentUser.email,
        ownerName: currentUser.name || "Tattoo Artist",
        style: "",
        bio: "",
        location: "",
        rateRange: "",
      };
      setMyPortfolio(own);
    }

    // Fetch from Spring Boot Backend
    fetch("http://localhost:8080/api/artists")
      .then((res) => res.json())
      .then((data: Artist[]) => {
        const backendCards: ArtistCard[] = data.map((artist) => ({
          id: String(artist.id),
          name: artist.userId?.name || "Unknown Artist",
          style: artist.style || "Various Styles",
          source: "backend",
        }));

        const localCards: ArtistCard[] = localProfiles.map((profile) => ({
          id: profile.id,
          name: profile.ownerName,
          style: profile.style || "Custom Style",
          source: "local",
        }));

        const merged = [...localCards, ...backendCards];
        setArtists(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        const localCards: ArtistCard[] = localProfiles.map((profile) => ({
          id: profile.id,
          name: profile.ownerName,
          style: profile.style || "Custom Style",
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
          source: "local",
        }),
      );
      setArtists((prev) => {
        const backendOnly = prev.filter((item) => item.source === "backend");
        return [...latestLocalCards, ...backendOnly];
      });
      if (isArtist && currentUser?.email) {
        setMyPortfolio(getArtistProfileByOwner(currentUser.email));
      }
    }

    window.addEventListener("storage", syncLocalData);
    return () => {
      window.removeEventListener("storage", syncLocalData);
    };
  }, [isArtist, currentUser?.email, currentUser?.name]);

  const saveMyPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myPortfolio) {
      return;
    }

    setSaving(true);
    upsertArtistProfile(myPortfolio);

    setArtists((prev) => {
      const backendOnly = prev.filter((item) => item.source === "backend");
      const localCards: ArtistCard[] = getArtistProfiles().map((profile) => ({
        id: profile.id,
        name: profile.ownerName,
        style: profile.style || "Custom Style",
        source: "local",
      }));
      return [...localCards, ...backendOnly];
    });
    setSaving(false);
  };

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

      {isArtist && myPortfolio && (
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h2 className="heading-3">My Portfolio</h2>
          <p className="text-secondary mt-2 mb-4">
            Update your profile so customers can find and book you.
          </p>

          <form onSubmit={saveMyPortfolio}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                className="input-field"
                placeholder="Display Name"
                value={myPortfolio.ownerName}
                onChange={(e) =>
                  setMyPortfolio({ ...myPortfolio, ownerName: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Primary Style"
                value={myPortfolio.style}
                onChange={(e) =>
                  setMyPortfolio({ ...myPortfolio, style: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Location"
                value={myPortfolio.location}
                onChange={(e) =>
                  setMyPortfolio({ ...myPortfolio, location: e.target.value })
                }
              />
              <input
                className="input-field"
                placeholder="Rate Range (ex: $100 - $300)"
                value={myPortfolio.rateRange}
                onChange={(e) =>
                  setMyPortfolio({ ...myPortfolio, rateRange: e.target.value })
                }
              />
            </div>
            <textarea
              className="input-field"
              placeholder="Short bio"
              style={{
                marginTop: "1rem",
                minHeight: "120px",
                resize: "vertical",
              }}
              value={myPortfolio.bio}
              onChange={(e) =>
                setMyPortfolio({ ...myPortfolio, bio: e.target.value })
              }
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              {saving ? "Saving..." : "Save Portfolio"}
            </button>
          </form>
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
            <div key={artist.id} className="glass-card item-card">
              <div className="item-avatar">
                {/* Fallback initials if no distinct image */}
                {artist.name.charAt(0) || "A"}
              </div>
              <h3 className="item-title mt-4">{artist.name}</h3>
              <p className="item-subtitle text-secondary">{artist.style}</p>
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
