"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AdminMenuItem = {
  label: string;
  href: string;
  icon: string;
};

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const adminMenuItems: AdminMenuItem[] = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "User Management", href: "/admin/users", icon: "👥" },
    { label: "Verification", href: "/admin/verification", icon: "✓" },
    { label: "Approvals", href: "/admin/approvals", icon: "✍️" },
    { label: "Analytics", href: "/admin/analytics", icon: "📈" },
    { label: "Bookings", href: "/admin/bookings", icon: "📅" },
    { label: "Reports", href: "/admin/reports", icon: "📄" },
    { label: "Moderation", href: "/admin/moderation", icon: "🛡️" },
    { label: "AI Monitoring", href: "/admin/ai-monitoring", icon: "🤖" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", gap: "1px" }}>
      {/* Sidebar Navigation */}
      <nav
        style={{
          width: "280px",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.92) 100%)",
          borderRight: "1px solid rgba(96,165,250,0.12)",
          padding: "1.5rem 0",
          position: "fixed",
          left: 0,
          top: "80px",
          height: "calc(100vh - 80px)",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "0 1rem 1.5rem" }}>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            Admin Menu
          </p>
        </div>

        <div style={{ display: "grid", gap: "0.5rem", padding: "0 0.5rem" }}>
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.85rem 1rem",
                  margin: "0 0.5rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: isActive ? "#60a5fa" : "rgba(255,255,255,0.72)",
                  background: isActive
                    ? "rgba(96,165,250,0.12)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(96,165,250,0.24)"
                    : "1px solid transparent",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          marginLeft: "280px",
          background: "rgba(5,8,16,0.4)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            padding: "1rem 1.5rem 0",
            background:
              "linear-gradient(180deg, rgba(5,8,16,0.96) 0%, rgba(5,8,16,0.78) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back to previous page"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 1rem",
              borderRadius: "14px",
              border: "1px solid rgba(147,197,253,0.26)",
              background: "rgba(255,255,255,0.06)",
              color: "#f8fbff",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 12px 28px rgba(2,6,23,0.18)",
              transition:
                "transform 0.18s ease, background 0.18s ease, border-color 0.18s ease",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(96,165,250,0.18)",
                border: "1px solid rgba(96,165,250,0.24)",
                fontSize: "0.95rem",
                flexShrink: 0,
              }}
            >
              ←
            </span>
            Back to previous page
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
