"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../artists/shared.css"; // sharing same layout logic
import {
  getCurrentUser,
  getStudioProfileByOwner,
  getStudioProfiles,
  normalizeRole,
  upsertStudioProfile,
  type StudioProfile,
} from "@/utils/appData";

type Studio = {
  id: number | string;
  name?: string;
  address?: string;
};

type StudioCard = {
  id: string;
  name: string;
  address: string;
  source: "backend" | "local";
};

export default function StudiosPage() {
  const [studios, setStudios] = useState<StudioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);
  const isStudioOwner = role === "STUDIO_OWNER";

  const [myStudio, setMyStudio] = useState<StudioProfile | null>(() => {
    if (!isStudioOwner || !currentUser?.email) {
      return null;
    }

    return (
      getStudioProfileByOwner(currentUser.email) ?? {
        id: `local-studio-${encodeURIComponent(currentUser.email)}`,
        ownerEmail: currentUser.email,
        ownerName: currentUser.name || "Studio Owner",
        name: "",
        address: "",
        description: "",
      }
    );
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const localStudios = getStudioProfiles();

    // Fetch from Spring Boot Backend
    fetch("http://localhost:8080/api/studios")
      .then((res) => res.json())
      .then((data: Studio[]) => {
        const backendCards: StudioCard[] = data.map((studio) => ({
          id: String(studio.id),
          name: studio.name || "Unknown Studio",
          address: studio.address || "Address not listed",
          source: "backend",
        }));
        const localCards: StudioCard[] = localStudios.map((studio) => ({
          id: studio.id,
          name: studio.name || "Studio",
          address: studio.address || "Address not listed",
          source: "local",
        }));
        setStudios([...localCards, ...backendCards]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        const localCards: StudioCard[] = localStudios.map((studio) => ({
          id: studio.id,
          name: studio.name || "Studio",
          address: studio.address || "Address not listed",
          source: "local",
        }));
        setStudios(localCards);
        if (localCards.length === 0) {
          setError("Unable to load backend studios right now.");
        }
        setLoading(false);
      });

    function syncLocalData() {
      const localCards: StudioCard[] = getStudioProfiles().map((studio) => ({
        id: studio.id,
        name: studio.name || "Studio",
        address: studio.address || "Address not listed",
        source: "local",
      }));
      setStudios((prev) => {
        const backendOnly = prev.filter((item) => item.source === "backend");
        return [...localCards, ...backendOnly];
      });
    }

    window.addEventListener("storage", syncLocalData);
    return () => {
      window.removeEventListener("storage", syncLocalData);
    };
  }, [isStudioOwner, currentUser?.email, currentUser?.name]);

  const saveStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStudio) {
      return;
    }
    setSaving(true);
    upsertStudioProfile(myStudio);
    const localCards: StudioCard[] = getStudioProfiles().map((studio) => ({
      id: studio.id,
      name: studio.name || "Studio",
      address: studio.address || "Address not listed",
      source: "local",
    }));
    setStudios((prev) => {
      const backendOnly = prev.filter((item) => item.source === "backend");
      return [...localCards, ...backendOnly];
    });
    setSaving(false);
  };

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1 className="heading-2">
          Tattoo <span className="text-gradient">Studios</span>
        </h1>
        <p className="text-secondary mt-2">Find reputable studios near you.</p>
      </div>

      {isStudioOwner && myStudio && (
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h2 className="heading-3">Manage Your Studio</h2>
          <p className="text-secondary mt-2 mb-4">
            Keep your studio profile updated for customers.
          </p>

          <form onSubmit={saveStudio}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                className="input-field"
                placeholder="Studio Name"
                value={myStudio.name}
                onChange={(e) =>
                  setMyStudio({ ...myStudio, name: e.target.value })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Studio Address"
                value={myStudio.address}
                onChange={(e) =>
                  setMyStudio({ ...myStudio, address: e.target.value })
                }
                required
              />
            </div>
            <textarea
              className="input-field"
              style={{
                marginTop: "1rem",
                minHeight: "120px",
                resize: "vertical",
              }}
              placeholder="About your studio"
              value={myStudio.description}
              onChange={(e) =>
                setMyStudio({ ...myStudio, description: e.target.value })
              }
            />
            <button
              className="btn-primary"
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              {saving ? "Saving..." : "Save Studio"}
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
          <p>
            No studios found yet. Studio owners can create profiles after login.
          </p>
        </div>
      ) : (
        <div className="grid-list">
          {studios.map((studio) => (
            <div key={studio.id} className="glass-card item-card">
              <h3 className="item-title mt-2">{studio.name}</h3>
              <p className="item-subtitle text-secondary mb-4">
                {studio.address}
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
