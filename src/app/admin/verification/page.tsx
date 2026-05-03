"use client";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/artists")
      .then((res) => res.json())
      .then(setArtists)
      .catch((err) => setError("Failed to load artists: " + err.message));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(
      `http://localhost:8080/api/admin/verification/${id}?status=${status}`,
      { method: "PUT" },
    );
    alert("Updated");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Verification</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {artists.length === 0 && !error && <p>No artists found.</p>}

      {artists.map((a: any) => (
        <div key={a.id} className="p-3 border mb-2">
          <p>{a.name}</p>
          <p>Status: {a.verificationStatus}</p>

          <button
            onClick={() => updateStatus(a.id, "APPROVED")}
            className="bg-green-500 px-2 mr-2"
          >
            Approve
          </button>

          <button
            onClick={() => updateStatus(a.id, "REJECTED")}
            className="bg-red-500 px-2"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
