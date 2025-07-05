"use client";

import { getCookie } from "@/app/actions";
import { useSidebar } from "@/components/ui/sidebar";
import { useSFX } from "@/hooks/use-sfx";
import { useToggle } from "@/hooks/use-toggle";
import { handleAsync } from "@/utils/async-handler";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ResizeProviderProps {
  children: ReactNode;
}

interface ResizeCtxValues {
  toggleCenter: VoidFunction;
  toggleLeft: VoidFunction;
  toggleRight: VoidFunction;
  sideHoverSfx: VoidFunction;
  centerHoverSfx: VoidFunction;
  rightExpanded: boolean;
  centerExpanded: boolean;
  handleToggle: (side: "left" | "right") => () => void;
}

const ResizeCtx = createContext<ResizeCtxValues | null>(null);

const ResizeCtxProvider = ({ children }: ResizeProviderProps) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundState = handleAsync(getCookie)("soundEnabled");
  const sfxEnabled = useCallback(
    async () =>
      soundState
        .then(({ data }) => setSoundEnabled(data ?? true))
        .catch(console.error),
    [soundState],
  );

  useEffect(() => {
    sfxEnabled().catch(console.error);
  }, [sfxEnabled]);

  const { on: centerExpanded, toggle: centerToggle } = useToggle();
  const {
    on: rightExpanded,
    toggle: toggleRight,
    setOn: setRight,
  } = useToggle(true);
  const {
    open: leftExpanded,
    toggleSidebar: toggleLeft,
    setOpen: setLeft,
  } = useSidebar();
  const { sfxStep: sfxCollapse } = useSFX({
    playbackRate: 1.95,
    volume: 0.05,
    interrupt: false,
    soundEnabled,
  });
  const { sfxStep: sfxExpand } = useSFX({
    playbackRate: 1.5,
    volume: 0.05,
    interrupt: false,
    soundEnabled,
  });
  const handleToggle = useCallback(
    (side: "left" | "right") => () => {
      switch (side) {
        case "left":
          toggleLeft();
          if (leftExpanded) {
            sfxCollapse();
          } else {
            sfxExpand();
          }
          break;
        default:
          toggleRight();
          if (rightExpanded) {
            sfxCollapse();
          } else {
            sfxExpand();
          }
      }
    },
    [
      sfxCollapse,
      sfxExpand,
      leftExpanded,
      rightExpanded,
      toggleLeft,
      toggleRight,
    ],
  );

  const toggleCenter = useCallback(() => {
    if (rightExpanded || leftExpanded) {
      setLeft(false);
      setRight(false);
    } else if (!rightExpanded && !leftExpanded) {
      setLeft(true);
      setRight(true);
      sfxCollapse();
    } else {
      centerToggle();
      toggleLeft();
      sfxExpand();
    }
  }, [
    centerToggle,
    rightExpanded,
    leftExpanded,
    sfxCollapse,
    toggleLeft,
    sfxExpand,
    setRight,
    setLeft,
  ]);

  const { sfxDiamond: centerHoverSfx } = useSFX({
    playbackRate: 1.8,
    volume: 0.1,
    interrupt: false,
  });
  const { sfxDiamond: sideHoverSfx } = useSFX({
    playbackRate: 2.0,
    volume: 0.1,
    interrupt: false,
    soundEnabled: false,
  });
  const value = useMemo(
    () => ({
      toggleLeft,
      toggleRight,
      sideHoverSfx,
      toggleCenter,
      handleToggle,
      rightExpanded,
      centerExpanded,
      centerHoverSfx,
    }),
    [
      toggleLeft,
      toggleRight,
      sideHoverSfx,
      toggleCenter,
      handleToggle,
      rightExpanded,
      centerExpanded,
      centerHoverSfx,
    ],
  );
  return <ResizeCtx value={value}>{children}</ResizeCtx>;
};

const useResizeCtx = () => {
  const ctx = useContext(ResizeCtx);
  if (!ctx) throw new Error("ResizeCtxProvider is missing");
  return ctx;
};

export { ResizeCtx, ResizeCtxProvider, useResizeCtx };
