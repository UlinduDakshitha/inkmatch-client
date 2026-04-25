"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../login/auth.css";
import { normalizeRole } from "@/utils/appData";

const ROLE_BY_EMAIL_KEY = "inkmatch.roleByEmail";
const NAME_BY_EMAIL_KEY = "inkmatch.nameByEmail";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: formData.fullName,
          role: formData.role.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const roleByEmail = JSON.parse(
        localStorage.getItem(ROLE_BY_EMAIL_KEY) || "{}",
      ) as Record<string, string>;
      roleByEmail[formData.email.toLowerCase()] = normalizeRole(formData.role);
      localStorage.setItem(ROLE_BY_EMAIL_KEY, JSON.stringify(roleByEmail));

      const nameByEmail = JSON.parse(
        localStorage.getItem(NAME_BY_EMAIL_KEY) || "{}",
      ) as Record<string, string>;
      nameByEmail[formData.email.toLowerCase()] = formData.fullName.trim();
      localStorage.setItem(NAME_BY_EMAIL_KEY, JSON.stringify(nameByEmail));

      setSuccess("Registration successful. Please log in.");
      router.push("/login");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-layout">
      <div className="glass-card auth-card">
        <h1 className="heading-3 text-center mb-6">Create Account</h1>
        <p className="text-secondary text-center mb-8">
          Join the InkMatch community
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group pb-2">
            <label className="input-label" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="input-field"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group pb-2">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group pb-2">
            <label className="input-label" htmlFor="role">
              I am a...
            </label>
            <select
              id="role"
              className="input-field"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ARTIST">Tattoo Artist</option>
              <option value="STUDIO_OWNER">Studio Owner</option>
            </select>
          </div>

          <div className="form-group pb-4">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-cta-btn full-width"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-gradient hover-underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
