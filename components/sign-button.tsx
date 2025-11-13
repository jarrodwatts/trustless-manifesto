"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall, sendTransaction, getContract } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";
import { Loader2 } from "lucide-react";
import { ShinyRainbowButton } from "@/components/ui/shiny-rainbow-button";
import { ShareableCard } from "@/components/shareable-card";

export function SignButton({ onSigned }: { onSigned?: () => void }) {
  const account = useActiveAccount();
  const [isSigning, setIsSigning] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const contract = getContract({
    client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: hasPledged, refetch } = useReadContract({
    contract,
    method: "has_pledged",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  const handleSign = async () => {
    if (!account) return;

    setIsSigning(true);

    try {
      const transaction = prepareContractCall({
        contract,
        method: "pledge",
        params: [],
      });

      await sendTransaction({
        transaction,
        account,
      });

      // Refetch pledge status
      await refetch();

      // Callback for parent component
      if (onSigned) {
        onSigned();
      }
    } catch (err) {
      console.error("Error signing manifesto:", err);
    } finally {
      setIsSigning(false);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="group relative w-full">
          <div className="relative w-full">
            <ConnectButton
              client={client}
              chain={CHAIN}
              connectButton={{
                label: "Connect Wallet to Sign",
                className: "!group !relative !inline-flex !h-14 !animate-rainbow !cursor-pointer !items-center !justify-center !rounded-xl !border-0 !bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] !bg-origin-border !px-8 !font-medium !text-white !transition-all !duration-300 ![background-clip:padding-box,border-box,border-box] ![background-size:200%_100%,100%_100%,100%_100%] ![border:calc(0.08*1rem)_solid_transparent] !focus-visible:outline-none !focus-visible:ring-1 !focus-visible:ring-ring !disabled:pointer-events-none !disabled:opacity-50 !overflow-visible !w-full !before:absolute !before:bottom-[-20%] !before:left-1/2 !before:z-0 !before:h-1/5 !before:w-3/5 !before:-translate-x-1/2 !before:animate-rainbow !before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] !before:[filter:blur(calc(0.8*1rem))]",
              }}
            />
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 z-[11] rounded-xl pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:120%_0,0_0] bg-no-repeat transition-[background-position] duration-1000 group-hover:bg-[position:-100%_0,0_0]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasPledged && account) {
    return (
      <>
        <ShinyRainbowButton
          onClick={() => setIsShareModalOpen(true)}
          className="w-full"
        >
          Share Manifesto Card
        </ShinyRainbowButton>
        <ShareableCard
          address={account.address}
          isOpen={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          showButton={false}
        />
      </>
    );
  }

  return (
    <>
      <ShinyRainbowButton
        onClick={handleSign}
        disabled={isSigning}
        className="w-full"
      >
        {isSigning ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing...
          </span>
        ) : (
          <>Sign the Manifesto</>
        )}
      </ShinyRainbowButton>
    </>
  );
}
