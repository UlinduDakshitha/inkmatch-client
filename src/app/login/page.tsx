"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./auth.css";
import { getRoleHomePath } from "@/utils/roleRedirect";
import { normalizeRole } from "@/utils/appData";

const ROLE_BY_EMAIL_KEY = "inkmatch.roleByEmail";
const NAME_BY_EMAIL_KEY = "inkmatch.nameByEmail";

function extractNameFromLoginResponse(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const payload = data as Record<string, unknown>;
  const user =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : undefined;

  const candidates = [
    user?.fullName,
    user?.displayName,
    user?.name,
    payload.fullName,
    payload.displayName,
    payload.name,
  ];

  return candidates.find((item): item is string => typeof item === "string");
}

function extractRoleFromLoginResponse(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const payload = data as Record<string, unknown>;
  const user =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : undefined;

  const authorityFromArray = (value: unknown): string | undefined => {
    if (!Array.isArray(value) || value.length === 0) {
      return undefined;
    }
    const first = value[0];
    if (typeof first === "string") {
      return first;
    }
    if (first && typeof first === "object") {
      const obj = first as Record<string, unknown>;
      const candidate = obj.authority ?? obj.role ?? obj.name;
      return typeof candidate === "string" ? candidate : undefined;
    }
    return undefined;
  };

  const candidates = [
    payload.role,
    payload.userRole,
    user?.role,
    user?.userRole,
    user?.userType,
    user?.accountType,
    authorityFromArray(payload.authorities),
    authorityFromArray(user?.authorities),
    authorityFromArray(user?.roles),
  ];

  return candidates.find((item): item is string => typeof item === "string");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      const backendRole = extractRoleFromLoginResponse(data);
      let resolvedRole = normalizeRole(backendRole);

      const roleByEmail = JSON.parse(
        localStorage.getItem(ROLE_BY_EMAIL_KEY) || "{}",
      ) as Record<string, string>;
      const mappedRole = roleByEmail[email.toLowerCase()];
      const normalizedMappedRole = normalizeRole(mappedRole);

      // Fallback to the role chosen at registration if backend role arrives as generic CUSTOMER.
      if (resolvedRole === "CUSTOMER" && normalizedMappedRole !== "CUSTOMER") {
        resolvedRole = normalizedMappedRole;
      }

      const nameByEmail = JSON.parse(
        localStorage.getItem(NAME_BY_EMAIL_KEY) || "{}",
      ) as Record<string, string>;
      const mappedName = nameByEmail[email.toLowerCase()];
      const backendName = extractNameFromLoginResponse(data);
      const resolvedName = backendName || mappedName || email.split("@")[0];

      const loggedInUser = {
        ...(data.user ?? {}),
        name: resolvedName,
        email: data?.user?.email || email,
        role: resolvedRole,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      roleByEmail[email.toLowerCase()] = resolvedRole;
      localStorage.setItem(ROLE_BY_EMAIL_KEY, JSON.stringify(roleByEmail));
      nameByEmail[email.toLowerCase()] = resolvedName;
      localStorage.setItem(NAME_BY_EMAIL_KEY, JSON.stringify(nameByEmail));

      router.push(getRoleHomePath(resolvedRole));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-layout">
      <div className="glass-card auth-card">
        <h1 className="heading-3 text-center mb-6">Welcome Back</h1>
        <p className="text-secondary text-center mb-8">
          Sign in to your InkMatch account
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group pb-4">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary auth-cta-btn full-width"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <span className="auth-cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M17 9h-1V7a4 4 0 00-8 0v2H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2zm-6 6.73V17a1 1 0 002 0v-1.27a2 2 0 10-2 0zM10 9V7a2 2 0 114 0v2h-4z" />
                  </svg>
                </span>
                <span>Sign In</span>
                <span
                  className="auth-cta-icon auth-cta-arrow"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M13.29 5.29a1 1 0 011.42 0l6 6a1 1 0 010 1.42l-6 6a1 1 0 11-1.42-1.42L17.59 13H4a1 1 0 110-2h13.59l-4.3-4.29a1 1 0 010-1.42z" />
                  </svg>
                </span>
              </>
            )}
          </button>
        </form>

        <p className="auth-footer text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gradient hover-underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
