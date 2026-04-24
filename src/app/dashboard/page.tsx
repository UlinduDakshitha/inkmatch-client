"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoleHomePath } from "@/utils/roleRedirect";
import UserProfileBanner from "@/components/UserProfileBanner";
import {
  type AppUser,
  getCurrentUser,
  getCustomerProfileByOwner,
  normalizeRole,
  upsertCustomerProfile,
  type CustomerProfile,
} from "@/utils/appData";

export default function Dashboard() {
  const router = useRouter();
  const [user] = useState<AppUser | null>(() => {
    return getCurrentUser();
  });
  const role = normalizeRole(user?.role);
  const [notice, setNotice] = useState("");
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(() => {
      if (role !== "CUSTOMER" || !user?.email) {
        return null;
      }

      return (
        getCustomerProfileByOwner(user.email) ?? {
          id: `local-customer-${encodeURIComponent(user.email)}`,
          ownerEmail: user.email,
          ownerName: user.name || "Customer",
          phone: "",
          city: "",
          bio: "",
        }
      );
    });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const roleHomePath = getRoleHomePath(user?.role);
    if (roleHomePath !== "/dashboard") {
      router.replace(roleHomePath);
    }
  }, [router, user?.role]);

  const saveCustomerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerProfile) {
      return;
    }

    upsertCustomerProfile(customerProfile);

    const latestUser = getCurrentUser();
    if (latestUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...latestUser, name: customerProfile.ownerName }),
      );
    }

    setNotice("Customer profile saved successfully.");
  };

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <UserProfileBanner />
      <h1 className="heading-2">
        Welcome Back,
        <span className="text-gradient"> {user?.name ?? "Customer"}</span>
      </h1>

      <div className="glass-card mt-4" style={{ marginTop: "2rem" }}>
        <h2 className="heading-3">Your Activity</h2>
        <p className="text-secondary mt-2">
          Manage your bookings, consultations, and favorites from here.
        </p>

        {notice && (
          <div className="glass" style={{ marginTop: "1rem", padding: "1rem" }}>
            <p className="text-secondary">{notice}</p>
          </div>
        )}

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

        {role === "CUSTOMER" && customerProfile && (
          <form onSubmit={saveCustomerProfile} style={{ marginTop: "2rem" }}>
            <h3 className="heading-3">My Profile</h3>
            <p className="text-secondary mt-2">
              Update your profile details before making bookings.
            </p>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <input
                className="input-field"
                placeholder="Full Name"
                value={customerProfile.ownerName}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    ownerName: e.target.value,
                  })
                }
                required
              />
              <input
                className="input-field"
                placeholder="Phone Number"
                value={customerProfile.phone}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    phone: e.target.value,
                  })
                }
              />
              <input
                className="input-field"
                placeholder="City"
                value={customerProfile.city}
                onChange={(e) =>
                  setCustomerProfile({
                    ...customerProfile,
                    city: e.target.value,
                  })
                }
              />
            </div>
            <textarea
              className="input-field"
              style={{
                marginTop: "1rem",
                minHeight: "100px",
                resize: "vertical",
              }}
              placeholder="About your tattoo idea or style preferences"
              value={customerProfile.bio}
              onChange={(e) =>
                setCustomerProfile({
                  ...customerProfile,
                  bio: e.target.value,
                })
              }
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Save Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
