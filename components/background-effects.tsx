import Image from "next/image";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Enhanced Aurora gradient orbs - MUCH more vibrant and visible */}
      {/* Top section glows - intense */}
      <div className="absolute -top-24 left-1/4 w-[700px] h-[700px] bg-cyan-500/40 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[120px] animate-pulse-slower" />

      {/* Right side glows - intense */}
      <div className="absolute top-1/4 -right-32 w-[800px] h-[800px] bg-purple-500/35 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-400/30 rounded-full blur-[100px] animate-pulse-slower" />

      {/* Center area glows - very prominent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-cyan-400/25 rounded-full blur-[140px] animate-pulse-slow" />

      {/* Bottom section glows - intense */}
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-teal-500/30 rounded-full blur-3xl animate-pulse-slower" />
      <div className="absolute -bottom-32 right-1/3 w-[750px] h-[750px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse-slow" />

      {/* Left side accent glows - intense */}
      <div className="absolute top-2/3 -left-32 w-[650px] h-[650px] bg-indigo-500/30 rounded-full blur-3xl animate-pulse-slower" />

      {/* Additional scattered glows for more depth - more visible */}
      <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/2 w-[550px] h-[550px] bg-emerald-500/25 rounded-full blur-[110px] animate-pulse-slower" />

      {/* Decorative line overlays */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-screen">
        <Image
          src="/line-1.svg"
          alt=""
          width={1920}
          height={1080}
          className="absolute top-20 left-0 w-full opacity-40"
        />
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 mix-blend-screen">
        <Image
          src="/line-2.png"
          alt=""
          width={800}
          height={600}
          className="object-contain"
        />
      </div>

      {/* 3D Lines overlay */}
      <div className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none">
        <Image
          src="/3d-lines.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Starry effect */}
      <div className="absolute inset-0 bg-stars opacity-30" />

      {/* Radial gradient flares */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />

      {/* Subtle gradient overlay for depth - much lighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Very subtle vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,black_100%)] opacity-30" />
    </div>
  );
}
