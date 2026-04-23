"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import slideOne from "@/assets/download (4).jpg";
import slideTwo from "@/assets/download (5).jpg";
import slideThree from "@/assets/download (6).jpg";
import slideFour from "@/assets/download (7).jpg";
import slideFive from "@/assets/download (8).jpg";

type Slide = {
  image: typeof slideOne;
  title: string;
};

const slides: Slide[] = [
  { image: slideOne, title: "Neo Traditional" },
  { image: slideTwo, title: "Fine Line" },
  { image: slideThree, title: "Blackwork" },
  { image: slideFour, title: "Portrait" },
  { image: slideFive, title: "Color Realism" },
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
      <div className="slides-stage">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`slide-panel ${activeIndex === index ? "active" : ""}`}
            aria-hidden={activeIndex !== index}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="(max-width: 900px) 90vw, 44vw"
              className="slide-panel-image"
            />
          </div>
        ))}

        <div className="slide-panel-overlay" />
      </div>
    </div>
  );
}
