import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jamming - 음악인을 위한 합주 플랫폼",
    short_name: "Jamming",
    description: "놀기 위해 모였다! 음악인을 위한 합주 매칭 플랫폼",
    start_url: "/",
    display: "standalone",
    background_color: "#111113",
    theme_color: "#111113",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
