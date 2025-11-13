"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroSection() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-4">
      {/* Ethereum logo with enhanced glow effects */}
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Multiple layered glows */}
        <div className={`absolute inset-0 bg-cyan-400/30 blur-3xl rounded-full transition-all duration-700 ${isHovering ? 'scale-150 opacity-100' : 'scale-100 opacity-60'}`} />
        <div className={`absolute inset-0 bg-blue-500/20 blur-2xl rounded-full transition-all duration-500 ${isHovering ? 'scale-125 opacity-80' : 'scale-100 opacity-40'}`} />
        <div className={`absolute inset-0 bg-purple-500/10 blur-xl rounded-full transition-all duration-300 ${isHovering ? 'scale-110 opacity-70' : 'scale-100 opacity-30'}`} />

        {/* Icon container - no background, just the icon with effects */}
        <div className="relative p-2">
          <Image
            src="/eth.png"
            alt="Ethereum"
            width={80}
            height={80}
            className={`relative z-10 transition-all duration-500 ${isHovering ? 'scale-110 brightness-125 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'scale-100 brightness-100'}`}
            priority
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent leading-tight">
        The Trustless Manifesto
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-zinc-400 text-center max-w-2xl px-4 leading-snug">
        Every system begins with good intentions.{" "}
        <span className="text-white font-medium">Choose verification over blind trust.</span>
      </p>
    </div>
  );
}
