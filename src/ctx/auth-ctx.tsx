"use client";

import { ConvexAuthProvider as ConvexAuth } from "@convex-dev/auth/react";
import { type ConvexReactClient } from "convex/react";
import { type ReactNode } from "react";
interface AuthProviderProps {
  children?: ReactNode;
  client: ConvexReactClient;
}

const ConvexAuthProvider = ({ client, children }: AuthProviderProps) => {
  return <ConvexAuth client={client}>{children}</ConvexAuth>;
};

export { ConvexAuthProvider };
