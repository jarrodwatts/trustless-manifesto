import { defineChain } from "thirdweb/chains";

// Ethereum Mainnet with custom RPC
// If NEXT_PUBLIC_ETHEREUM_RPC_URL is set, use it; otherwise fall back to default Thirdweb RPC
const ethereumRpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;

export const CHAIN = ethereumRpcUrl
  ? defineChain({
      id: 1, // Ethereum mainnet chain ID
      rpc: ethereumRpcUrl, // Your custom Ethereum mainnet RPC URL
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorers: [
        {
          name: "Etherscan",
          url: "https://etherscan.io",
        },
      ],
    })
  : defineChain(1); // Fallback to default Thirdweb RPC if no custom URL is provided

// Contract address
export const CONTRACT_ADDRESS = "0x32aa964746ba2be65c71fe4a5cb3c4a023ca3e20";

// Contract ABI
export const CONTRACT_ABI = [
  {
    name: "Pledged",
    inputs: [
      { name: "signer", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "pledge",
    inputs: [],
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "pledged_before",
    inputs: [
      { name: "who", type: "address" },
      { name: "cutoff", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "has_pledged",
    inputs: [{ name: "who", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "TITLE",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "AUTHORS",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "DATE",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "MANIFESTO",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "pledge_at",
    inputs: [{ name: "arg0", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "pledge_count",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
