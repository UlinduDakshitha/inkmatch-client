"use client";

type CustomerLoginRequiredModalProps = {
  open: boolean;
  onClose: () => void;
  onGoLogin: () => void;
};

export default function CustomerLoginRequiredModal({
  open,
  onClose,
  onGoLogin,
}: CustomerLoginRequiredModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Customer login required"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(8, 8, 12, 0.68)",
        backdropFilter: "blur(3px)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "min(460px, 100%)",
          borderRadius: "18px",
          padding: "1.35rem",
          border: "1px solid var(--glass-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-secondary"
          style={{
            margin: 0,
            fontSize: "0.74rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Booking Access
        </p>
        <h3 className="heading-3" style={{ margin: "0.45rem 0 0" }}>
          Login As Customer
        </h3>
        <p className="text-secondary" style={{ marginTop: "0.8rem" }}>
          To continue with bookings, please log in using a customer account.
        </p>
        <div
          style={{
            marginTop: "1.1rem",
            display: "flex",
            gap: "0.65rem",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onGoLogin}>
            Go To Login
          </button>
        </div>
      </div>
    </div>
  );
}
