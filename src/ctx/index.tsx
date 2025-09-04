"use client";

import { TRPC } from "@/trpc/client";
import {
  createContext,
  useMemo,
  useContext,
  type ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Convex } from "./convex-ctx";
import { ThemeProvider } from "@/components/theme-provider";
import { ResizeCtxProvider } from "./resize-ctx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { handleAsync } from "@/utils/async-handler";
import { getCookie } from "@/app/actions";
import { SFXCtxProvider } from "./sfx-ctx";
import { Toasts } from "./toast-ctx";

interface ProvidersProviderProps {
  children: ReactNode;
}

interface ProvidersCtxValues {
  on: boolean;
}

const ProvidersCtx = createContext<ProvidersCtxValues | null>(null);

const ProvidersCtxProvider = ({ children }: ProvidersProviderProps) => {
  const [defaultTheme, setDefaultMode] = useState("dark");
  const getTheme = useCallback(async () => {
    const { data, error } = await handleAsync(getCookie)("theme");
    if (data) setDefaultMode(decodeURI(data));
    if (error) console.error(error);
  }, []);

  useEffect(() => {
    getTheme().catch(console.error);
  }, [getTheme]);

  const value = useMemo(
    () => ({
      on: false,
    }),
    [],
  );
  return (
    <ProvidersCtx value={value}>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme={defaultTheme ?? "dark"}
        disableTransitionOnChange
      >
        <SFXCtxProvider>
          <SidebarProvider>
            <ResizeCtxProvider>
              <Convex>
                <TRPC>{children}</TRPC>
              </Convex>
            </ResizeCtxProvider>
          </SidebarProvider>
        </SFXCtxProvider>
      </ThemeProvider>
      <Toasts />
    </ProvidersCtx>
  );
};

const useProvidersCtx = () => {
  const ctx = useContext(ProvidersCtx);
  if (!ctx) throw new Error("ProvidersCtxProvider is missing");
  return ctx;
};

export { ProvidersCtx, ProvidersCtxProvider, useProvidersCtx };
