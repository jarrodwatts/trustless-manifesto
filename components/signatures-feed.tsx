"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useContractEvents, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN } from "@/lib/contract";
import { client } from "@/lib/client";
import { SignatureCard } from "./signature-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LoaderOne } from "@/components/ui/loader";

interface PledgedEvent {
  signer: string;
  timestamp: bigint;
  transactionHash?: string;
}

function normalizePledgedEvents(events: Array<any>): PledgedEvent[] {
  const normalized: PledgedEvent[] = [];

  for (const event of events) {
    if (event?.eventName !== "Pledged") {
      continue;
    }

    const args = event?.args ?? {};
    const signer = extractSigner(args);
    if (!signer) {
      continue;
    }

    const timestamp = extractTimestamp(args);
    const transactionHash =
      typeof event?.transactionHash === "string"
        ? event.transactionHash
        : typeof event?.transaction?.transactionHash === "string"
          ? event.transaction.transactionHash
          : undefined;

    normalized.push({
      signer,
      timestamp,
      transactionHash,
    });
  }

  return normalized.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
}

function mergeEvents(existing: PledgedEvent[], incoming: PledgedEvent[]): PledgedEvent[] {
  if (incoming.length === 0) {
    return existing;
  }

  const merged = new Map<string, PledgedEvent>();

  for (const event of existing) {
    merged.set(getEventKey(event), event);
  }

  for (const event of incoming) {
    merged.set(getEventKey(event), event);
  }

  return Array.from(merged.values()).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
}

function extractSigner(args: Record<string, unknown> | Array<unknown>): string | undefined {
  if (Array.isArray(args)) {
    const [signer] = args;
    return typeof signer === "string" ? signer : undefined;
  }

  if (args && typeof args === "object") {
    const signer = (args as Record<string, unknown>).signer;
    return typeof signer === "string" ? signer : undefined;
  }

  return undefined;
}

function extractTimestamp(args: Record<string, unknown> | Array<unknown>): bigint {
  let value: unknown;

  if (Array.isArray(args)) {
    [, value] = args;
  } else if (args && typeof args === "object") {
    value = (args as Record<string, unknown>).timestamp;
  }

  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return BigInt(Math.floor(value));
  }

  if (typeof value === "string" && value.length > 0) {
    try {
      return BigInt(value);
    } catch {
      // ignore parse errors, fall through to default
    }
  }

  if (value && typeof value === "object" && "toString" in value && typeof (value as { toString: () => string }).toString === "function") {
    try {
      return BigInt((value as { toString: () => string }).toString());
    } catch {
      // ignore parse errors, fall through to default
    }
  }

  return BigInt(Math.floor(Date.now() / 1000));
}

function getEventKey(event: PledgedEvent) {
  return `${event.signer}-${event.timestamp}-${event.transactionHash ?? ""}`;
}

export function SignaturesFeed() {
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const [allEvents, setAllEvents] = useState<PledgedEvent[]>([]);
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

  // Use watch mode to stream events as they come in
  const { data: contractEvents, isLoading } = useContractEvents({
    contract,
    watch: true,
  });

  // Process events as they come in
  useEffect(() => {
    if (!contractEvents) {
      return;
    }

    const normalized = normalizePledgedEvents(contractEvents);
    setAllEvents((prev) => mergeEvents(prev, normalized));
  }, [contractEvents]);

  // Get events to display (for infinite scroll)
  const events = useMemo(() => {
    return allEvents.slice(0, displayCount);
  }, [allEvents, displayCount]);

  // Detect new items and mark them for animation
  useEffect(() => {
    if (isInitialLoadRef.current) {
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
    } else {
      prevEventsLengthRef.current = allEvents.length;
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
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-white">Recent Signatures</h2>
        <div className="flex flex-col items-end gap-0">
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
            pledges
          </div>
          <div className="text-2xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isLoadingCount ? (
              <div className="animate-pulse">...</div>
            ) : (
              <NumberTicker value={count} />
            )}
          </div>
        </div>
      </div>

      {events.length === 0 && !isLoading ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="mb-2">No signatures yet.</p>
          <p className="text-xs">Check back soon to see new pledges land here.</p>
        </div>
      ) : (
        <>
          {events.length > 0 && (
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
          )}

          {/* Show loader below loaded events while fetching more */}
          {isLoading && (
            <div className="mt-6 flex justify-center">
              <LoaderOne />
            </div>
          )}

          {isLoadingMore && (
            <div className="mt-4 flex justify-center">
              <LoaderOne />
            </div>
          )}

          {/* Only show "reached the end" if we've displayed all events, have events, and not loading */}
          {events.length > 0 && events.length >= allEvents.length && allEvents.length > 0 && !isLoading && !isLoadingMore && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              You&apos;ve reached the end
            </div>
          )}
        </>
      )}
    </div>
  );
}
