import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // makes build static
  trailingSlash: true, // friendlier for IPFS
  assetPrefix: "./", // ensures relative asset paths for IPFS
  images: {
    unoptimized: true, // 🔑 disable the image optimizer for static export
  },
};

export default nextConfig;
