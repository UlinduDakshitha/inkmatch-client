"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../artists/shared.css";
import {
  addBooking,
  deleteArtistProfileByOwner,
  getArtistProfileById,
  getArtistProfileByOwner,
  getCustomerProfileByOwner,
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

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const requestedId = id ?? "";
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);
  const ownPortfolio = useMemo(
    () =>
      role === "ARTIST" && currentUser?.email
        ? getArtistProfileByOwner(currentUser.email)
        : null,
    [role, currentUser?.email],
  );
  const portfolioId = useMemo(
    () =>
      requestedId === "me"
        ? ownPortfolio?.id ||
          (currentUser?.email
            ? `local-artist-${encodeURIComponent(currentUser.email)}`
            : "")
        : requestedId,
    [requestedId, ownPortfolio?.id, currentUser?.email],
  );
  const initialLocalPortfolio = useMemo(
    () =>
      requestedId === "me"
        ? role === "ARTIST" && currentUser?.email
          ? (ownPortfolio ?? {
              id: portfolioId,
              ownerEmail: currentUser.email,
              ownerName: currentUser.name || "Tattoo Artist",
              style: "",
              bio: "",
              location: "",
              rateRange: "",
              profileImage: "",
              galleryImages: [],
            })
          : null
        : portfolioId
          ? getArtistProfileById(portfolioId)
          : null,
    [
      requestedId,
      role,
      currentUser?.email,
      currentUser?.name,
      ownPortfolio,
      portfolioId,
    ],
  );

  const [portfolio, setPortfolio] = useState<ArtistPortfolio | null>(null);
  const [localPortfolio, setLocalPortfolio] = useState<ArtistProfile | null>(
    initialLocalPortfolio,
  );
  const [loading, setLoading] = useState(!initialLocalPortfolio);
  const [notice, setNotice] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    if (!portfolioId || initialLocalPortfolio || requestedId === "me") {
      return;
    }

    // In actual implementation, we might need a GET endpoint.
    // Assuming backend returns portfolio on /api/artists/{id} or /api/portfolios
    fetch(`http://localhost:8080/api/artists`)
      .then((res) => res.json())
      .then((data: ArtistPortfolio[]) => {
        // Mock matching the ID for now
        const artist = data.find((a) => a.id.toString() === portfolioId);
        setPortfolio(artist ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [portfolioId, initialLocalPortfolio, requestedId]);

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

  const deletePortfolio = () => {
    if (!currentUser?.email) {
      return;
    }

    deleteArtistProfileByOwner(currentUser.email);

    if (requestedId === "me" && currentUser.email) {
      setLocalPortfolio({
        id: `local-artist-${encodeURIComponent(currentUser.email)}`,
        ownerEmail: currentUser.email,
        ownerName: currentUser.name || "Tattoo Artist",
        style: "",
        bio: "",
        location: "",
        rateRange: "",
        profileImage: "",
        galleryImages: [],
      });
      setNotice("Portfolio deleted. You can create a new one now.");
      return;
    }

    setNotice("Portfolio deleted.");
    router.push("/artists");
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

    const customerProfile = currentUser.email
      ? getCustomerProfileByOwner(currentUser.email)
      : null;

    const targetName =
      localPortfolio?.ownerName || portfolio?.userId?.name || "Artist";

    addBooking({
      id: `bk-${Date.now()}`,
      customerEmail: currentUser.email,
      customerName:
        customerProfile?.ownerName || currentUser.name || "Customer",
      targetType: "ARTIST",
      targetId: String(portfolioId),
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
      ) : requestedId === "me" && role !== "ARTIST" ? (
        <div className="empty-state glass mt-4">
          <p>Only tattoo artist accounts can manage a portfolio.</p>
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
              {localPortfolio?.profileImage ? (
                <img
                  src={localPortfolio.profileImage}
                  alt={localPortfolio.ownerName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                (
                  localPortfolio?.ownerName ||
                  portfolio?.userId?.name ||
                  "A"
                ).charAt(0)
              )}
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
              <div
                style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}
              >
                <label className="text-secondary">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !localPortfolio) {
                      return;
                    }
                    const imageData = await fileToDataUrl(file);
                    setLocalPortfolio({
                      ...localPortfolio,
                      profileImage: imageData,
                    });
                  }}
                />
              </div>
              <div
                style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}
              >
                <label className="text-secondary">Portfolio Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="input-field"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length === 0 || !localPortfolio) {
                      return;
                    }
                    const images = await Promise.all(
                      files.map((file) => fileToDataUrl(file)),
                    );
                    setLocalPortfolio({
                      ...localPortfolio,
                      galleryImages: [
                        ...localPortfolio.galleryImages,
                        ...images,
                      ].slice(0, 16),
                    });
                  }}
                />
              </div>
              <button
                className="btn-primary"
                type="submit"
                style={{ marginTop: "1rem" }}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={deletePortfolio}
                style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
              >
                Delete Portfolio
              </button>
            </form>
          )}

          <h3
            className="heading-3 mt-8"
            style={{ marginTop: "3rem", marginBottom: "1.5rem" }}
          >
            Gallery
          </h3>
          {localPortfolio?.galleryImages?.length ? (
            <div className="grid-list">
              {localPortfolio.galleryImages.map((image, index) => (
                <div
                  key={`${image.slice(0, 20)}-${index}`}
                  className="glass"
                  style={{
                    height: "220px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image}
                    alt={`Artwork ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass">
              <p>No artwork uploaded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
