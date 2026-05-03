"use client";
import { useEffect, useState } from "react";

interface AvailabilityProps {
  artistId: string | number;
  date?: string;
  onSelectSlot?: (slotId: string | number, time: string) => void;
}

export default function Availability({
  artistId,
  date = "2026-05-10",
  onSelectSlot,
}: AvailabilityProps) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | number | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`http://localhost:8080/api/availability/${artistId}/${date}`)
      .then((res) => res.json())
      .then(setSlots)
      .catch((err) =>
        setError("Failed to load available slots: " + err.message),
      )
      .finally(() => setLoading(false));
  }, [artistId, date]);

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

      <div className="grid grid-cols-3 gap-3">
        {slots.map((s: any) => (
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
            {s.booked && <span className="text-xs">(Booked)</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
