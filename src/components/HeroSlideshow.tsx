"use client";

import { useEffect, useState } from "react";

type Slide = {
  title: string;
  style: string;
  artist: string;
  location: string;
};

const slides: Slide[] = [
  {
    title: "Neo Traditional",
    style: "Rich color and sharp storytelling",
    artist: "Raya K.",
    location: "Jakarta",
  },
  {
    title: "Fine Line",
    style: "Minimal details with elegant flow",
    artist: "Liam V.",
    location: "Bandung",
  },
  {
    title: "Blackwork",
    style: "Bold contrast and timeless depth",
    artist: "Mika S.",
    location: "Bali",
  },
];

const intervalMs = 3600;

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="slideshow-shell glass-card"
      aria-label="Featured tattoo styles"
    >
      <div
        className="slides-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            className={`slide-card slide-visual-${index + 1}`}
          >
            <div className="slide-image" role="presentation" />
            <div className="slide-meta">
              <p className="slide-chip">{slide.title}</p>
              <h3>{slide.style}</h3>
              <p>
                {slide.artist} • {slide.location}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div
        className="slide-dots"
        role="tablist"
        aria-label="Select featured style"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-label={`Show ${slide.title} slide`}
            aria-selected={activeIndex === index}
            className={`slide-dot ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
