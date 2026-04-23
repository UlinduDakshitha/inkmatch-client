"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./shared.css";

type Artist = {
  id: number;
  style?: string;
  userId?: {
    name?: string;
  };
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from Spring Boot Backend
    fetch("http://localhost:8080/api/artists")
      .then((res) => res.json())
      .then((data: Artist[]) => {
        setArtists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          <p>No artists found. Please check back later or start backend.</p>
        </div>
      ) : (
        <div className="grid-list">
          {artists.map((artist) => (
            <div key={artist.id} className="glass-card item-card">
              <div className="item-avatar">
                {/* Fallback initials if no distinct image */}
                {artist.userId?.name?.charAt(0) || "A"}
              </div>
              <h3 className="item-title mt-4">
                {artist.userId?.name || "Unknown Artist"}
              </h3>
              <p className="item-subtitle text-secondary">
                {artist.style || "Various Styles"}
              </p>
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
