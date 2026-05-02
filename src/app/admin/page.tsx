"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const data = [
    { name: "Users", value: stats.users },
    { name: "Artists", value: stats.artists },
    { name: "Bookings", value: stats.bookings },
    { name: "Pending", value: stats.pendingArtists },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Users" value={stats.users} />
        <Card title="Artists" value={stats.artists} />
        <Card title="Bookings" value={stats.bookings} />
        <Card title="Pending" value={stats.pendingArtists} />
      </div>

      {/* CHART */}
      <div className="h-80 bg-white/10 p-4 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white/10 p-4 rounded-xl">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
