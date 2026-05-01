"use client";

import { useState } from "react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Complaint",
    orderRef: "",
    message: "",
  });
  const [notice, setNotice] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: This can be connected to backend support API later.
    setNotice(
      "Thanks for contacting InkMatch. Your message has been received and our team will get back to you soon.",
    );
    setFormData({
      name: "",
      email: "",
      topic: "Complaint",
      orderRef: "",
      message: "",
    });
  };

  return (
    <div className="page-container container" style={{ paddingTop: "120px" }}>
      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <h1 className="heading-2">
          Contact <span className="text-gradient">Us</span>
        </h1>
        <p className="text-secondary mt-2">
          Need help or want to submit a complaint? Send us the details below.
        </p>
      </div>

      {notice && (
        <div className="glass-card" style={{ marginBottom: "1.25rem" }}>
          <p className="text-secondary">{notice}</p>
        </div>
      )}

      <div className="glass-card" style={{ maxWidth: "760px" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label className="input-label" htmlFor="contact-name">
                Full Name
              </label>
              <input
                id="contact-name"
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="input-label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="input-label" htmlFor="contact-topic">
                Topic
              </label>
              <select
                id="contact-topic"
                className="input-field"
                value={formData.topic}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    topic: e.target.value,
                  }))
                }
              >
                <option value="Complaint">Complaint</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Booking Support">Booking Support</option>
                <option value="Account Help">Account Help</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="input-label" htmlFor="contact-ref">
                Booking / Reference (Optional)
              </label>
              <input
                id="contact-ref"
                className="input-field"
                placeholder="e.g. BK-10234"
                value={formData.orderRef}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    orderRef: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label className="input-label" htmlFor="contact-message">
              Details
            </label>
            <textarea
              id="contact-message"
              className="input-field"
              style={{ minHeight: "150px", resize: "vertical" }}
              placeholder="Describe your issue or complaint in detail"
              value={formData.message}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  message: e.target.value,
                }))
              }
              required
            />
          </div>

          <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.7rem" }}>
            <button type="submit" className="btn-primary">
              Submit Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
