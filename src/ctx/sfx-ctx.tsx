"use client";

import { getCookie, setCookie } from "@/app/actions";
import { handleAsync } from "@/utils/async-handler";
import {
  createContext,
  useMemo,
  useContext,
  type ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";

interface SFXCtxProviderProps {
  children: ReactNode;
}

interface SFXCtxValues {
  soundEnabled: boolean | undefined;
  setSfxState: () => Promise<void>;
  getSfxState: () => Promise<void>;
}

const SFXCtx = createContext<SFXCtxValues | null>(null);

const SFXCtxProvider = ({ children }: SFXCtxProviderProps) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>();
  const getSfxState = useCallback(async () => {
    await handleAsync(getCookie)("soundEnabled")
      .then(({ data }) => setSoundEnabled(data ?? false))
      .catch(console.error);
  }, []);

  const setSfxState = useCallback(async () => {
    await handleAsync(setCookie)("soundEnabled", !soundEnabled);
    setSoundEnabled((prev) => !prev);
  }, [soundEnabled]);

  useEffect(() => {
    if (!soundEnabled) getSfxState().catch(console.error);
  }, [getSfxState, soundEnabled]);

  const value = useMemo(
    () => ({
      soundEnabled,
      setSfxState,
      getSfxState,
    }),
    [soundEnabled, setSfxState, getSfxState],
  );
  return <SFXCtx value={value}>{children}</SFXCtx>;
};

const useSFXCtx = () => {
  const ctx = useContext(SFXCtx);
  if (!ctx) throw new Error("SFXCtxProvider is missing");
  return ctx;
};

export { SFXCtxProvider, useSFXCtx };
