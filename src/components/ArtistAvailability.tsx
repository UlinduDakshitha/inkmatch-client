"use client";

import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import {
  getLocalAvailabilitySlots,
  upsertLocalAvailabilitySlots,
} from "@/utils/appData";

interface TimeSlot {
  id?: string;
  time: string;
  available: boolean;
  bookedByCustomer?: boolean;
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
  const [newSlotTime, setNewSlotTime] = useState("09:00");

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch both availability and consultations for this date
      const [availResponse, consultResponse] = await Promise.all([
        fetch(
          `http://localhost:8080/api/availability/${artistId}/${selectedDate}`,
        ),
        fetch(
          `http://localhost:8080/api/consultations?artistId=${artistId}&date=${selectedDate}`,
        ).catch(() => ({ ok: false })), // Consultations endpoint might not exist yet
      ]);

      const availData = await availResponse.json();
      let consultations: any[] = [];

      if (consultResponse.ok) {
        try {
          consultations = await consultResponse.json();
        } catch (e) {
          // If parsing fails, just use empty array
          consultations = [];
        }
      }

      // Merge availability and consultation data
      const mergedSlots = (availData || []).map((slot: any) => ({
        ...slot,
        available: !slot.booked,
        bookedByCustomer: slot.booked, // Assume booked slots are from customers
      }));

      // If no data from API, create defaults
      if (mergedSlots.length === 0) {
        const localSlots = getLocalAvailabilitySlots(artistId, selectedDate);
        if (localSlots.length > 0) {
          setSlots(
            localSlots.map((slot) => ({
              ...slot,
              available: !slot.booked,
              bookedByCustomer: Boolean(slot.booked),
            })),
          );
        } else {
          setSlots([]);
        }
      } else {
        setSlots(mergedSlots);
      }
    } catch (err) {
      const localSlots = getLocalAvailabilitySlots(artistId, selectedDate);
      if (localSlots.length > 0) {
        setSlots(
          localSlots.map((slot) => ({
            ...slot,
            available: !slot.booked,
            bookedByCustomer: Boolean(slot.booked),
          })),
        );
        setError("");
      } else {
        setError("Failed to load slots: " + (err as any).message);
        setSlots([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = async (time: string) => {
    const newSlots = slots.map((slot) =>
      slot.time === time && !slot.bookedByCustomer
        ? { ...slot, available: !slot.available }
        : slot,
    );
    setSlots(newSlots);
  };

  const addSlot = () => {
    const normalizedTime = newSlotTime.trim();

    if (!normalizedTime) {
      setError("Please choose a time for the new slot.");
      return;
    }

    if (slots.some((slot) => slot.time === normalizedTime)) {
      setError("This time slot already exists.");
      return;
    }

    const nextSlots = [
      ...slots,
      {
        id: `${artistId}-${selectedDate}-${normalizedTime}`,
        time: normalizedTime,
        available: true,
        bookedByCustomer: false,
      },
    ].sort((a, b) => a.time.localeCompare(b.time));

    setSlots(nextSlots);
    setError("");
    persistLocalSlots(nextSlots);
  };

  const persistLocalSlots = (nextSlots: TimeSlot[]) => {
    upsertLocalAvailabilitySlots(
      artistId,
      selectedDate,
      nextSlots.map((slot) => ({
        id: slot.id ?? `${artistId}-${selectedDate}-${slot.time}`,
        time: slot.time,
        booked: !slot.available || slot.bookedByCustomer,
      })),
    );
  };

  const saveAvailability = async () => {
    setLoading(true);
    setError("");
    const nextSlots = slots.map((slot) => ({
      ...slot,
      id: slot.id ?? `${artistId}-${selectedDate}-${slot.time}`,
    }));

    try {
      const response = await fetch(
        `http://localhost:8080/api/availability/${artistId}/${selectedDate}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            slots: nextSlots.map((s) => ({
              ...s,
              booked: !s.available || s.bookedByCustomer, // Send booked status back
            })),
          }),
        },
      );

      if (response.ok) {
        persistLocalSlots(nextSlots);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return;
      }

      persistLocalSlots(nextSlots);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      persistLocalSlots(nextSlots);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
          Availability for{" "}
          {new Date(selectedDate + "T00:00:00").toLocaleDateString()}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0 0 0.5rem 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                border: "1px solid #22c55e",
                borderRadius: "4px",
                marginRight: "0.5rem",
              }}
            ></span>
            Available
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0.5rem 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: "rgba(107, 114, 128, 0.2)",
                border: "1px solid #6b7280",
                borderRadius: "4px",
                marginRight: "0.5rem",
              }}
            ></span>
            Blocked (by you)
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.6)",
              margin: "0.5rem 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                border: "2px solid #ef4444",
                borderRadius: "4px",
                marginRight: "0.5rem",
              }}
            ></span>
            Booked (by customer)
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "end",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <label
              htmlFor="new-slot-time"
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.75)",
                marginBottom: "0.5rem",
              }}
            >
              Add a time slot
            </label>
            <input
              id="new-slot-time"
              type="time"
              value={newSlotTime}
              onChange={(e) => setNewSlotTime(e.target.value)}
              className="input-field"
              style={{ minWidth: "180px" }}
            />
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="btn-primary"
            style={{ height: "fit-content" }}
          >
            Add Slot
          </button>
        </div>

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
              {slots.length === 0 ? (
                <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
                  No slots added yet. Use the time picker above to create your
                  first availability slot.
                </p>
              ) : (
                slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => toggleSlot(slot.time)}
                    disabled={slot.bookedByCustomer}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: slot.bookedByCustomer
                        ? "2px solid #ef4444"
                        : slot.available
                          ? "1px solid rgba(34, 197, 94, 0.5)"
                          : "1px solid #6b7280",
                      background: slot.bookedByCustomer
                        ? "rgba(239, 68, 68, 0.2)"
                        : slot.available
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(107, 114, 128, 0.2)",
                      color: slot.bookedByCustomer
                        ? "#ef4444"
                        : slot.available
                          ? "#22c55e"
                          : "#9ca3af",
                      cursor: slot.bookedByCustomer ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      transition: "all 0.2s",
                      opacity: slot.bookedByCustomer ? 0.7 : 1,
                    }}
                    title={
                      slot.bookedByCustomer
                        ? "This slot is booked by a customer"
                        : slot.available
                          ? "Click to block this time"
                          : "Click to make available"
                    }
                  >
                    <span style={{ display: "block" }}>{slot.time}</span>
                    <span style={{ display: "block", fontSize: "0.75rem" }}>
                      {slot.bookedByCustomer
                        ? "📅 Booked"
                        : slot.available
                          ? "✓ Available"
                          : "⛔ Blocked"}
                    </span>
                  </button>
                ))
              )}
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
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Available slots:{" "}
                <strong>
                  {
                    slots.filter((s) => s.available && !s.bookedByCustomer)
                      .length
                  }
                </strong>
              </p>
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Booked by customers:{" "}
                <strong>
                  {slots.filter((s) => s.bookedByCustomer).length}
                </strong>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Total: <strong>{slots.length}</strong>
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
