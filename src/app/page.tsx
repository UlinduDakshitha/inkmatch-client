import Link from "next/link";
import "./page.css";

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
          <div className="glass-card visual-card top-card">
            <div className="skeleton img-skeleton"></div>
            <div className="skeleton text-skeleton"></div>
          </div>
          <div className="glass-card visual-card bottom-card">
            <div className="skeleton img-skeleton"></div>
            <div className="skeleton text-skeleton short"></div>
          </div>
          <div className="glow-orb"></div>
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
    </div>
  );
}
