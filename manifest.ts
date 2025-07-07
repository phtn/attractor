import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "hsl(49 26.8% 92%)",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "re-up.ph",
    short_name: "re-up.ph",
    icons: [
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    prefer_related_applications: true,
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=com.anthropic.claude",
        id: "ph.re-up.io",
      },
    ],
  };
}
