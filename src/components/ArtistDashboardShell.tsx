"use client";

import dynamic from "next/dynamic";

const ArtistDashboardClient = dynamic(
  () => import("@/components/ArtistDashboardClient"),
  {
    ssr: false,
    loading: () => (
      <div className="page-container container" style={{ paddingTop: "120px" }}>
        <div className="glass-card">
          <h1 className="heading-3">Loading dashboard...</h1>
          <p className="text-secondary mt-2">
            Preparing your artist dashboard.
          </p>
        </div>
      </div>
    ),
  },
);

export default function ArtistDashboardShell() {
  return <ArtistDashboardClient />;
}
