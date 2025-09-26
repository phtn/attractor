'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useSFX } from '@/hooks/use-sfx'
import { useToggle } from '@/hooks/use-toggle'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useSFXCtx } from './sfx-ctx'

interface ResizeProviderProps {
  children: ReactNode;
}

interface ResizeCtxValues {
  toggleCenter: VoidFunction;
  toggleLeft: VoidFunction;
  toggleRight: VoidFunction;
  sideHoverSfx: VoidFunction;
  leftExpanded: boolean;
  centerHoverSfx: VoidFunction;
  rightExpanded: boolean;
  centerExpanded: boolean;
  handleToggle: (side: 'left' | 'right') => () => void;
}

const ResizeCtx = createContext<ResizeCtxValues | null>(null)

const ResizeCtxProvider = ({ children }: ResizeProviderProps) => {
  const { soundEnabled } = useSFXCtx()
  const { on: centerExpanded, toggle: centerToggle } = useToggle()
  const {
    on: rightExpanded,
    toggle: toggleRight,
    setOn: setRight,
  } = useToggle()
  const {
    open: leftExpanded,
    toggleSidebar: toggleLeft,
    setOpen: setLeft,
  } = useSidebar()
  const { sfxStep: sfxCollapse } = useSFX({
    playbackRate: 1.95,
    volume: 0.05,
    interrupt: false,
    soundEnabled,
  })
  const { sfxStep: sfxExpand } = useSFX({
    playbackRate: 1.5,
    volume: 0.05,
    interrupt: false,
    soundEnabled,
  })
  const handleToggle = useCallback(
    (side: 'left' | 'right') => () => {
      switch (side) {
        case 'left':
          toggleLeft()
          if (leftExpanded) {
            sfxCollapse()
          } else {
            sfxExpand()
          }
          break
        case 'right':
          toggleRight()
          if (rightExpanded) {
            sfxCollapse()
          } else {
            sfxExpand()
          }
          break
        default:
          sfxCollapse()
      }
    },
    [
      sfxCollapse,
      sfxExpand,
      leftExpanded,
      rightExpanded,
      toggleLeft,
      toggleRight,
    ]
  )

  const toggleCenter = useCallback(() => {
    if (rightExpanded || leftExpanded) {
      setLeft(false)
      setRight(false)
    } else if (!rightExpanded && !leftExpanded) {
      setLeft(true)
      setRight(true)
      sfxCollapse()
    } else {
      centerToggle()
      toggleLeft()
      sfxExpand()
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
  ])

  const { sfxDiamond: centerHoverSfx } = useSFX({
    playbackRate: 1.8,
    volume: 0.01,
    interrupt: false,
    soundEnabled,
  })
  const { sfxDiamond: sideHoverSfx } = useSFX({
    playbackRate: 2.8,
    volume: 0.008,
    interrupt: false,
    soundEnabled,
  })
  const value = useMemo(
    () => ({
      toggleLeft,
      toggleRight,
      sideHoverSfx,
      toggleCenter,
      handleToggle,
      leftExpanded,
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
      leftExpanded,
      rightExpanded,
      centerExpanded,
      centerHoverSfx,
    ]
  )
  return <ResizeCtx value={value}>{children}</ResizeCtx>
}

const useResizeCtx = () => {
  const ctx = useContext(ResizeCtx)
  if (!ctx) throw new Error('ResizeCtxProvider is missing')
  return ctx
}

export { ResizeCtx, ResizeCtxProvider, useResizeCtx }
