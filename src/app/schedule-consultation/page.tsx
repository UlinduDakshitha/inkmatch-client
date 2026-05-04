"use client";

import { useEffect, useState } from "react";
import { addBooking, getArtistProfiles, getCurrentUser } from "@/utils/appData";
import { getMockArtists } from "@/utils/mockBookings";
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
    const localArtists: Artist[] = getArtistProfiles().map((profile) => ({
      id: profile.id,
      ownerName: profile.ownerName,
      style: profile.style || "Custom Style",
    }));

    const mockArtists: Artist[] = getMockArtists().map((artist) => ({
      id: artist.id,
      ownerName: artist.ownerName,
      style: artist.style,
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
        const merged = [...localArtists, ...backendArtists, ...mockArtists];
        const uniqueById = merged.filter(
          (artist, index, array) =>
            index ===
            array.findIndex((item) => String(item.id) === String(artist.id)),
        );

        setArtists(uniqueById);
        setError("");
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        const fallbackArtists = [...localArtists, ...mockArtists];
        setArtists(fallbackArtists);
        setError(
          fallbackArtists.length > 0
            ? "Backend unavailable. Showing sample artists so you can continue booking."
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
      const mockArtists: Artist[] = getMockArtists().map((artist) => ({
        id: artist.id,
        ownerName: artist.ownerName,
        style: artist.style,
      }));
      const backendArtists = Array.isArray(data) ? data : [];
      const merged = [...localArtists, ...backendArtists, ...mockArtists];
      setArtists(
        merged.filter(
          (artist, index, array) =>
            index ===
            array.findIndex((item) => String(item.id) === String(artist.id)),
        ),
      );
    } catch (err) {
      const fallbackArtists = [
        ...getArtistProfiles().map((profile) => ({
          id: profile.id,
          ownerName: profile.ownerName,
          style: profile.style || "Custom Style",
        })),
        ...getMockArtists().map((artist) => ({
          id: artist.id,
          ownerName: artist.ownerName,
          style: artist.style,
        })),
      ];
      setArtists(fallbackArtists);
      setError(
        "Backend unavailable. Showing sample artists so you can continue booking.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseMockArtists = () => {
    setArtists(getMockArtists());
    setError("");
    setLoading(false);
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
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/consultations";
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user?.email) {
    if (!mounted) {
      return (
        <div
          className="page-container container"
          style={{ paddingTop: "120px" }}
        >
          <div className="glass-card">
            <h1 className="heading-3">Loading consultation page...</h1>
            <p className="text-secondary mt-2">
              Preparing your booking screen.
            </p>
          </div>
        </div>
      );
    }

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

  if (!mounted) {
    return (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Loading consultation page...</h1>
          <p className="text-secondary mt-2">Preparing your booking screen.</p>
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
        <div
          className="glass-card"
          style={{ marginBottom: "1.5rem", padding: "1rem" }}
        >
          <p style={{ color: "#ef4444", margin: 0, fontWeight: 700 }}>
            ⚠️ Failed to load artists
          </p>
          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.5rem" }}>
            {error}
          </p>
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={handleRetryArtists} className="btn-primary">
              Retry
            </button>
            <button
              onClick={handleUseMockArtists}
              style={{
                padding: "0.5rem 0.75rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
              }}
            >
              Use Mock Artists
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
