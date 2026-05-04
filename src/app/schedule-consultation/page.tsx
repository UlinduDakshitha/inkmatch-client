"use client";

import { useEffect, useState } from "react";
import {
  addBooking,
  addNotification,
  getArtistProfiles,
  getCurrentUser,
} from "@/utils/appData";
import Availability from "@/components/Availability";
import Calendar from "@/components/Calendar";

type Artist = {
  id: string | number;
  ownerName?: string;
  name?: string;
  style?: string;
  userId?: {
    name?: string;
  };
};

function mergeArtists(...groups: Artist[][]): Artist[] {
  const merged = groups.flat();
  return merged.filter(
    (artist, index, array) =>
      index ===
      array.findIndex((item) => String(item.id) === String(artist.id)),
  );
}

export default function ScheduleConsultationPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(
    () => null as ReturnType<typeof getCurrentUser>,
  );
  const [artists, setArtists] = useState<Artist[]>([]);
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
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080";

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (artists.length > 0 && !selectedArtist) {
      setSelectedArtist(artists[0].id);
    }
  }, [artists, selectedArtist]);

  useEffect(() => {
    const localArtists: Artist[] = getArtistProfiles().map((profile) => ({
      id: profile.id,
      ownerName: profile.ownerName,
      style: profile.style || "Custom Style",
    }));

    const controller = new AbortController();

    fetch(`${apiBaseUrl}/api/artists`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json() as Promise<Artist[]>;
      })
      .then((data) => {
        const backendArtists = Array.isArray(data) ? data : [];
        const merged = mergeArtists(localArtists, backendArtists);
        setArtists(merged);
        setError(merged.length > 0 ? "" : "No registered artists found.");
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        const fallbackArtists = mergeArtists(localArtists);
        setArtists(fallbackArtists);
        setError(
          fallbackArtists.length > 0
            ? ""
            : "Failed to load artists: " + message,
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiBaseUrl]);

  const handleRetryArtists = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBaseUrl}/api/artists`);
      if (!res.ok) throw new Error("Failed to load artists");
      const data = await res.json();
      const localArtists: Artist[] = getArtistProfiles().map((profile) => ({
        id: profile.id,
        ownerName: profile.ownerName,
        style: profile.style || "Custom Style",
      }));
      const backendArtists = Array.isArray(data) ? data : [];
      setArtists(mergeArtists(localArtists, backendArtists));
    } catch (err) {
      const fallbackArtists = mergeArtists(
        getArtistProfiles().map((profile) => ({
          id: profile.id,
          ownerName: profile.ownerName,
          style: profile.style || "Custom Style",
        })),
      );
      setArtists(fallbackArtists);
      setError(
        fallbackArtists.length > 0
          ? ""
          : "Failed to load artists. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
      const selectedArtistRecord = artists.find(
        (artist) => String(artist.id) === String(selectedArtist),
      );

      const response = await fetch(`${apiBaseUrl}/api/consultations`, {
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
        throw new Error("Failed to schedule consultation");
      }
    } catch (err) {
      const selectedArtistRecord = artists.find(
        (artist) => String(artist.id) === String(selectedArtist),
      );
      addBooking({
        id: `local-booking-${Date.now()}`,
        customerEmail: user.email,
        customerName: user.name || "Customer",
        targetType: "ARTIST",
        targetId: String(selectedArtist),
        targetName:
          selectedArtistRecord?.ownerName ||
          selectedArtistRecord?.name ||
          "Selected Artist",
        appointmentDate: selectedDate,
        notes: `Consultation at ${selectedSlot.time}`,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });

      // Notify artist of new booking request
      const artistEmail =
        selectedArtistRecord?.ownerName?.toLowerCase().replace(/\s+/g, ".") +
          "@inkmatch.local" || String(selectedArtist);
      addNotification({
        userEmail: artistEmail,
        title: "📅 New Consultation Request",
        message: `${user.name || "A customer"} requested a consultation for ${selectedDate} at ${selectedSlot.time}`,
        isRead: false,
        category: "BOOKING",
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/consultations";
      }, 2000);
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

      {!loading && artists.length === 0 && (
        <div
          className="glass-card"
          style={{ marginBottom: "1.5rem", padding: "1rem" }}
        >
          <p style={{ color: "#ef4444", margin: 0, fontWeight: 700 }}>
            No registered artists found
          </p>
          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.5rem" }}>
            Create an artist profile first, or try reloading if the backend is
            temporarily unavailable.
          </p>
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={handleRetryArtists} className="btn-primary">
              Retry
            </button>
          </div>
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
                {artist.ownerName || artist.name || "Artist"} - {artist.style}
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
