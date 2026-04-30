import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "../components/Chatbot";

export const metadata: Metadata = {
  title: "InkMatch | Premium Tattoo Matching",
  description: "Find your perfect tattoo artist and studio.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* NAVBAR */}
        <Navbar />
        

        {/* MAIN CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* GLOBAL CHATBOT */}
        <Chatbot />
      </body>
    </html>
  );
}
