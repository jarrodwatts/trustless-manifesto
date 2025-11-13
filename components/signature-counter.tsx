"use client";

import { useReadContract } from "thirdweb/react";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getContract } from "thirdweb";

export function SignatureCounter() {
  const contract = getContract({
    client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const { data: pledgeCount, isLoading } = useReadContract({
    contract,
    method: "pledge_count",
    params: [],
  });

  const count = pledgeCount ? Number(pledgeCount) : 0;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-zinc-400 text-sm uppercase tracking-widest">
        Total Signatures
      </div>
      <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {isLoading ? (
          <div className="animate-pulse">...</div>
        ) : (
          <NumberTicker value={count} />
        )}
      </div>
    </div>
  );
}
