"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useContractEvents, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";
import { SignatureCard } from "./signature-card";
import { Skeleton } from "@/components/ui/skeleton";
import { NumberTicker } from "@/components/ui/number-ticker";

interface PledgedEvent {
  signer: string;
  timestamp: bigint;
  transactionHash?: string;
}

function SignatureCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  );
}

export function SignaturesFeed() {
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const prevEventsLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const contract = getContract({
    client,
    chain: CHAIN,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  // Read the actual pledge count from the contract
  const { data: pledgeCount, isLoading: isLoadingCount } = useReadContract({
    contract,
    method: "pledge_count",
    params: [],
  });

  // Use thirdweb's useContractEvents hook
  const { data: contractEvents, isLoading } = useContractEvents({
    contract,
  });

  // Process and format events
  const allEvents = useMemo(() => {
    if (!contractEvents || contractEvents.length === 0) return [];

    console.log("Contract events:", contractEvents);

    return contractEvents
      .filter((event: any) => event.eventName === "Pledged") // Only Pledged events
      .map((event: any) => {
        console.log("Processing event:", event);
        const args = event.args || {};
        return {
          signer: args.signer || args[0],
          timestamp: args.timestamp || args[1] || BigInt(Date.now() / 1000),
          transactionHash: event.transactionHash,
        };
      })
      .filter((event: PledgedEvent) => event.signer) // Filter out invalid entries
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  }, [contractEvents]);

  // Get events to display (for infinite scroll)
  const events = useMemo(() => {
    return allEvents.slice(0, displayCount);
  }, [allEvents, displayCount]);

  // Detect new items and mark them for animation
  useEffect(() => {
    if (isInitialLoadRef.current && allEvents.length > 0) {
      // Skip animation for initial load
      prevEventsLengthRef.current = allEvents.length;
      isInitialLoadRef.current = false;
      return;
    }

    if (allEvents.length > prevEventsLengthRef.current) {
      // New items detected - mark them for animation
      const newIds = new Set<string>();
      const newCount = allEvents.length - prevEventsLengthRef.current;

      // Add IDs of new items (only the newest ones at the top)
      for (let i = 0; i < newCount && i < allEvents.length; i++) {
        const event = allEvents[i];
        newIds.add(`${event.signer}-${event.timestamp}`);
      }

      setNewItemIds(newIds);
      prevEventsLengthRef.current = allEvents.length;

      // Remove animation class after animation completes
      setTimeout(() => {
        setNewItemIds(new Set());
      }, 600);
    }
  }, [allEvents]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;

      // Load more when user is 80% down the page
      if (scrolled / scrollableHeight > 0.8 && !isLoadingMore && events.length < allEvents.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayCount((prev) => prev + 20);
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, events.length, allEvents.length]);

  const count = pledgeCount ? Number(pledgeCount) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recent Signatures</h2>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isLoadingCount ? (
              <div className="animate-pulse">...</div>
            ) : (
              <NumberTicker value={count} />
            )}
          </div>
          <div className="text-zinc-500 text-sm">
            pledges
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <SignatureCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="mb-2">Loading signatures...</p>
          <p className="text-xs">If this persists, events may still be syncing from the blockchain</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {events.map((event, index) => {
              const eventId = `${event.signer}-${event.timestamp}`;
              const isNew = newItemIds.has(eventId);

              return (
                <div
                  key={`${eventId}-${index}`}
                  className={isNew ? "animate-slide-in" : ""}
                >
                  <SignatureCard
                    address={event.signer}
                    timestamp={event.timestamp}
                    transactionHash={event.transactionHash}
                  />
                </div>
              );
            })}
          </div>

          {isLoadingMore && (
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <SignatureCardSkeleton key={i} />
              ))}
            </div>
          )}

          {events.length >= allEvents.length && allEvents.length > 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              You&apos;ve reached the end
            </div>
          )}
        </>
      )}
    </div>
  );
}
