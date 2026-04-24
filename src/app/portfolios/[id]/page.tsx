"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../artists/shared.css";
import {
  addBooking,
  getArtistProfileById,
  getCurrentUser,
  normalizeRole,
  upsertArtistProfile,
  type ArtistProfile,
} from "@/utils/appData";

type ArtistPortfolio = {
  id: number | string;
  style?: string;
  userId?: {
    name?: string;
  };
};

export default function PortfolioPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);

  const [portfolio, setPortfolio] = useState<ArtistPortfolio | null>(null);
  const [localPortfolio, setLocalPortfolio] = useState<ArtistProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const local = getArtistProfileById(id);
    if (local) {
      setLocalPortfolio(local);
      setLoading(false);
      return;
    }

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

  const isOwnPortfolio =
    role === "ARTIST" &&
    Boolean(
      currentUser?.email && localPortfolio?.ownerEmail === currentUser.email,
    );

  const savePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localPortfolio) {
      return;
    }
    upsertArtistProfile(localPortfolio);
    setNotice("Portfolio updated successfully.");
  };

  const createBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (role !== "CUSTOMER") {
      setNotice("Bookings can only be created from customer accounts.");
      return;
    }

    if (!currentUser?.email) {
      setNotice("Please login again to continue.");
      return;
    }

    const targetName =
      localPortfolio?.ownerName || portfolio?.userId?.name || "Artist";

    addBooking({
      id: `bk-${Date.now()}`,
      customerEmail: currentUser.email,
      customerName: currentUser.name || "Customer",
      targetType: "ARTIST",
      targetId: String(id),
      targetName,
      appointmentDate,
      notes: bookingNote,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });

    setAppointmentDate("");
    setBookingNote("");
    setNotice("Booking request submitted. Check My Bookings page.");
  };

  return (
    <div className="page-container container">
      <h1 className="heading-2">
        Artist <span className="text-gradient">Portfolio</span>
      </h1>

      {notice && (
        <div className="glass-card mt-4" style={{ marginTop: "1rem" }}>
          <p className="text-secondary">{notice}</p>
        </div>
      )}

      {loading ? (
        <div className="glass-card mt-4">
          <div className="skeleton text-skeleton"></div>
        </div>
      ) : !portfolio && !localPortfolio ? (
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
              {(
                localPortfolio?.ownerName ||
                portfolio?.userId?.name ||
                "A"
              ).charAt(0)}
            </div>
            <div>
              <h2 className="heading-3">
                {localPortfolio?.ownerName ||
                  portfolio?.userId?.name ||
                  "Artist Name"}
              </h2>
              <p className="text-secondary mt-2">
                {localPortfolio?.style || portfolio?.style || "Tattoo Style"}
              </p>

              {localPortfolio?.location && (
                <p className="text-secondary mt-2">
                  Location: {localPortfolio.location}
                </p>
              )}
              {localPortfolio?.rateRange && (
                <p className="text-secondary mt-2">
                  Rate: {localPortfolio.rateRange}
                </p>
              )}
              {localPortfolio?.bio && (
                <p className="text-secondary mt-2">{localPortfolio.bio}</p>
              )}

              {role === "CUSTOMER" && (
                <form onSubmit={createBooking} style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      type="date"
                      className="input-field"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Short note for artist"
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">
                      Book Artist
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {isOwnPortfolio && localPortfolio && (
            <form onSubmit={savePortfolio} style={{ marginTop: "2rem" }}>
              <h3 className="heading-3">Edit Your Portfolio</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <input
                  className="input-field"
                  value={localPortfolio.ownerName}
                  onChange={(e) =>
                    setLocalPortfolio({
                      ...localPortfolio,
                      ownerName: e.target.value,
                    })
                  }
                  required
                />
                <input
                  className="input-field"
                  value={localPortfolio.style}
                  onChange={(e) =>
                    setLocalPortfolio({
                      ...localPortfolio,
                      style: e.target.value,
                    })
                  }
                  required
                />
                <input
                  className="input-field"
                  value={localPortfolio.location}
                  onChange={(e) =>
                    setLocalPortfolio({
                      ...localPortfolio,
                      location: e.target.value,
                    })
                  }
                />
                <input
                  className="input-field"
                  value={localPortfolio.rateRange}
                  onChange={(e) =>
                    setLocalPortfolio({
                      ...localPortfolio,
                      rateRange: e.target.value,
                    })
                  }
                />
              </div>
              <textarea
                className="input-field"
                style={{
                  marginTop: "1rem",
                  minHeight: "120px",
                  resize: "vertical",
                }}
                value={localPortfolio.bio}
                onChange={(e) =>
                  setLocalPortfolio({ ...localPortfolio, bio: e.target.value })
                }
              />
              <button
                className="btn-primary"
                type="submit"
                style={{ marginTop: "1rem" }}
              >
                Save Changes
              </button>
            </form>
          )}

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
