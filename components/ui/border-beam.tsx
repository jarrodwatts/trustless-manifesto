"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  size?: number;
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  duration = 4,
  colorFrom = "#06b6d4",
  colorTo = "#d946ef",
  size = 100,
  borderWidth = 2,
}: BorderBeamProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = `border-beam-gradient-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!svgRef.current) return;

    const updatePerimeter = () => {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      // Calculate perimeter: 2 * (width + height) - 8 * border-radius (for rounded corners)
      // Approximate for rounded rectangle: perimeter ≈ 2*(w+h) - 0.8584*r (where r is corner radius)
      const borderRadius = 12; // Match rounded-xl
      const perimeter = 2 * (rect.width + rect.height) - 0.8584 * borderRadius * 8;
      
      svg.style.setProperty("--perimeter", `${perimeter}px`);
    };

    updatePerimeter();
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updatePerimeter);
    resizeObserver.observe(svgRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-xl overflow-hidden z-10",
        className,
      )}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        style={
          {
            "--duration": `${duration}s`,
            "--size": `${size}px`,
            "--border-width": `${borderWidth}px`,
            shapeRendering: "geometricPrecision",
          } as React.CSSProperties
        }
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          rx="12"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={borderWidth}
          strokeDasharray={`${size} var(--perimeter, 800px)`}
          className="animate-border-beam-travel"
          style={{
            strokeLinecap: "round",
            shapeRendering: "geometricPrecision",
            vectorEffect: "non-scaling-stroke",
          }}
        />
      </svg>
    </div>
  );
};
