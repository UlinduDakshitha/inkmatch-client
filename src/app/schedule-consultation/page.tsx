"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/appData";
import Availability from "@/components/Availability";
import Calendar from "@/components/Calendar";

export default function ScheduleConsultationPage() {
  const user = getCurrentUser();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<string | number>("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<{
    id: string | number;
    time: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/artists")
      .then((res) => res.json())
      .then(setArtists)
      .catch((err) => setError("Failed to load artists: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedArtist || !selectedSlot) {
      alert("Please select an artist and time slot");
      return;
    }

    if (!user?.email) {
      alert("Please log in to schedule a consultation");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId: selectedArtist,
          customerEmail: user.email,
          date: selectedDate,
          time: selectedSlot.time,
          slotId: selectedSlot.id,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/consultations";
        }, 2000);
      } else {
        alert("Failed to schedule consultation");
      }
    } catch (err) {
      alert("Error scheduling consultation: " + (err as any).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user?.email) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Please log in first</h1>
          <p className="text-secondary mt-2">
            You need to be logged in to schedule a consultation.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div
          className="glass-card"
          style={{
            border: "1px solid rgba(34, 197, 94, 0.5)",
            background: "rgba(34, 197, 94, 0.1)",
          }}
        >
          <h1 className="heading-3">Consultation Scheduled!</h1>
          <p className="text-secondary mt-2">
            Your consultation has been booked. Redirecting to consultations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Schedule a <span className="text-gradient">Consultation</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        Book a time slot with your chosen artist.
      </p>

      {/* Info Box */}
      <div
        className="glass-card"
        style={{
          marginBottom: "2rem",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          background: "rgba(59, 130, 246, 0.05)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          ℹ️ You're viewing the artist's <strong>live calendar</strong>.
          Available times include only slots when the artist is free. All
          bookings are in sync across the platform.
        </p>
      </div>

      {error && (
        <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSchedule}
        className="glass-card"
        style={{ maxWidth: "600px" }}
      >
        {/* Artist Selection */}
        <div style={{ marginBottom: "2rem" }}>
          <label className="block text-white font-semibold mb-2">
            Select Artist
          </label>
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="input-field"
            required
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading artists..." : "Choose an artist..."}
            </option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.ownerName || "Artist"} - {artist.style}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div style={{ marginBottom: "2rem" }}>
          <label className="block text-white font-semibold mb-2">
            Select Date
          </label>
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Time Slot Selection */}
        {selectedArtist && (
          <div style={{ marginBottom: "2rem" }}>
            <Availability
              artistId={selectedArtist}
              date={selectedDate}
              onSelectSlot={(slotId, time) =>
                setSelectedSlot({ id: slotId, time })
              }
            />
          </div>
        )}

        {/* Selected Slot Summary */}
        {selectedSlot && (
          <div
            className="glass"
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <p className="text-secondary">
              Selected:{" "}
              <strong className="text-white">{selectedSlot.time}</strong>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={!selectedSlot || submitting}
        >
          {submitting ? "Scheduling..." : "Confirm Consultation"}
        </button>
      </form>
    </div>
  );
}
