'use client';

export default function AdminPage() {
    return (
        <div className="page-container container" style={{ paddingTop: '120px' }}>
            <h1 className="heading-2">Admin <span className="text-gradient">Dashboard</span></h1>
            <p className="text-secondary mt-2 mb-4">View and manually verify user accounts.</p>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3 className="heading-3 mb-4">Pending Verifications</h3>
                <p className="text-secondary">No users pending verification at this time.</p>
            </div>
        </div>
    );
}
