"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardUser = {
  name?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user] = useState<DashboardUser | null>(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData) as DashboardUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.push("/login");
    }
  }, [router, user]);

  if (!user) return null;

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        Welcome Back, <span className="text-gradient">{user.name}</span>
      </h1>

      <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Your Activity</h2>
        <p className="text-secondary mt-2">
          Manage your bookings, consultations, and favorites from here.
        </p>

        {/* Placeholder for real dashboard widgets */}
        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
          <div className="glass-card">
            <h3>Upcoming Bookings</h3>
            <p className="text-secondary mt-2">0 scheduled</p>
          </div>
          <div className="glass-card">
            <h3>Saved Artists</h3>
            <p className="text-secondary mt-2">0 liked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
