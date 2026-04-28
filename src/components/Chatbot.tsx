"use client";
import { useState } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi 👋 I'm your InkMatch assistant" }
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

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to server 😢" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 h-[500px] bg-neutral-900 text-white rounded-2xl shadow-2xl flex flex-col border border-neutral-700">

      {/* Header */}
      <div className="p-4 border-b border-neutral-700 font-semibold">
        InkMatch AI 💬
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-xl max-w-[75%] ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-neutral-700"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <p className="text-gray-400">Typing...</p>}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neutral-700 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-neutral-800 outline-none text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about tattoos..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}