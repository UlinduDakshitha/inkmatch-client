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
  const currentUser = getCurrentUser();
  const role = normalizeRole(currentUser?.role);

  const [studio, setStudio] = useState<BackendStudio | null>(null);
  const [localStudio, setLocalStudio] = useState<StudioProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const local = getStudioProfileById(id);
    if (local) {
      setLocalStudio(local);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/studios")
      .then((res) => res.json())
      .then((data: BackendStudio[]) => {
        const match = data.find((item) => String(item.id) === String(id));
        setStudio(match ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

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
      targetId: String(id),
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
        </div>
      )}
    </div>
  );
}
