"use client";

import { TRPC } from "@/trpc/client";
import { createContext, useMemo, useContext, type ReactNode } from "react";
import { Convex } from "./convex-ctx";
import { ThemeProvider } from "@/components/theme-provider";
import { ResizeCtxProvider } from "./resize-ctx";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ProvidersProviderProps {
  children: ReactNode;
}

interface ProvidersCtxValues {
  on: boolean;
}

const ProvidersCtx = createContext<ProvidersCtxValues | null>(null);

const ProvidersCtxProvider = ({ children }: ProvidersProviderProps) => {
  const value = useMemo(
    () => ({
      on: false,
    }),
    [],
  );
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <SidebarProvider>
        <ResizeCtxProvider>
          <ProvidersCtx value={value}>
            <Convex>
              <TRPC>{children}</TRPC>
            </Convex>
          </ProvidersCtx>
        </ResizeCtxProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
};

const useProvidersCtx = () => {
  const ctx = useContext(ProvidersCtx);
  if (!ctx) throw new Error("ProvidersCtxProvider is missing");
  return ctx;
};

export { ProvidersCtx, ProvidersCtxProvider, useProvidersCtx };
