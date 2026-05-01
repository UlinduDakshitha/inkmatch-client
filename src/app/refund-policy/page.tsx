import Link from "next/link";
import "./legal.css";

export const metadata = {
  title: "Refund Policy - InkMatch",
  description:
    "Learn about InkMatch refund and cancellation policies for bookings.",
};

export default function RefundPolicy() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Refund Policy</h1>
          <p className="hero-subtitle">
            We believe in fairness and transparency. Review our refund terms for
            bookings, consultations, and platform services.
          </p>
        </div>
      </section>

      <section className="legal-content container">
        <article>
          <h2>Booking Refunds & Cancellations</h2>
          <p>
            All bookings made through InkMatch are subject to the cancellation
            and refund policy set by the individual artist or studio. Policies
            vary; always review terms before booking.
          </p>
          <ul>
            <li>
              <strong>Full Refund:</strong> Cancellations made 14+ days before
              the appointment typically qualify for a full refund (terms vary by
              artist/studio).
            </li>
            <li>
              <strong>Partial Refund:</strong> Cancellations made 7–14 days
              before the appointment may receive a 50% refund.
            </li>
            <li>
              <strong>No Refund:</strong> Cancellations made less than 7 days
              before the appointment typically forfeit the deposit (no refund).
            </li>
            <li>
              <strong>Rescheduling:</strong> If you reschedule instead of
              cancel, most artists allow rescheduling without penalty if done
              within their notice window.
            </li>
          </ul>
        </article>

        <article>
          <h2>Consultation Fees</h2>
          <p>
            Consultation fees are non-refundable unless the artist or studio
            cancels. If you no-show to a consultation, the fee is forfeited.
          </p>
        </article>

        <article>
          <h2>Disputes & Refund Requests</h2>
          <p>
            If you believe a refund was incorrectly denied or if you have a
            dispute with an artist or studio regarding a refund:
          </p>
          <ol>
            <li>Contact the artist or studio directly to resolve the issue</li>
            <li>
              If unresolved, submit a formal dispute to InkMatch support within
              30 days
            </li>
            <li>Our team will investigate and mediate fairly</li>
            <li>
              We will make a final determination based on the artist's policy
              and evidence
            </li>
          </ol>
        </article>

        <article>
          <h2>Platform Service Refunds</h2>
          <p>
            InkMatch does not currently charge subscription or platform fees. If
            we introduce paid features in the future, refund terms will be
            clearly communicated.
          </p>
        </article>

        <article>
          <h2>No-Show Policy</h2>
          <p>
            If you fail to show up to a confirmed appointment without
            cancellation notice, the full booking fee is non-refundable. We
            recommend setting reminders to avoid unexpected no-shows.
          </p>
        </article>

        <article>
          <h2>Exceptional Circumstances</h2>
          <p>
            In cases of illness, emergency, or exceptional circumstances, you
            may contact InkMatch support to request a review. Each case is
            evaluated individually.
          </p>
        </article>

        <div className="legal-cta">
          <p>
            Questions about a refund?{" "}
            <Link href="/contact-us">Contact our support team</Link>
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
