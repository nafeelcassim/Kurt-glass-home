"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { fonts } from "@/lib/fonts";

// Register useGSAP along with other plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Poster paints as the LCP element while the video streams in (or stays, for
// reduced-motion / data-saver users). Poster is the video's first frame.
const HERO_VIDEO_SRC =
  "https://qjpz0te97ckckvfq.public.blob.vercel-storage.com/static-files/hero-no-logo.mp4";
const HERO_POSTER_SRC = "/hero-poster-v4.jpg";

export function Hero() {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Only fetch/autoplay the heavy background video once past hydration, and only
  // when the user hasn't asked to reduce motion or save data. The poster carries
  // first paint; the multi-MB download never competes with LCP.
  const [enableVideo, setEnableVideo] = useState(false);
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    if (!prefersReducedMotion && !saveData) {
      setEnableVideo(true);
    }
  }, []);

  useGSAP(
    () => {
      // Initial animation timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Tagline image fade in and scale up
      tl.fromTo(
        taglineRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      );

      // Scroll indicator fade in
      tl.fromTo(
        scrollIndicatorRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );

      // Continuous bounce for scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5,
      });

      // Parallax effect on video
      gsap.to(videoRef.current, {
        y: 150,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Text fade out on scroll
      gsap.to(titleRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef },
  ); // Passing the scope directly into the config object

  // Split text into individual characters for each line
  const renderChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ perspective: "1000px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Warm up the video origin before the source is attached (React 19 hoists this to <head>) */}
      <link
        rel="preconnect"
        href="https://qjpz0te97ckckvfq.public.blob.vercel-storage.com"
      />

      {/* Video Background — poster carries first paint; source is attached client-side only */}
      <video
        ref={videoRef}
        autoPlay={enableVideo}
        muted
        loop
        playsInline
        preload="none"
        poster={HERO_POSTER_SRC}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {enableVideo && <source src={HERO_VIDEO_SRC} type="video/mp4" />}
      </video>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div ref={titleRef} className="flex flex-col items-center">
          {/* Tagline image */}
          <div ref={taglineRef}>
            <Image
              src="/wording.png"
              alt="glas trifft design."
              width={1024}
              height={900}
              className="w-32 sm:w-40 md:w-52 lg:w-64 xl:w-72 h-auto invert opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className={`${fonts.xs} uppercase text-white/60`}>
          {t("scrollIndicator")}
        </span>
        <ChevronDown className="w-5 h-5 text-white/60" />
      </div>
    </section>
  );
}
