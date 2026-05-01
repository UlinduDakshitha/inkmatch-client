import Link from "next/link";
import type { ReactNode } from "react";
import "./page.css";
import HeroSlideshow from "@/components/HeroSlideshow";

function SocialIcon({ name, children }: { name: string; children: ReactNode }) {
  return (
    <span className="footer-social" aria-label={name} role="img">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section container">
        <div className="hero-content">
          <h1 className="heading-1">
            Discover Your Perfect <br />
            <span className="text-gradient">Tattoo Artist.</span>
          </h1>
          <p className="hero-subtitle">
            Connect with top-rated artists and studios. Browse portfolios, book
            consultations, and get the ink you&apos;ve always dreamed of.
          </p>
          <div className="hero-actions">
            <Link href="/artists" className="btn-primary">
              Find Artists
            </Link>
            <Link href="/studios" className="btn-secondary">
              Explore Studios
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <HeroSlideshow />
        </div>
      </section>
      <section className="features-section container">
        <h2 className="heading-2 feature-title">Why choose InkMatch?</h2>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <h3>Verified Artists</h3>
            <p>
              Every artist is vetted to ensure top quality and safety for your
              tattoo.
            </p>
          </div>
          <div className="glass-card feature-card">
            <h3>Easy Booking</h3>
            <p>
              Seamlessly schedule consultations and appointments directly
              through our platform.
            </p>
          </div>
          <div className="glass-card feature-card">
            <h3>Stunning Portfolios</h3>
            <p>
              Browse high-resolution portfolios to find the style that perfectly
              matches your vision.
            </p>
          </div>
        </div>
      </section>

      <section
        className="support-section container"
        aria-labelledby="support-title"
      >
        <div className="support-shell">
          <h2 className="heading-2 support-title" id="support-title">
            More <span className="text-gradient">Support</span>
          </h2>
          <p className="support-copy">
            Need help or have questions? Our customer support team is ready to
            assist with bookings, accounts, and any issue you run into.
          </p>

          <div className="support-meta">
            <a href="tel:+94777748300" className="support-contact-pill">
              0777 748 300
            </a>
            <a
              href="mailto:support@inkmatch.lk"
              className="support-contact-pill"
            >
              support@inkmatch.lk
            </a>
          </div>

          <form className="support-form" action="/contact-us" method="get">
            <label htmlFor="support-email" className="sr-only">
              Email
            </label>
            <input
              id="support-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="support-input"
            />
            <button type="submit" className="support-submit">
              Submit
            </button>
          </form>
        </div>
      </section>

      <section className="footer-section" aria-labelledby="footer-title">
        <div className="footer-shell container">
          <div className="footer-grid">
            <div className="footer-brand-block">
              <Link
                href="/"
                className="footer-brand"
                aria-label="InkMatch home"
              >
                <span className="footer-brand-mark" aria-hidden="true">
                  <img src="/brand/inkmatch-mark.svg" alt="" />
                </span>
                <span className="footer-brand-copy">
                  <strong id="footer-title">InkMatch</strong>
                  <span>
                    Book trusted tattoo artists and studios in Sri Lanka
                  </span>
                </span>
              </Link>

              <p className="footer-blurb">
                InkMatch helps you discover verified artists, compare
                portfolios, and book with confidence. Built for customers,
                artists, and studio owners.
              </p>

              <div className="footer-contact-lines" aria-label="Quick contact">
                <a href="tel:+94777748300">0777 748 300</a>
                <a href="mailto:support@inkmatch.lk">support@inkmatch.lk</a>
              </div>

              <div className="footer-socials" aria-label="Social links">
                <SocialIcon name="Facebook">
                  <path d="M14 8.5V7.1c0-.7.5-1.1 1.1-1.1H16V3h-1.4C12.1 3 11 4.2 11 6.1v2.4H9v2.8h2V21h3.1v-9.7h2.3l.4-2.8H14z" />
                </SocialIcon>
                <SocialIcon name="X">
                  <path d="M4 4h3.5l4.7 6.2L17.2 4H20l-6 7.6L20.5 20H17l-5-6.7L6.9 20H4l6.4-8.2L4 4z" />
                </SocialIcon>
                <SocialIcon name="TikTok">
                  <path d="M14.5 4c.7 2.6 2.2 4.3 4.5 4.8v3c-1.7.1-3.2-.3-4.5-1.1V15c0 3-2.3 5-5.3 5S4 17.9 4 15.2c0-3 2.4-5.1 5.7-5.1.4 0 .7 0 1 .1v3c-.3-.1-.6-.1-.9-.1-1.5 0-2.5.9-2.5 2.1s.9 2 2.2 2c1.5 0 2.5-1 2.5-2.6V4h2.5z" />
                </SocialIcon>
                <SocialIcon name="YouTube">
                  <path d="M21.6 7.4c-.2-.9-.9-1.6-1.8-1.8C18.2 5.2 12 5.2 12 5.2s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.6.4-4.6s0-3-.4-4.6zM10 15.2V8.8L15.5 12 10 15.2z" />
                </SocialIcon>
                <SocialIcon name="Instagram">
                  <path d="M7.5 3h9C18.9 3 21 5.1 21 7.5v9c0 2.4-2.1 4.5-4.5 4.5h-9C5.1 21 3 18.9 3 16.5v-9C3 5.1 5.1 3 7.5 3zm0 2C6.2 5 5 6.2 5 7.5v9C5 17.8 6.2 19 7.5 19h9c1.3 0 2.5-1.2 2.5-2.5v-9C19 6.2 17.8 5 16.5 5h-9zM12 7.2A4.8 4.8 0 1 1 12 17a4.8 4.8 0 0 1 0-9.8zm0 2A2.8 2.8 0 1 0 12 15a2.8 2.8 0 0 0 0-5.8zm5.4-.9a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </SocialIcon>
              </div>
            </div>

            <div className="footer-links-column">
              <h3>InkMatch</h3>
              <ul>
                <li>
                  <Link href="/artists">About Us</Link>
                </li>
                
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Help</h3>
              <ul>
                
                <li>
                  <Link href="/artists">Community Guidelines</Link>
                </li>
              
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
                <li>
                  <Link href="/contact-us">FAQs</Link>
                </li>
              </ul>
            </div>

            <div className="footer-contact-column">
              <h3>Contact</h3>
              <p>Mammaskin (Private) Limited</p>
              <p>PV 00237973</p>
              <p>Level 1, 53 Dharmapala Mawatha, Colombo 00300</p>
              <p>9am - 5pm | Monday to Friday</p>
              <p>0777 748 300</p>
              <p>support@inkmatch.lk</p>

              <h3 className="footer-legal-title">Legal</h3>
              <ul>
                <li>
                  <Link href="/contact-us">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/contact-us">Terms and Conditions</Link>
                </li>
                <li>
                  <Link href="/contact-us">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-strip">
          <span>2026 InkMatch. All Rights Reserved.</span>
        </div>
      </section>
    </div>
  );
}
