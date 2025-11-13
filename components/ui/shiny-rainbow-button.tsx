import React from "react";
import { cn } from "@/lib/utils";

interface ShinyRainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ShinyRainbowButton({
  children,
  className,
  ...props
}: ShinyRainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-14 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] bg-origin-border px-8 font-medium text-white transition-all duration-300 [background-clip:padding-box,border-box,border-box] [background-size:200%_100%,100%_100%,100%_100%] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:[filter:blur(calc(0.8*1rem))]",
        "after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] after:bg-[length:250%_250%,100%_100%] after:bg-[position:120%_0,0_0] after:bg-no-repeat after:transition-[background-position] after:duration-1000 hover:after:bg-[position:-100%_0,0_0]",
        className,
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>
    </button>
  );
}
