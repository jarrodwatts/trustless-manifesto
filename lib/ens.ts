import { resolveName, resolveAvatar } from "thirdweb/extensions/ens";
import { client } from "./client";

/**
 * Resolve an Ethereum address to its ENS name
 */
export async function resolveAddressToENS(address: string): Promise<string | null> {
  try {
    const name = await resolveName({
      client,
      address,
    });
    return name;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return null;
  }
}

/**
 * Resolve an ENS name to its avatar URL
 */
export async function resolveENSAvatar(ensName: string): Promise<string | null> {
  try {
    const avatar = await resolveAvatar({
      client,
      name: ensName,
    });
    return avatar;
  } catch (error) {
    console.error("Error resolving ENS avatar:", error);
    return null;
  }
}

/**
 * Truncate an Ethereum address for display
 */
export function truncateAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generate a deterministic gradient avatar for an address
 */
export function generateGradientForAddress(address: string): string {
  // Use address to generate consistent colors
  const hash = address.slice(2, 8);
  const hue1 = parseInt(hash.slice(0, 2), 16);
  const hue2 = (hue1 + 120) % 360;

  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`;
}
