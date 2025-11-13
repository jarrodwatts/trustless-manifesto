"use client";

import { useEffect, useState } from "react";
import { resolveAddressToENS, resolveENSAvatar, truncateAddress, generateGradientForAddress } from "@/lib/ens";
import { ExternalLink } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

interface SignatureCardProps {
  address: string;
  timestamp: bigint;
  transactionHash?: string;
}

export function SignatureCard({ address, timestamp, transactionHash }: SignatureCardProps) {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchENSData() {
      if (!address) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const name = await resolveAddressToENS(address);
      setEnsName(name);

      if (name) {
        const avatar = await resolveENSAvatar(name);
        setAvatarUrl(avatar);
      }
      setIsLoading(false);
    }

    fetchENSData();
  }, [address]);

  // Safety check
  if (!address) {
    return null;
  }

  const displayName = ensName || truncateAddress(address);
  const gradient = generateGradientForAddress(address);
  const date = new Date(Number(timestamp) * 1000);
  const timeAgo = getTimeAgo(date);

  const etherscanUrl = transactionHash
    ? `https://etherscan.io/tx/${transactionHash}`
    : `https://etherscan.io/address/${address}`;

  return (
    <div className="relative rounded-xl group">
      {/* Card Content */}
      <div className="relative z-0 flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-transparent transition-all backdrop-blur-sm">
        {/* Avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        {isLoading ? (
          <div className="w-full h-full bg-zinc-800 animate-pulse" />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: gradient }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">
          {displayName}
        </div>
        <div className="text-sm text-zinc-500">
          {timeAgo}
        </div>
      </div>

      {/* Badge */}
      <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30">
        Signed
      </div>

      {/* Etherscan Link */}
      <a
        href={etherscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        title="View on Etherscan"
      >
        <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
      </a>
      </div>
      
      {/* Border Beam - only visible on hover, positioned on top */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
        <BorderBeam
          duration={4}
          size={100}
          colorFrom="#06b6d4"
          colorTo="#d946ef"
          borderWidth={2}
        />
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
