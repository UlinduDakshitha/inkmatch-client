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

          <div
            className="support-contacts"
            aria-label="Support contact details"
          >
            <a href="tel:+94777748300" className="support-link">
              0777 748 300
            </a>
            <a href="mailto:support@inkmatch.lk" className="support-link">
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
    </div>
  );
}
