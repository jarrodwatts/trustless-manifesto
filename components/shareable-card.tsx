"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2, Copy, X as XIcon } from "lucide-react";
import { resolveAddressToENS, truncateAddress } from "@/lib/ens";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";

interface ShareableCardProps {
  address: string;
  signatureNumber?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showButton?: boolean;
}

type CardStyle = "default" | "style2" | "style3" | "style4";

// Helper function to wait for fonts to load
function waitForFonts(fontFamily: string, timeout = 5000): Promise<void> {
  return new Promise((resolve) => {
    // Check if document.fonts API is available
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Additional check for the specific font
        if (document.fonts.check(`16px ${fontFamily}`)) {
          resolve();
        } else {
          // Wait a bit more for the font to load
          setTimeout(() => resolve(), 500);
        }
      }).catch(() => resolve());
    } else {
      // Fallback: just wait a bit
      setTimeout(() => resolve(), 1000);
    }
  });
}

export function ShareableCard({ 
  address, 
  signatureNumber, 
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  showButton = true 
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [showAccount, setShowAccount] = useState(true);
  const [cardStyle, setCardStyle] = useState<CardStyle>("default");
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsModalOpen;
  const setIsModalOpen = externalOnOpenChange || setInternalIsModalOpen;

  useEffect(() => {
    async function fetchENS() {
      const name = await resolveAddressToENS(address);
      setEnsName(name);
    }
    fetchENS();
  }, [address]);

  useEffect(() => {
    // Wait for Inter font to load
    const interFont = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-inter")
      .trim();
    waitForFonts(interFont || "Inter").then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const displayName = ensName || truncateAddress(address);

  const generateImage = async (): Promise<string> => {
    if (!cardRef.current) throw new Error("Card ref not available");

    // Wait for fonts and images to load
    await waitForFonts("Inter", 5000);
    // Wait for images to fully render
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const dataUrl = await toPng(cardRef.current, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: "#000000",
      cacheBust: true,
      fontEmbedCSS: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `,
    });

    return dataUrl;
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = await generateImage();

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

  const handleCopy = async () => {
    if (!cardRef.current || isCopying) return;

    setIsCopying(true);

    try {
      const dataUrl = await generateImage();

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying image:", error);
      // Fallback: try copying data URL as text
      try {
        const dataUrl = await generateImage();
        await navigator.clipboard.writeText(dataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy also failed:", fallbackError);
      }
    } finally {
      setIsCopying(false);
    }
  };


  return (
    <>
      {showButton && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all hover:scale-105"
        >
          <Download className="w-5 h-5" />
          Share Card
        </button>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-[90vw] md:max-w-2xl lg:max-w-4xl max-h-[90vh] bg-zinc-900/95 border-zinc-800 p-0 flex flex-col" 
          showCloseButton={false}
          overlayClassName="backdrop-blur-md bg-black/70"
          style={{ maxHeight: '90vh' }}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl font-semibold">
                Share Card
              </DialogTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-6 p-6 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
            {/* Card Preview */}
            <div className="flex justify-center items-start w-full">
              <div
                ref={cardRef}
                className="relative w-full max-w-[600px] aspect-[3/2] rounded-2xl overflow-hidden bg-black"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  minHeight: 0,
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src="/trustless-background.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="relative h-full w-full flex flex-col items-center p-8 md:p-12">
                  {/* Ethereum Logo - Top Center */}
                  <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <Image
                        src="/eth-icon-frame.png"
                        alt="Ethereum"
                        width={140}
                        height={140}
                        className="drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        style={{
                          filter: "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
                        }}
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Side Ethereum Logos - Wireframe */}
                  <div className="absolute top-8 md:top-12 left-4 md:left-8 opacity-20 z-0">
                    <Image
                      src="/eth-icon-frame.png"
                      alt="Ethereum"
                      width={90}
                      height={90}
                      style={{
                        filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))",
                        opacity: 0.25,
                      }}
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-8 md:top-12 right-4 md:right-8 opacity-20 z-0">
                    <Image
                      src="/eth-icon-frame.png"
                      alt="Ethereum"
                      width={90}
                      height={90}
                      style={{
                        filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))",
                        opacity: 0.25,
                      }}
                      unoptimized
                    />
                  </div>

                  {/* Main Content - Vertically Centered */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 mt-16 md:mt-20 pb-4">
                    {/* Main Title - Split into lines */}
                    <div className="mb-6 md:mb-8">
                      <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          letterSpacing: "-0.04em",
                          textShadow: "0 0 30px rgba(255,255,255,0.4)",
                        }}
                      >
                        <div className="block">Trustless</div>
                        <div className="block">Manifesto</div>
                      </h1>
                    </div>

                    {/* Signed by */}
                    {showAccount && (
                      <p
                        className="text-white/90 text-lg md:text-xl"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        }}
                      >
                        signed by {displayName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-[600px] mx-auto flex flex-col md:flex-row gap-3 flex-shrink-0">
              {/* Action Buttons */}
              <button
                onClick={handleDownload}
                disabled={isGenerating || isCopying}
                className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-800/70 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer cursor-pointer text-white transition-all duration-200 w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/50 disabled:hover:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Save Image
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                disabled={isGenerating || isCopying}
                className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-800/70 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer cursor-pointer text-white transition-all duration-200 w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-900/50 disabled:hover:cursor-not-allowed"
              >
                {isCopying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Copying...
                  </>
                ) : copied ? (
                  <>
                    <Copy className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
