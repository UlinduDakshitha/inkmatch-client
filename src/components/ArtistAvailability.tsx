"use client";

import { useEffect, useState } from "react";
import Calendar from "./Calendar";

interface TimeSlot {
  id?: string;
  time: string;
  booked: boolean;
}

interface ArtistAvailabilityProps {
  artistId: string | number;
}

export default function ArtistAvailability({
  artistId,
}: ArtistAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Predefined time slots
  const availableHours = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${String(hour).padStart(2, "0")}:00`;
  });

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/availability/${artistId}/${selectedDate}`,
      );
      const data = await response.json();
      setSlots(data || []);
    } catch (err) {
      setError("Failed to load slots: " + (err as any).message);
      // Create default slots if fetch fails
      setSlots(
        availableHours.map((time) => ({
          time,
          booked: false,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = async (time: string) => {
    const newSlots = slots.map((slot) =>
      slot.time === time ? { ...slot, booked: !slot.booked } : slot,
    );
    setSlots(newSlots);
  };

  const saveAvailability = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/availability/${artistId}/${selectedDate}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            slots: slots,
          }),
        },
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to save availability");
      }
    } catch (err) {
      setError("Error saving: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h2 className="heading-3 mb-4">Manage Your Availability</h2>

      {error && (
        <div
          className="glass"
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(239, 68, 68, 0.5)",
          }}
        >
          <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="glass"
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(34, 197, 94, 0.5)",
          }}
        >
          <p style={{ color: "#22c55e", margin: 0 }}>
            Availability saved successfully!
          </p>
        </div>
      )}

      {/* Calendar */}
      <div style={{ marginBottom: "2rem" }}>
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Time Slots */}
      <div
        className="glass"
        style={{ padding: "1.5rem", borderRadius: "12px" }}
      >
        <h3 className="text-white mb-4">
          Available Times for{" "}
          {new Date(selectedDate + "T00:00:00").toLocaleDateString()}
        </h3>

        {loading ? (
          <p className="text-gray-400">Loading slots...</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {slots.length === 0
                ? availableHours.map((time) => (
                    <button
                      key={time}
                      onClick={() => toggleSlot(time)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "transparent",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        transition: "all 0.2s",
                      }}
                      className="hover:bg-white/10"
                    >
                      {time}
                    </button>
                  ))
                : slots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => toggleSlot(slot.time)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: slot.booked
                          ? "2px solid #ef4444"
                          : "1px solid rgba(34, 197, 94, 0.5)",
                        background: slot.booked
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(34, 197, 94, 0.1)",
                        color: slot.booked ? "#ef4444" : "#22c55e",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                    >
                      {slot.time}
                      {slot.booked && " ✓"}
                    </button>
                  ))}
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Available slots:{" "}
                <strong>{slots.filter((s) => !s.booked).length}</strong> /{" "}
                {slots.length}
              </p>
            </div>

            <button
              onClick={saveAvailability}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Saving..." : "Save Availability"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
