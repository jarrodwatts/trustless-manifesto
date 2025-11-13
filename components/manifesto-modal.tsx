"use client";

import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";

export function ManifestoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const contract = getContract({
    client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: manifestoText } = useReadContract({
    contract,
    method: "MANIFESTO",
    params: [],
  });

  const { data: title } = useReadContract({
    contract,
    method: "TITLE",
    params: [],
  });

  const { data: authors } = useReadContract({
    contract,
    method: "AUTHORS",
    params: [],
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-white/20 text-white transition-all hover:scale-105"
      >
        <FileText className="w-5 h-5" />
        Read the Full Manifesto
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {title || "The Trustless Manifesto"}
                </h2>
                {authors && (
                  <p className="text-sm text-zinc-400 mt-1">
                    By {authors}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 prose prose-invert max-w-none">
              {manifestoText ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                  {manifestoText}
                </pre>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  Loading manifesto...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
