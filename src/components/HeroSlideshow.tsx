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
    <div className="slideshow-shell" aria-label="Featured tattoo styles">
      <div className="slides-viewport">
        <div
          className="slides-track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <article
              key={slide.title}
              className={`slide-card slide-visual-${index + 1}`}
            >
              <div className="slide-image" role="presentation" />
              <div className="slide-meta">
                <h3>{slide.style}</h3>
                <p>
                  {slide.artist} • {slide.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
