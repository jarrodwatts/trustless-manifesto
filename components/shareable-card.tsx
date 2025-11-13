"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";
import { resolveAddressToENS, truncateAddress } from "@/lib/ens";
import Image from "next/image";

interface ShareableCardProps {
  address: string;
  signatureNumber?: number;
}

export function ShareableCard({ address, signatureNumber }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchENS() {
      const name = await resolveAddressToENS(address);
      setEnsName(name);
    }
    fetchENS();
  }, [address]);

  const displayName = ensName || truncateAddress(address);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      // Wait a bit for fonts to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });

      const link = document.createElement("a");
      link.download = `trustless-manifesto-${displayName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Card Preview */}
      <div
        ref={cardRef}
        className="relative w-[600px] h-[400px] rounded-2xl overflow-hidden border-2 border-white/20"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        }}
      >
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-12">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-12 h-12 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <Image
                    src="/eth.png"
                    alt="Ethereum"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="text-white/60 text-sm font-mono">
                  ETHEREUM MAINNET
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mt-4">
                The Trustless
                <br />
                Manifesto
              </h2>
            </div>

            {signatureNumber && (
              <div className="text-right">
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">
                  Signature #
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {signatureNumber.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Middle */}
          <div className="flex flex-col gap-2">
            <div className="text-white/60 text-sm uppercase tracking-widest">
              Signed by
            </div>
            <div className="text-4xl font-bold text-white">
              {displayName}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
              <span className="text-sm font-semibold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Verified On-Chain
              </span>
            </div>

            <div className="text-white/40 text-xs font-mono">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Card
          </>
        )}
      </button>
    </div>
  );
}
