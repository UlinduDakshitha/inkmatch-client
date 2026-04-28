"use client";
import { useState } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi 👋 I'm your InkMatch assistant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to server 😢" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.8rem",
      }}
    >
      {open ? (
        <div
          style={{
            width: "min(380px, calc(100vw - 32px))",
            height: "min(560px, calc(100vh - 120px))",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "28px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background:
              "linear-gradient(180deg, rgba(18, 18, 22, 0.92) 0%, rgba(10, 10, 14, 0.88) 100%)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              padding: "1rem 1rem 0.95rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background:
                "linear-gradient(135deg, rgba(255, 51, 102, 0.18), rgba(255, 153, 51, 0.1))",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.05rem",
                  background:
                    "linear-gradient(145deg, rgba(255, 51, 102, 1), rgba(255, 153, 51, 1))",
                  boxShadow: "0 10px 24px rgba(255, 51, 102, 0.28)",
                }}
              >
                💬
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                      InkMatch AI
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Ask about tattoos, artists, studios, or bookings
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Minimize chat"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "grid",
              gap: "0.8rem",
              background:
                "radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent 34%)",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "0.8rem 0.95rem",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 6px 18px"
                        : "18px 18px 18px 6px",
                    lineHeight: 1.5,
                    fontSize: "0.92rem",
                    color: "#fff",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, rgba(255, 51, 102, 1), rgba(255, 119, 51, 1))"
                        : "rgba(255, 255, 255, 0.08)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow:
                      msg.role === "user"
                        ? "0 12px 24px rgba(255, 51, 102, 0.22)"
                        : "none",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}
              >
                Typing...
              </div>
            )}
          </div>

          <div
            style={{
              padding: "0.9rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <input
                className="input-field"
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  color: "#fff",
                  borderRadius: "16px",
                  padding: "0.88rem 1rem",
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about tattoos..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void sendMessage();
                  }
                }}
              />
              <button
                onClick={() => void sendMessage()}
                disabled={loading}
                style={{
                  border: "none",
                  borderRadius: "16px",
                  padding: "0 1rem",
                  minWidth: "78px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, rgba(255, 51, 102, 1), rgba(255, 153, 51, 1))",
                  boxShadow: "0 12px 24px rgba(255, 51, 102, 0.24)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open InkMatch AI chat"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background:
              "linear-gradient(135deg, rgba(18, 18, 22, 0.92), rgba(28, 28, 34, 0.9))",
            color: "#fff",
            boxShadow: "0 18px 42px rgba(0, 0, 0, 0.35)",
            cursor: "pointer",
            backdropFilter: "blur(18px)",
          }}
        >
          <span
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(145deg, rgba(255, 51, 102, 1), rgba(255, 153, 51, 1))",
              boxShadow: "0 10px 22px rgba(255, 51, 102, 0.28)",
              fontSize: "1rem",
            }}
          >
            💬
          </span>
          <span style={{ textAlign: "left" }}>
            <strong style={{ display: "block", fontSize: "0.92rem" }}>
              InkMatch AI
            </strong>
            <span
              style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.68)" }}
            >
              Ask anything about tattoos
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
