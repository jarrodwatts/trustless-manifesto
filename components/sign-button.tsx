"use client";

import { useState } from "react";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall, sendTransaction, getContract } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";
import { Check, Loader2 } from "lucide-react";

export function SignButton({ onSigned }: { onSigned?: () => void }) {
  const account = useActiveAccount();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

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
      setError(err instanceof Error ? err.message : "Failed to sign manifesto");
    } finally {
      setIsSigning(false);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ConnectButton
          client={client}
          chain={CHAIN}
          connectButton={{
            label: "Connect Wallet to Sign",
            className: "!bg-gradient-to-r !from-pink-500 !to-purple-500 hover:!from-pink-600 hover:!to-purple-600 !text-white !font-semibold !px-8 !py-4 !rounded-xl !text-lg !transition-all !duration-200 hover:!scale-105",
          }}
        />
      </div>
    );
  }

  if (hasPledged) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          disabled
          className="flex items-center gap-2 bg-green-500/20 text-green-400 font-semibold px-8 py-4 rounded-xl text-lg border border-green-500/30 cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Already Signed
        </button>
        <p className="text-sm text-zinc-500">
          You&apos;ve already signed the manifesto
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleSign}
        disabled={isSigning}
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSigning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing...
          </>
        ) : (
          <>Sign the Manifesto</>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-400 max-w-md text-center">
          {error}
        </p>
      )}
      <p className="text-sm text-zinc-500 max-w-md text-center">
        By signing, you pledge to build trustless systems on Ethereum
      </p>
    </div>
  );
}
