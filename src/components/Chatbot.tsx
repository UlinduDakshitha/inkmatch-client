"use client";

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

function ChatbotAvatar({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/chatbot-icon.svg"
      alt="InkMatch chatbot"
      width={size}
      height={size}
      style={{ display: "block", width: size, height: size }}
    />
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi 👋 I'm your InkMatch assistant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Find a tattoo artist",
    "How do bookings work?",
    "Show studio options",
  ];

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
        body: JSON.stringify({ message: userMsg.content }),
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
            width: "min(410px, calc(100vw - 28px))",
            height: "min(620px, calc(100vh - 92px))",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "30px",
            border:
              "1px solid color-mix(in srgb, var(--accent-primary) 28%, rgba(255,255,255,0.12))",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--bg-secondary) 84%, transparent) 0%, color-mix(in srgb, var(--bg-primary) 88%, transparent) 100%)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            style={{
              padding: "1rem 1rem 1rem",
              borderBottom:
                "1px solid color-mix(in srgb, var(--glass-border) 80%, transparent)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent-primary) 18%, transparent), color-mix(in srgb, #ff9933 12%, transparent))",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: "0 10px 24px rgba(255, 51, 102, 0.18)",
                }}
              >
                <ChatbotAvatar size={46} />
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
                        color: "var(--text-secondary)",
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
                      width: "36px",
                      height: "36px",
                      borderRadius: "999px",
                      border: "1px solid var(--glass-border)",
                      background:
                        "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                </div>
                <div
                  style={{
                    marginTop: "0.7rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--glass-border)",
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 0 6px rgba(34,197,94,0.14)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Online and ready to help
                  </span>
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
              gap: "0.85rem",
              background:
                "radial-gradient(circle at top, color-mix(in srgb, var(--accent-primary) 8%, transparent), transparent 34%)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  style={{
                    border: "1px solid var(--glass-border)",
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--text-primary)",
                    borderRadius: "999px",
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    transition: "var(--transition)",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                    maxWidth: "84%",
                    padding: "0.85rem 0.95rem",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 6px 18px"
                        : "18px 18px 18px 6px",
                    lineHeight: 1.5,
                    fontSize: "0.92rem",
                    color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, rgba(255, 51, 102, 1), rgba(255, 119, 51, 1))"
                        : "color-mix(in srgb, var(--glass-bg) 92%, transparent)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid var(--glass-border)",
                    boxShadow:
                      msg.role === "user"
                        ? "0 12px 24px rgba(255, 51, 102, 0.22)"
                        : "none",
                    whiteSpace: "pre-wrap",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
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
                  background:
                    "color-mix(in srgb, var(--bg-secondary) 78%, transparent)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                  borderRadius: "16px",
                  padding: "0.88rem 1rem",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
            padding: "0.92rem 1rem 0.92rem 0.92rem",
            borderRadius: "999px",
            border: "1px solid var(--glass-border)",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--bg-secondary) 90%, transparent), color-mix(in srgb, var(--bg-primary) 88%, transparent))",
            color: "var(--text-primary)",
            boxShadow: "0 18px 42px rgba(0, 0, 0, 0.35)",
            cursor: "pointer",
            backdropFilter: "blur(18px)",
          }}
        >
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 10px 22px rgba(255, 51, 102, 0.18)",
            }}
          >
            <ChatbotAvatar size={36} />
          </span>
          <span style={{ textAlign: "left" }}>
            <strong style={{ display: "block", fontSize: "0.92rem" }}>
              InkMatch AI
            </strong>
            <span
              style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}
            >
              Ask anything about tattoos
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
