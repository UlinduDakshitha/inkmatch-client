import Link from "next/link";
import "./page.css";
import HeroSlideshow from "@/components/HeroSlideshow";

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
                <span className="footer-social">f</span>
                <span className="footer-social">x</span>
                <span className="footer-social">t</span>
                <span className="footer-social">▶</span>
                <span className="footer-social">◎</span>
              </div>
            </div>

            <div className="footer-links-column">
              <h3>InkMatch</h3>
              <ul>
                <li>
                  <Link href="/artists">How InkMatch Works</Link>
                </li>
                <li>
                  <Link href="/artists">About Us</Link>
                </li>
                <li>
                  <Link href="/register">How Do I Sell?</Link>
                </li>
                <li>
                  <Link href="/artists">How Do I Buy?</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Help</h3>
              <ul>
                <li>
                  <Link href="/studios">Listing Rules</Link>
                </li>
                <li>
                  <Link href="/artists">Community Guidelines</Link>
                </li>
                <li>
                  <Link href="/studios">Shipping Guide</Link>
                </li>
                <li>
                  <Link href="/contact-us">Listing of Prohibited Content</Link>
                </li>
                <li>
                  <Link href="/contact-us">Packaging and Delivery</Link>
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
