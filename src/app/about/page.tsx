import Link from "next/link";
import "./about.css";

export const metadata = {
  title: "About Us - InkMatch",
  description:
    "Learn about InkMatch: our mission, values, and the team behind the platform.",
};

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner container">
          <div className="about-hero-brand">
            <img
              src="/brand/inkmatch-mark.svg"
              alt="InkMatch"
              className="about-mark"
            />
            <h1>InkMatch</h1>
            <p className="about-sub">
              Book trusted tattoo artists and studios in Sri Lanka
            </p>
          </div>

          <div className="about-hero-copy">
            <h2>We make booking tattoos simple & safe</h2>
            <p>
              InkMatch helps customers discover verified artists, compare
              portfolios, and book with confidence. We partner with studios to
              raise standards across safety, hygiene and artistic quality.
            </p>

            <div className="about-cta-row">
              <Link href="/artists" className="btn-primary">
                Browse Artists
              </Link>
              <Link href="/contact-us" className="btn-secondary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values container">
        <h3>Our Mission</h3>
        <p>
          To connect people with talented, verified tattoo artists and trusted
          studios — helping everyone get the tattoo they want, safely.
        </p>

        <div className="values-grid">
          <div className="glass-card">
            <h4>Trust</h4>
            <p>Verified profiles, transparent reviews, and studio checks.</p>
          </div>
          <div className="glass-card">
            <h4>Quality</h4>
            <p>
              Curated portfolios to help you find the right style and skill.
            </p>
          </div>
          <div className="glass-card">
            <h4>Safety</h4>
            <p>Hygiene guidelines and best-practice checks for studios.</p>
          </div>
        </div>
      </section>

      <section className="about-contact container">
        <div className="contact-shell">
          <h3>Get in touch</h3>
          <p>
            Have a question about bookings, partnerships, or safety? Reach out
            to our team.
          </p>
          <a href="mailto:support@inkmatch.lk" className="contact-pill">
            support@inkmatch.lk
          </a>
          <a href="tel:+94777748300" className="contact-pill muted">
            0777 748 300
          </a>
        </div>
      </section>
    </main>
  );
}
