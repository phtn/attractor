"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode } from "react";
import { ConvexAuthProvider } from "./auth-ctx";

export const client = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
);
export function Convex({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={client}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexAuthProvider>
  );
}
