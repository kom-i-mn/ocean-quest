"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.playbackRate = 0.5;
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      poster="/images/ocean-quest-hero.png"
      aria-label="Ocean Questが扱う海洋産業と海洋技術の映像"
    >
      <source src="/videos/ocean-quest-hero.mp4" type="video/mp4" />
    </video>
  );
}
