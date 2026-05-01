import Link from "next/link";
import "./community-guidelines.css";

export const metadata = {
  title: "Community Guidelines - InkMatch",
  description:
    "Guidelines for respectful and safe interactions on InkMatch platform.",
};

export default function CommunityGuidelines() {
  return (
    <main className="guidelines-page">
      <section className="guidelines-hero">
        <div className="container">
          <h1>Community Guidelines</h1>
          <p className="hero-subtitle">
            InkMatch is built on trust, respect, and safety. These guidelines
            help everyone have a positive, welcoming experience.
          </p>
        </div>
      </section>

      <section className="guidelines-content container">
        <div className="guidelines-grid">
          <article className="guideline-card">
            <div className="card-icon">✓</div>
            <h3>Be Respectful</h3>
            <p>
              Treat all members with kindness and respect. Value diverse
              opinions, styles, and backgrounds. Harassment, hate speech, or
              discrimination is not tolerated.
            </p>
          </article>

          <article className="guideline-card">
            <div className="card-icon">🎨</div>
            <h3>Authentic Portfolios</h3>
            <p>
              Share genuine work and honest reviews. Artists: represent your
              true skill. Customers: provide constructive feedback. Fake reviews
              or misleading portfolios violate our trust.
            </p>
          </article>

          <article className="guideline-card">
            <div className="card-icon">🔒</div>
            <h3>Safety First</h3>
            <p>
              Never share personal financial information outside the platform.
              Protect your private data. Report suspicious activity immediately.
              We prioritize your safety.
            </p>
          </article>

          <article className="guideline-card">
            <div className="card-icon">💬</div>
            <h3>Professional Communication</h3>
            <p>
              Keep conversations professional and relevant to bookings or
              portfolios. Avoid spam, advertising of competing services, or
              unsolicited messages.
            </p>
          </article>

          <article className="guideline-card">
            <div className="card-icon">✨</div>
            <h3>Quality Over Quantity</h3>
            <p>
              For studios and artists: showcase your best work. For customers:
              give feedback that helps others make informed choices. Thoughtful
              contributions matter most.
            </p>
          </article>

          <article className="guideline-card">
            <div className="card-icon">⚖️</div>
            <h3>Fair Practices</h3>
            <p>
              Honor commitments and respond to booking requests promptly.
              Cancellations should be handled professionally. Disputes will be
              mediated fairly by our team.
            </p>
          </article>
        </div>

        <section className="guidelines-section">
          <h2>Prohibited Behavior</h2>
          <ul className="prohibited-list">
            <li>Harassment, bullying, or threats of any kind</li>
            <li>Hate speech, discrimination, or derogatory language</li>
            <li>Sharing private information without consent</li>
            <li>Spam, phishing, or scam attempts</li>
            <li>Fake profiles or misleading content</li>
            <li>Sexual or inappropriate content</li>
            <li>Promotion of illegal activities</li>
            <li>Attempts to manipulate reviews or ratings</li>
          </ul>
        </section>

        <section className="guidelines-section">
          <h2>For Artists & Studios</h2>
          <ul className="guidelines-list">
            <li>
              Maintain hygiene and safety standards in your studio at all times
            </li>
            <li>
              Be transparent about pricing, availability, and your experience
              level
            </li>
            <li>Respond to consultations and bookings within 24 hours</li>
            <li>
              Honor cancellation policies and communicate any changes promptly
            </li>
            <li>
              Keep your portfolio updated with recent, genuine work samples
            </li>
          </ul>
        </section>

        <section className="guidelines-section">
          <h2>For Customers</h2>
          <ul className="guidelines-list">
            <li>
              Provide clear, detailed information about your tattoo preferences
            </li>
            <li>Be respectful of artists' time during consultations</li>
            <li>Honor your booking commitments or cancel with notice</li>
            <li>
              Leave honest reviews based on your actual experience with the
              service
            </li>
            <li>Communicate any concerns or changes to your design promptly</li>
          </ul>
        </section>

        <section className="guidelines-cta">
          <h2>Violations & Consequences</h2>
          <p>
            Violations of these guidelines may result in warnings, content
            removal, or account suspension. Severe or repeated violations can
            lead to permanent removal from InkMatch.
          </p>
          <p>
            If you witness a violation,{" "}
            <Link href="/contact-us">report it to our team</Link>. We take every
            report seriously and will investigate promptly.
          </p>

          <div className="guidelines-buttons">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/contact-us" className="btn-secondary">
              Report an Issue
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
