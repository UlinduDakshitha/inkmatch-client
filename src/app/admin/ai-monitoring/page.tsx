"use client";

import { useMemo } from "react";
import AdminShell from "@/components/AdminShell";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function AIMonitoringPage() {
  const aiMetrics = useMemo(
    () => ({
      totalRequests: 2847,
      successRate: 98.4,
      avgLatency: 345,
      costThisMonth: 2450,
      tokensUsed: 1240000,
      costPerRequest: 0.86,
      rateLimitHits: 12,
      errorRate: 1.6,
    }),
    [],
  );

  const requestTrendData = [
    { time: "00:00", requests: 45, errors: 2, cost: 38 },
    { time: "04:00", requests: 28, errors: 1, cost: 24 },
    { time: "08:00", requests: 125, errors: 3, cost: 107 },
    { time: "12:00", requests: 342, errors: 8, cost: 294 },
    { time: "16:00", requests: 428, errors: 12, cost: 368 },
    { time: "20:00", requests: 512, errors: 10, cost: 440 },
    { time: "24:00", requests: 367, errors: 6, cost: 315 },
  ];

  const modelUsageData = [
    { model: "GPT-4", usage: 45, cost: 892 },
    { model: "GPT-3.5", usage: 35, cost: 687 },
    { model: "Embeddings", usage: 15, cost: 128 },
    { model: "Claude", usage: 5, cost: 743 },
  ];

  const costProjectionData = [
    { week: "Week 1", projected: 600, actual: 587 },
    { week: "Week 2", projected: 620, actual: 612 },
    { week: "Week 3", projected: 640, actual: 651 },
    { week: "Week 4", projected: 660, actual: 600 },
    { week: "Week 5", projected: 680, actual: null },
  ];

  const usageByFeature = [
    {
      feature: "Chatbot",
      requests: 1240,
      costPercent: 43.5,
      usage: "High",
    },
    {
      feature: "Search Enhancement",
      requests: 856,
      costPercent: 30.2,
      usage: "High",
    },
    {
      feature: "Content Moderation",
      requests: 512,
      costPercent: 18.1,
      usage: "Medium",
    },
    {
      feature: "Artist Recommendations",
      requests: 239,
      costPercent: 8.2,
      usage: "Low",
    },
  ];

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
            🤖 AI Usage Monitoring
          </h1>
          <p className="text-secondary">
            Monitor AI model usage, costs, and performance metrics.
          </p>
        </div>

        {/* Key Metrics */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              title: "Total Requests",
              value: aiMetrics.totalRequests.toLocaleString(),
              unit: "this month",
              color: "#60a5fa",
              icon: "📊",
            },
            {
              title: "Success Rate",
              value: `${aiMetrics.successRate}%`,
              unit: "healthy",
              color: "#10b981",
              icon: "✓",
            },
            {
              title: "Avg Latency",
              value: `${aiMetrics.avgLatency}ms`,
              unit: "response time",
              color: "#f59e0b",
              icon: "⚡",
            },
            {
              title: "Cost This Month",
              value: `$${aiMetrics.costThisMonth}`,
              unit: "spent",
              color: "#ec4899",
              icon: "💰",
            },
            {
              title: "Tokens Used",
              value: `${(aiMetrics.tokensUsed / 1000000).toFixed(2)}M`,
              unit: "total",
              color: "#c084fc",
              icon: "🔤",
            },
            {
              title: "Error Rate",
              value: `${aiMetrics.errorRate}%`,
              unit: "failures",
              color: "#ef4444",
              icon: "⚠️",
            },
          ].map((metric) => (
            <div
              key={metric.title}
              className="glass-card"
              style={{
                padding: "1rem",
                border: `1px solid ${metric.color}30`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{metric.icon}</span>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "0.85rem",
                  }}
                >
                  {metric.title}
                </p>
              </div>
              <p
                style={{
                  margin: "0",
                  color: metric.color,
                  fontSize: "1.65rem",
                  fontWeight: 800,
                }}
              >
                {metric.value}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                }}
              >
                {metric.unit}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Request Trend */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              Daily Request Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={requestTrendData}>
                <defs>
                  <linearGradient
                    id="colorRequests"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#60a5fa"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Usage */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              Model Usage Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelUsageData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" dataKey="model" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="usage" fill="#60a5fa" name="Usage %" />
                <Bar dataKey="cost" fill="#f59e0b" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Projection */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1rem" }}>
              Cost Projection vs Actual
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costProjectionData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" dataKey="week" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  name="Projected"
                  dot={{ fill: "#60a5fa" }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Actual"
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usage by Feature */}
        <div style={{ padding: "1.5rem" }}>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              border: "1px solid rgba(96,165,250,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3 className="heading-4" style={{ marginBottom: "1.5rem" }}>
              AI Usage by Feature
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {usageByFeature.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    background: "rgba(96,165,250,0.05)",
                    borderRadius: "10px",
                    border: "1px solid rgba(96,165,250,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {feature.feature}
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          color: "rgba(255,255,255,0.55)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {feature.requests} requests • {feature.costPercent}% of
                        cost
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "0.35rem 0.75rem",
                        background:
                          feature.usage === "High"
                            ? "rgba(239,68,68,0.15)"
                            : feature.usage === "Medium"
                              ? "rgba(245,158,11,0.15)"
                              : "rgba(16,185,129,0.15)",
                        color:
                          feature.usage === "High"
                            ? "#ef4444"
                            : feature.usage === "Medium"
                              ? "#f59e0b"
                              : "#10b981",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {feature.usage}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      background: "rgba(96,165,250,0.2)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${feature.costPercent}%`,
                        background: "#60a5fa",
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {[
            {
              title: "Rate Limit Warning",
              message:
                "12 rate limit hits detected this week. Monitor closely.",
              color: "#f59e0b",
              icon: "⚠️",
            },
            {
              title: "Cost Threshold",
              message: "Approaching monthly budget. $2,450 / $3,000 allocated.",
              color: "#ec4899",
              icon: "💰",
            },
            {
              title: "Error Spike",
              message: "Error rate elevated to 1.6%. Check API status.",
              color: "#ef4444",
              icon: "🔴",
            },
          ].map((alert) => (
            <div
              key={alert.title}
              className="glass-card"
              style={{
                padding: "1rem",
                border: `1px solid ${alert.color}30`,
                background: `${alert.color}08`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{alert.icon}</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: alert.color,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {alert.title}
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
