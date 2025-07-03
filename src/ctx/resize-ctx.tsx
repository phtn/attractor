"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useSFX } from "@/hooks/use-sfx";
import { useToggle } from "@/hooks/use-toggle";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

interface ResizeProviderProps {
  children: ReactNode;
}

interface ResizeCtxValues {
  toggleCenter: VoidFunction;
  toggleLeft: VoidFunction;
  toggleRight: VoidFunction;
  centerExpanded: boolean;
  rightExpanded: boolean;
  handleToggle: (side: "left" | "right") => () => void;
}

const ResizeCtx = createContext<ResizeCtxValues | null>(null);

const ResizeCtxProvider = ({ children }: ResizeProviderProps) => {
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
  const { sfxDisable: sfxCollapse } = useSFX({
    playbackRate: 0.2,
    volume: 0.05,
    interrupt: false,
  });
  const handleToggle = useCallback(
    (side: "left" | "right") => () => {
      switch (side) {
        case "left":
          toggleLeft();
          break;
        default:
          toggleRight();
      }
      sfxCollapse();
    },
    [sfxCollapse, toggleLeft, toggleRight],
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
    }
  }, [
    centerToggle,
    rightExpanded,
    leftExpanded,
    sfxCollapse,
    toggleLeft,
    setLeft,
    setRight,
  ]);

  const value = useMemo(
    () => ({
      toggleLeft,
      toggleRight,
      toggleCenter,
      handleToggle,
      rightExpanded,
      centerExpanded,
    }),
    [
      toggleLeft,
      toggleRight,
      toggleCenter,
      handleToggle,
      rightExpanded,
      centerExpanded,
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
