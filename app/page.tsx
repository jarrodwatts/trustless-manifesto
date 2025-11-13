"use client";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { BackgroundEffects } from "@/components/background-effects";
import { HeroSection } from "@/components/hero-section";
import { SignButton } from "@/components/sign-button";
import { SignaturesFeed } from "@/components/signatures-feed";
import { ManifestoModal } from "@/components/manifesto-modal";
import { ShareableCard } from "@/components/shareable-card";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";

export default function Home() {
  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: hasPledged } = useReadContract({
    contract,
    method: "has_pledged",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  const { data: pledgeCount } = useReadContract({
    contract,
    method: "pledge_count",
    params: [],
  });

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />

      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <HeroSection />

        {/* Action Buttons - horizontally aligned and same size */}
        <div className="flex flex-col items-center gap-3 py-6 w-full max-w-2xl px-4">
          <div className="flex flex-row items-center gap-3 w-full">
            <SignButton />
            <ManifestoModal />
          </div>
          <p className="text-sm text-zinc-500 text-center max-w-xl mt-2">
            Signing means pledging to build trustless systems that prioritize openness over convenience.
          </p>
        </div>

        {/* Shareable Card (shown after signing) */}
        {hasPledged && account && (
          <div className="py-8 w-full flex justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Thank you for signing!
              </h3>
              <p className="text-zinc-400 mb-6">
                Download and share your signature card
              </p>
              <ShareableCard
                address={account.address}
                signatureNumber={pledgeCount ? Number(pledgeCount) : undefined}
              />
            </div>
          </div>
        )}

        {/* Signatures Feed */}
        <SignaturesFeed />

        {/* Footer */}
        <footer className="w-full py-12 text-center text-zinc-500 text-sm">
          <p>
            Built on Ethereum •{" "}
            <a
              href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              View Contract
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
