import Link from "next/link";
import "./legal.css";

export const metadata = {
  title: "Terms and Conditions - InkMatch",
  description: "InkMatch terms and conditions of use for all users.",
};

export default function TermsAndConditions() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Terms and Conditions</h1>
          <p className="hero-subtitle">
            Please read these terms carefully before using InkMatch. By
            accessing or using the platform, you agree to be bound by these
            terms.
          </p>
        </div>
      </section>

      <section className="legal-content container">
        <article>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using InkMatch, you agree to comply with these
            Terms and Conditions and all applicable laws. If you do not agree,
            do not use the platform.
          </p>
        </article>

        <article>
          <h2>2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Update your information as needed</li>
            <li>
              Notify us immediately of any unauthorized account access or
              security breach
            </li>
            <li>Not use another person's account</li>
          </ul>
        </article>

        <article>
          <h2>3. User Conduct</h2>
          <p>You agree not to use InkMatch to:</p>
          <ul>
            <li>Harass, threaten, or discriminate against others</li>
            <li>Post false, defamatory, or misleading content</li>
            <li>Share private information without consent</li>
            <li>Engage in spam, phishing, or fraud</li>
            <li>Violate any laws or third-party rights</li>
            <li>Disrupt the platform or interfere with its operation</li>
          </ul>
        </article>

        <article>
          <h2>4. Booking & Transactions</h2>
          <p>
            All bookings are between you and the artist/studio. InkMatch
            facilitates connections but is not a party to service agreements.
            You are responsible for:
          </p>
          <ul>
            <li>Reviewing artist profiles and portfolios before booking</li>
            <li>
              Confirming details (date, time, cost, design) directly with the
              artist
            </li>
            <li>Honoring cancellation policies and booking commitments</li>
            <li>Arranging payment as agreed with the artist</li>
          </ul>
        </article>

        <article>
          <h2>5. Limitation of Liability</h2>
          <p>
            InkMatch provides the platform "as-is." To the fullest extent
            permitted by law, we are not liable for:
          </p>
          <ul>
            <li>Quality or results of tattoo services</li>
            <li>Disputes between users</li>
            <li>Data loss, security breaches, or service interruptions</li>
            <li>Indirect, incidental, or consequential damages</li>
          </ul>
        </article>

        <article>
          <h2>6. Intellectual Property</h2>
          <p>
            All content on InkMatch (logos, designs, text) is protected by
            copyright and intellectual property laws. You may not reproduce,
            distribute, or modify content without permission.
          </p>
        </article>

        <article>
          <h2>7. Suspension & Termination</h2>
          <p>
            InkMatch reserves the right to suspend or terminate accounts that
            violate these terms. Reasons include:
          </p>
          <ul>
            <li>Violation of community guidelines</li>
            <li>Fraudulent or illegal activity</li>
            <li>Repeated violations or warnings</li>
            <li>At our sole discretion</li>
          </ul>
        </article>

        <article>
          <h2>8. Modification of Terms</h2>
          <p>
            We may update these terms at any time. Continued use of InkMatch
            after changes indicates your acceptance of new terms.
          </p>
        </article>

        <article>
          <h2>9. Governing Law</h2>
          <p>
            These terms are governed by the laws of Sri Lanka. Any disputes
            shall be resolved in accordance with Sri Lankan law.
          </p>
        </article>

        <article>
          <h2>10. Contact Information</h2>
          <p>
            For questions or concerns regarding these terms, please{" "}
            <Link href="/contact-us">contact us</Link>.
          </p>
        </article>

        <div className="legal-cta">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
