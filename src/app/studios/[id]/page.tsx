"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../artists/shared.css";
import {
  addBooking,
  getCurrentUser,
  getStudioProfileById,
  normalizeRole,
  type StudioProfile,
} from "@/utils/appData";

type BackendStudio = {
  id: number | string;
  name?: string;
  address?: string;
};

export default function StudioDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const studioId = id ?? "";
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);
  const initialLocalStudio = studioId ? getStudioProfileById(studioId) : null;

  const [studio, setStudio] = useState<BackendStudio | null>(null);
  const [localStudio] = useState<StudioProfile | null>(initialLocalStudio);
  const [loading, setLoading] = useState(!initialLocalStudio);
  const [notice, setNotice] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    if (!studioId || initialLocalStudio) {
      return;
    }

    fetch("http://localhost:8080/api/studios")
      .then((res) => res.json())
      .then((data: BackendStudio[]) => {
        const match = data.find((item) => String(item.id) === String(studioId));
        setStudio(match ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [studioId, initialLocalStudio]);

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

    const targetName = localStudio?.name || studio?.name || "Studio";

    addBooking({
      id: `bk-${Date.now()}`,
      customerEmail: currentUser.email,
      customerName: currentUser.name || "Customer",
      targetType: "STUDIO",
      targetId: String(studioId),
      targetName,
      appointmentDate,
      notes: bookingNote,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });

    setAppointmentDate("");
    setBookingNote("");
    setNotice("Studio booking request submitted. Check My Bookings.");
  };

  return (
    <div className="page-container container">
      <h1 className="heading-2">
        Studio <span className="text-gradient">Details</span>
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
      ) : !studio && !localStudio ? (
        <div className="empty-state glass mt-4">
          <p>Studio not found.</p>
        </div>
      ) : (
        <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
          {localStudio?.profileImage && (
            <img
              src={localStudio.profileImage}
              alt={localStudio.name || "Studio profile"}
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}
          <h2 className="heading-3">
            {localStudio?.name || studio?.name || "Studio"}
          </h2>
          <p className="text-secondary mt-2">
            {localStudio?.address || studio?.address || "Address not listed"}
          </p>
          {localStudio?.description && (
            <p className="text-secondary mt-2">{localStudio.description}</p>
          )}

          {role === "CUSTOMER" && (
            <form onSubmit={createBooking} style={{ marginTop: "1.5rem" }}>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
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
                  placeholder="Tattoo plan or note"
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  Book Studio
                </button>
              </div>
            </form>
          )}

          {localStudio?.galleryImages?.length ? (
            <>
              <h3
                className="heading-3"
                style={{ marginTop: "2rem", marginBottom: "1rem" }}
              >
                Studio Gallery
              </h3>
              <div className="grid-list">
                {localStudio.galleryImages.map((image, index) => (
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
                      alt={`Studio image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
