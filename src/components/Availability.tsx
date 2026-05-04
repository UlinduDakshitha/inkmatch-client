"use client";
import { useEffect, useState } from "react";
import { getLocalAvailabilitySlots } from "@/utils/appData";

interface AvailabilityProps {
  artistId: string | number;
  date?: string;
  onSelectSlot?: (slotId: string | number, time: string) => void;
}

export default function Availability({
  artistId,
  date,
  onSelectSlot,
}: AvailabilityProps) {
  type TimeSlot = {
    id: string | number;
    time: string;
    booked?: boolean;
  };

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | number | null>(
    null,
  );

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080";
  const resolvedDate =
    date ||
    (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    })();

  const readLocalSlots = (): TimeSlot[] =>
    getLocalAvailabilitySlots(artistId, resolvedDate);

  const syncSlots = (nextSlots: TimeSlot[]) => {
    const normalized = nextSlots.map((slot, index) => ({
      id: slot.id ?? `${artistId}-${date}-${index}`,
      time: slot.time,
      booked: Boolean(slot.booked),
    }));
    setSlots(normalized);
    return normalized;
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${apiBaseUrl}/api/availability/${artistId}/${resolvedDate}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const apiSlots = Array.isArray(data) ? data : [];
        if (apiSlots.length > 0) {
          syncSlots(apiSlots);
          return;
        }

        const localSlots = readLocalSlots();
        syncSlots(localSlots);
      })
      .catch((err) => {
        const localSlots = readLocalSlots();
        syncSlots(localSlots);
        setError("");
        return err;
      })
      .finally(() => setLoading(false));
  }, [apiBaseUrl, artistId, resolvedDate]);

  const handleSelectSlot = (slotId: string | number, time: string) => {
    setSelectedSlot(slotId);
    onSelectSlot?.(slotId, time);
  };

  if (loading)
    return <p className="text-gray-400">Loading available times...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (slots.length === 0)
    return <p className="text-gray-400">No available slots for this date.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Select Time Slot</h2>

      <div className="mb-4 text-sm text-white/70 flex flex-wrap gap-3">
        <span>✓ Available</span>
        <span>📅 Booked</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectSlot(s.id, s.time)}
            disabled={s.booked}
            className={`p-3 rounded-lg border transition ${
              selectedSlot === s.id
                ? "bg-blue-600 border-blue-600 text-white"
                : s.booked
                  ? "bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}
          >
            <span className="block">{s.time}</span>
            <span className="block text-xs">
              {s.booked ? "📅 Booked" : "✓ Available"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
