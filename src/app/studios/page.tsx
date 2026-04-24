"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../artists/shared.css"; // sharing same layout logic
import {
  deleteStudioProfileByOwner,
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
  profileImage?: string;
  source: "backend" | "local";
};

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

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
        profileImage: "",
        galleryImages: [],
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
          profileImage: "",
          source: "backend",
        }));
        const localCards: StudioCard[] = localStudios.map((studio) => ({
          id: studio.id,
          name: studio.name || "Studio",
          address: studio.address || "Address not listed",
          profileImage: studio.profileImage,
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
          profileImage: studio.profileImage,
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
        profileImage: studio.profileImage,
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
      profileImage: studio.profileImage,
      source: "local",
    }));
    setStudios((prev) => {
      const backendOnly = prev.filter((item) => item.source === "backend");
      return [...localCards, ...backendOnly];
    });
    setSaving(false);
  };

  const deleteStudio = () => {
    if (!currentUser?.email) {
      return;
    }

    deleteStudioProfileByOwner(currentUser.email);
    setMyStudio({
      id: `local-studio-${encodeURIComponent(currentUser.email)}`,
      ownerEmail: currentUser.email,
      ownerName: currentUser.name || "Studio Owner",
      name: "",
      address: "",
      description: "",
      profileImage: "",
      galleryImages: [],
    });

    const localCards: StudioCard[] = getStudioProfiles().map((studio) => ({
      id: studio.id,
      name: studio.name || "Studio",
      address: studio.address || "Address not listed",
      profileImage: studio.profileImage,
      source: "local",
    }));
    setStudios((prev) => {
      const backendOnly = prev.filter((item) => item.source === "backend");
      return [...localCards, ...backendOnly];
    });
    setSaving(false);
  };

  const handleStudioProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!myStudio) {
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const imageData = await fileToDataUrl(file);
    setMyStudio({ ...myStudio, profileImage: imageData });
  };

  const handleStudioGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!myStudio) {
      return;
    }

    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const galleryImages = await Promise.all(
      files.map((file) => fileToDataUrl(file)),
    );
    setMyStudio({
      ...myStudio,
      galleryImages: [...myStudio.galleryImages, ...galleryImages].slice(0, 12),
    });
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
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
              <label className="text-secondary">Studio Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                onChange={handleStudioProfileImageChange}
              />
              {myStudio.profileImage && (
                <img
                  src={myStudio.profileImage}
                  alt="Studio profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}
            </div>
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
              <label className="text-secondary">Studio Gallery</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="input-field"
                onChange={handleStudioGalleryChange}
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              {saving ? "Saving..." : "Save Studio"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={deleteStudio}
              style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
            >
              Delete Studio
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
              {studio.profileImage ? (
                <img
                  src={studio.profileImage}
                  alt={studio.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              ) : null}
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
