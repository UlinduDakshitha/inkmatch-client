'use client';

import { useEffect, useState } from 'react';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, pass the authenticated user's ID or let backend determine via token
        fetch('http://localhost:8080/api/bookings')
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="page-container container" style={{ paddingTop: '120px' }}>
            <h1 className="heading-2">My <span className="text-gradient">Bookings</span></h1>
            <p className="text-secondary mt-2 mb-4">View and manage your tattoo appointments.</p>

            {loading ? (
                <div className="glass-card"><div className="skeleton text-skeleton"></div></div>
            ) : bookings.length === 0 ? (
                <div className="empty-state glass">
                    <p>You have no bookings yet. Explore artists to schedule an appointment!</p>
                </div>
            ) : (
                <div className="grid-list" style={{ marginTop: '2rem' }}>
                    {/* Booking Cards would go here */}
                </div>
            )}
        </div>
    );
}
