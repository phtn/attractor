"use client";

import { useSidebar } from "@/components/ui/sidebar";
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

  const toggleCenter = useCallback(() => {
    if (rightExpanded || leftExpanded) {
      setLeft(false);
      setRight(false);
    } else if (!rightExpanded && !leftExpanded) {
      setLeft(true);
      setRight(true);
    } else {
      centerToggle();
      toggleLeft();
    }
  }, [
    centerToggle,
    rightExpanded,
    leftExpanded,
    toggleLeft,
    setLeft,
    setRight,
  ]);

  const value = useMemo(
    () => ({
      toggleLeft,
      toggleRight,
      toggleCenter,
      rightExpanded,
      centerExpanded,
    }),
    [toggleLeft, toggleRight, toggleCenter, rightExpanded, centerExpanded],
  );
  return <ResizeCtx value={value}>{children}</ResizeCtx>;
};

const useResizeCtx = () => {
  const ctx = useContext(ResizeCtx);
  if (!ctx) throw new Error("ResizeCtxProvider is missing");
  return ctx;
};

export { ResizeCtx, ResizeCtxProvider, useResizeCtx };
