"use client";

import { useEffect, useState } from "react";
import {
  getBookingsForCustomer,
  getCurrentUser,
  normalizeRole,
  type Booking,
} from "@/utils/appData";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    const role = normalizeRole(user?.role);

    if (!user?.email) {
      setNotice("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    if (role !== "CUSTOMER") {
      setNotice("This page shows customer bookings only.");
      setLoading(false);
      return;
    }

    setBookings(getBookingsForCustomer(user.email));
    setLoading(false);
  }, []);

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <h1 className="heading-2">
        My <span className="text-gradient">Bookings</span>
      </h1>
      <p className="text-secondary mt-2 mb-4">
        View and manage your tattoo appointments.
      </p>

      {notice && (
        <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
          <p className="text-secondary">{notice}</p>
        </div>
      )}

      {loading ? (
        <div className="glass-card">
          <div className="skeleton text-skeleton"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state glass">
          <p>
            You have no bookings yet. Explore artists to schedule an
            appointment!
          </p>
        </div>
      ) : (
        <div className="grid-list" style={{ marginTop: "2rem" }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card item-card">
              <h3 className="item-title">{booking.targetName}</h3>
              <p className="item-subtitle text-secondary mt-2">
                Type: {booking.targetType === "ARTIST" ? "Artist" : "Studio"}
              </p>
              <p className="item-subtitle text-secondary mt-2">
                Date: {booking.appointmentDate || "Not set"}
              </p>
              <p className="item-subtitle text-secondary mt-2">
                Status: {booking.status}
              </p>
              {booking.notes && (
                <p className="item-subtitle text-secondary mt-2">
                  Note: {booking.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
