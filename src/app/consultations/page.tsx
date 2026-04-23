'use client';

import { useEffect, useState } from 'react';

export default function ConsultationsPage() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/consultations')
            .then(res => res.json())
            .then(data => {
                setConsultations(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="page-container container" style={{ paddingTop: '120px' }}>
            <h1 className="heading-2">My <span className="text-gradient">Consultations</span></h1>
            <p className="text-secondary mt-2 mb-4">Track your discussion sessions with artists.</p>

            {loading ? (
                <div className="glass-card"><div className="skeleton text-skeleton"></div></div>
            ) : consultations.length === 0 ? (
                <div className="empty-state glass">
                    <p>You have no active consultations.</p>
                </div>
            ) : (
                <div className="grid-list" style={{ marginTop: '2rem' }}>
                    {/* Consultation Cards here */}
                </div>
            )}
        </div>
    );
}
