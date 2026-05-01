import Link from "next/link";
import "./legal.css";

export const metadata = {
  title: "Privacy Policy - InkMatch",
  description:
    "InkMatch privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">
            Your privacy is important to us. Learn how InkMatch collects,
            protects, and uses your information.
          </p>
        </div>
      </section>

      <section className="legal-content container">
        <article>
          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email, phone number,
              password
            </li>
            <li>
              <strong>Profile Data:</strong> Bio, location, profile image, role
              (artist, studio owner, customer)
            </li>
            <li>
              <strong>Portfolio Data:</strong> Tattoo images, descriptions,
              pricing, availability
            </li>
            <li>
              <strong>Booking Information:</strong> Appointment dates, design
              details, communication records
            </li>
            <li>
              <strong>Device & Usage Data:</strong> IP address, browser type,
              pages visited, interaction logs
            </li>
            <li>
              <strong>Payment Information:</strong> (if applicable) Processed
              securely; we do not store full card details
            </li>
          </ul>
        </article>

        <article>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Facilitate bookings and consultations</li>
            <li>Improve platform features and user experience</li>
            <li>Send notifications, updates, and support messages</li>
            <li>Enforce our terms and detect fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </article>

        <article>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share data in these
            circumstances:
          </p>
          <ul>
            <li>
              <strong>With Other Users:</strong> Your profile is visible to
              others to facilitate bookings
            </li>
            <li>
              <strong>Service Providers:</strong> Third parties who help us
              operate the platform (hosting, analytics, support)
            </li>
            <li>
              <strong>Legal Requirements:</strong> If required by law or to
              protect rights and safety
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of merger or
              acquisition
            </li>
          </ul>
        </article>

        <article>
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data, including encryption, secure servers, and access controls.
            However, no system is 100% secure. We cannot guarantee absolute
            security.
          </p>
        </article>

        <article>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communications</li>
            <li>
              Data portability (where applicable, receive your data in portable
              format)
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at support@inkmatch.lk with
            your request.
          </p>
        </article>

        <article>
          <h2>6. Cookies & Tracking</h2>
          <p>
            InkMatch uses cookies and similar technologies to enhance user
            experience and analyze usage. You can control cookie settings in
            your browser, though disabling cookies may affect functionality.
          </p>
        </article>

        <article>
          <h2>7. Third-Party Links</h2>
          <p>
            InkMatch may link to third-party websites. We are not responsible
            for their privacy practices. Always review their policies before
            sharing information.
          </p>
        </article>

        <article>
          <h2>8. Children's Privacy</h2>
          <p>
            InkMatch is not intended for users under 18. We do not knowingly
            collect information from minors. If we become aware of data from a
            minor, we will delete it immediately.
          </p>
        </article>

        <article>
          <h2>9. Data Retention</h2>
          <p>
            We retain your personal information as long as needed to provide
            services and comply with legal obligations. You can request data
            deletion at any time; however, some data may be retained for legal
            or operational reasons.
          </p>
        </article>

        <article>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy periodically. Changes will be
            posted on this page with an updated date. Continued use of InkMatch
            indicates acceptance of the updated policy.
          </p>
        </article>

        <article>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about our privacy practices,
            please contact:
          </p>
          <p>
            <strong>InkMatch Support</strong>
            <br />
            Email: support@inkmatch.lk
            <br />
            Phone: 0777 748 300
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
