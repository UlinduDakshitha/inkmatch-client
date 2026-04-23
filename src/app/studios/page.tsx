"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../artists/shared.css"; // sharing same layout logic

type Studio = {
  id: number;
  name?: string;
  address?: string;
};

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from Spring Boot Backend
    fetch("http://localhost:8080/api/studios")
      .then((res) => res.json())
      .then((data: Studio[]) => {
        setStudios(data);
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
          Tattoo <span className="text-gradient">Studios</span>
        </h1>
        <p className="text-secondary mt-2">Find reputable studios near you.</p>
      </div>

      {loading ? (
        <div className="grid-list">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card item-card">
              <div
                className="skeleton avatar-skeleton"
                style={{ borderRadius: "12px" }}
              ></div>
              <div className="skeleton text-skeleton mt-4"></div>
              <div className="skeleton text-skeleton short"></div>
            </div>
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="empty-state glass">
          <p>No studios found. Start the backend connection to see data.</p>
        </div>
      ) : (
        <div className="grid-list">
          {studios.map((studio) => (
            <div key={studio.id} className="glass-card item-card">
              <h3 className="item-title mt-2">
                {studio.name || "Unknown Studio"}
              </h3>
              <p className="item-subtitle text-secondary mb-4">
                {studio.address || "Address not listed"}
              </p>
              <div className="mt-4 mt-auto">
                <Link
                  href={`/studios/${studio.id}`}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
