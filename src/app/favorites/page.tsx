"use client";

import { useEffect, useState } from "react";
import "../artists/shared.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app we'd target `customer/{id}` based on session
    fetch("http://localhost:8080/api/favorites/customer/1")
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  return (
    <div className="page-container container">
      <h1 className="heading-2">
        Saved <span className="text-gradient">Favorites</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        Your bookmarked artists and studios.
      </p>

      {loading ? (
        <div className="glass-card">
          <div
            className="skeleton text-skeleton"
            style={{ height: "100px" }}
          ></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state glass">
          <p>You haven&apos;t saved any favorites yet.</p>
        </div>
      ) : (
        <div className="grid-list" style={{ marginTop: "2rem" }}>
          {/* Favorite Cards here */}
        </div>
      )}
    </div>
  );
}
