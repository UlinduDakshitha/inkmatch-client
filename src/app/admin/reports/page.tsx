"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";

type ReportType =
  | "user_engagement"
  | "financial"
  | "system_health"
  | "user_behavior";

interface ReportOption {
  value: ReportType;
  label: string;
  description: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("user_engagement");
  const [dateRange, setDateRange] = useState("30days");

  const reportTypes: ReportOption[] = [
    {
      value: "user_engagement",
      label: "User Engagement Report",
      description: "Track user activity, login trends, and session analytics",
    },
    {
      value: "financial",
      label: "Financial Report",
      description: "Revenue, transactions, refunds, and platform fees",
    },
    {
      value: "system_health",
      label: "System Health Report",
      description: "API performance, uptime, error rates, and server metrics",
    },
    {
      value: "user_behavior",
      label: "User Behavior Report",
      description: "User patterns, booking preferences, and conversion funnels",
    },
  ];

  const reportData: Record<ReportType, any> = {
    user_engagement: {
      metrics: [
        { label: "Total Active Users", value: "287", change: "+12%" },
        { label: "Avg Session Duration", value: "12m 34s", change: "-2%" },
        { label: "Daily Active Users", value: "156", change: "+8%" },
        { label: "New Signups", value: "42", change: "+15%" },
      ],
      details: [
        "Peak activity hours: 7-9 PM",
        "Most popular feature: Artist Portfolios",
        "Avg pages per session: 4.2",
        "Bounce rate: 23.4%",
      ],
    },
    financial: {
      metrics: [
        { label: "Total Revenue", value: "$12,450", change: "+18%" },
        { label: "Avg Transaction", value: "$95.30", change: "+3%" },
        { label: "Refunds Issued", value: "5", change: "-20%" },
        { label: "Platform Fees", value: "$1,245", change: "+18%" },
      ],
      details: [
        "Top earning service: Artist Consultations",
        "Payment methods: 80% card, 20% other",
        "Failed transactions: 2.1%",
        "Pending settlements: $3,200",
      ],
    },
    system_health: {
      metrics: [
        { label: "System Uptime", value: "99.87%", change: "↑ Stable" },
        { label: "API Response Time", value: "234ms", change: "-15%" },
        { label: "Error Rate", value: "0.23%", change: "↓ Improving" },
        { label: "Database Load", value: "42%", change: "+5%" },
      ],
      details: [
        "Last incident: 2 days ago (5 min downtime)",
        "Avg CPU usage: 38%",
        "Avg memory usage: 56%",
        "Cache hit ratio: 87%",
      ],
    },
    user_behavior: {
      metrics: [
        { label: "Booking Conversion", value: "23.4%", change: "+2%" },
        { label: "Repeat Users", value: "64%", change: "+8%" },
        { label: "Avg Booking Value", value: "$95.50", change: "-5%" },
        { label: "Customer Retention", value: "78%", change: "+3%" },
      ],
      details: [
        "Most searched style: Tribal",
        "Avg response time (artists): 4.2 hours",
        "Booking abandonment rate: 12%",
        "Customer satisfaction: 4.6/5",
      ],
    },
  };

  const currentData = reportData[selectedReport];

  return (
    <AdminShell>
      <div style={{ paddingTop: "120px" }}>
        {/* Header */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            margin: "1.5rem",
            marginBottom: "0",
            border: "1px solid rgba(96,165,250,0.24)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 42%, rgba(88,28,135,0.20) 100%)",
          }}
        >
          <h1 className="heading-2" style={{ marginBottom: "0.5rem" }}>
            📄 System Reports
          </h1>
          <p className="text-secondary">
            Generate and view comprehensive system reports on engagement,
            finances, health, and user behavior.
          </p>
        </div>

        {/* Date Range Selector */}
        <div style={{ padding: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.75rem",
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "white",
              fontSize: "0.95rem",
            }}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Report Selection */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {reportTypes.map((report) => (
            <button
              key={report.value}
              onClick={() => setSelectedReport(report.value)}
              style={{
                padding: "1.25rem",
                background:
                  selectedReport === report.value
                    ? "rgba(96,165,250,0.15)"
                    : "rgba(255,255,255,0.02)",
                border:
                  selectedReport === report.value
                    ? "2px solid #60a5fa"
                    : "1px solid rgba(96,165,250,0.12)",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  color: selectedReport === report.value ? "#60a5fa" : "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {report.label}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.9rem",
                }}
              >
                {report.description}
              </p>
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 className="heading-3">
                {reportTypes.find((r) => r.value === selectedReport)?.label}
              </h2>
              <button
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "rgba(96,165,250,0.15)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  color: "#60a5fa",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Download PDF
              </button>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {currentData.metrics.map((metric: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    background: "rgba(96,165,250,0.05)",
                    borderRadius: "10px",
                    border: "1px solid rgba(96,165,250,0.1)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.62)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {metric.label}
                  </p>
                  <p
                    style={{
                      margin: "0.5rem 0 0",
                      color: "#60a5fa",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {metric.value}
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      color: metric.change.includes("+")
                        ? "#10b981"
                        : metric.change.includes("↑")
                          ? "#10b981"
                          : "#ef4444",
                      fontSize: "0.85rem",
                    }}
                  >
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div
              style={{
                borderTop: "1px solid rgba(96,165,250,0.12)",
                paddingTop: "1.5rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Key Insights
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                {currentData.details.map((detail: string, idx: number) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "6px",
                        height: "6px",
                        background: "#60a5fa",
                        borderRadius: "50%",
                      }}
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div
          style={{
            padding: "0 1.5rem 1.5rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {["PDF", "CSV", "Excel"].map((format) => (
            <button
              key={format}
              style={{
                padding: "0.6rem 1.2rem",
                background: "rgba(96,165,250,0.1)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "#60a5fa",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Export as {format}
            </button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
