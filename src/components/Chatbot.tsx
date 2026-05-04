"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState<{ reply?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat");

        if (!res.ok) {
          throw new Error("API Error");
        }

        const result = await res.json();

        setData(result);
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : String(err);
        setError("Failed to load chatbot response: " + message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 🔥 VERY IMPORTANT

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>InkMatch AI Chatbot 🤖</h1>

      {/* 🔄 LOADING */}
      {loading && <p>Loading AI response...</p>}

      {/* ❌ ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ✅ SUCCESS */}
      {data && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#222",
            borderRadius: "10px",
          }}
        >
          <p>{data.reply}</p>
        </div>
      )}
    </div>
  );
}
