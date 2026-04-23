"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../artists/shared.css";

type ArtistPortfolio = {
  id: number;
  style?: string;
  userId?: {
    name?: string;
  };
};

export default function PortfolioPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [portfolio, setPortfolio] = useState<ArtistPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In actual implementation, we might need a GET endpoint.
    // Assuming backend returns portfolio on /api/artists/{id} or /api/portfolios
    fetch(`http://localhost:8080/api/artists`)
      .then((res) => res.json())
      .then((data: ArtistPortfolio[]) => {
        // Mock matching the ID for now
        const artist = data.find((a) => a.id.toString() === id);
        setPortfolio(artist ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="page-container container">
      <h1 className="heading-2">
        Artist <span className="text-gradient">Portfolio</span>
      </h1>

      {loading ? (
        <div className="glass-card mt-4">
          <div className="skeleton text-skeleton"></div>
        </div>
      ) : !portfolio ? (
        <div className="empty-state glass mt-4">
          <p>Portfolio not found.</p>
        </div>
      ) : (
        <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div
              className="item-avatar"
              style={{
                margin: 0,
                width: "120px",
                height: "120px",
                fontSize: "3rem",
              }}
            >
              {portfolio.userId?.name?.charAt(0) || "A"}
            </div>
            <div>
              <h2 className="heading-3">
                {portfolio.userId?.name || "Artist Name"}
              </h2>
              <p className="text-secondary mt-2">
                {portfolio.style || "Tattoo Style"}
              </p>

              <div
                className="mt-4 flex gap-4"
                style={{ display: "flex", gap: "1rem" }}
              >
                <button className="btn-primary">Book Consultation</button>
                <button className="btn-secondary">Save to Favorites</button>
              </div>
            </div>
          </div>

          <h3
            className="heading-3 mt-8"
            style={{ marginTop: "3rem", marginBottom: "1.5rem" }}
          >
            Gallery
          </h3>
          <div className="grid-list">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass"
                style={{ height: "200px", borderRadius: "12px" }}
              >
                <div
                  className="skeleton"
                  style={{ height: "100%", width: "100%" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
