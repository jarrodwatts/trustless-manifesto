"use client";

import { ExternalLink } from "lucide-react";

export function ManifestoModal() {
  return (
    <a
      href="https://trustlessness.eth.limo/general/2025/11/11/the-trustless-manifesto.html"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-white/20 text-white transition-all w-full font-medium"
    >
      <span className="md:hidden">Read manifesto</span>
      <span className="hidden md:inline">Read the Full Manifesto</span>
      <ExternalLink className="w-5 h-5" />
    </a>
  );
}
