'use client'

import createGlobe from 'cobe'
import { type ReactNode, useEffect, useRef } from 'react'
import { BeamEffect } from '@/components/beam'
import { cn } from '@/lib/utils'
import type { ClassName } from '@/app/types'

export const Globe = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const divRef1 = useRef<HTMLDivElement | null>(null)
  const divRef2 = useRef<HTMLDivElement | null>(null)
  const divRef3 = useRef<HTMLDivElement | null>(null)
  const divRef4 = useRef<HTMLDivElement | null>(null)
  const stopColor = '#6ee7b7'
  const startColor = '#E8EBED'
  return (
    <div
      ref={containerRef}
      className='md:shadow-macd-void/25 relative overflow-clip md:rounded-[2rem] md:shadow-xl portrait:h-[calc(45vh)]'
    >
      <Node className=''>
        <div ref={divRef1} className='size-5' />
      </Node>
      <div ref={divRef2} className='absolute bottom-10 right-0 size-5' />
      <div ref={divRef3} className='absolute bottom-36 right-0 size-5' />
      <div ref={divRef4} className='absolute bottom-56 right-0 size-5' />
      <div className='relative z-20 flex h-full w-full items-center justify-start'>
        <div className='flex h-full w-1/5 items-center justify-start' />
        <div className='h-[calc(50vh)] w-4/5 overflow-hidden'>
          <Cobe />
        </div>
      </div>
      <BeamEffect
        fromRef={divRef1}
        toRef={divRef2}
        containerRef={containerRef}
        curvature={-300}
        startXOffset={10}
        startYOffset={150}
        endXOffset={100}
        endYOffset={0}
        duration={12}
        gradientStartColor={startColor}
        gradientStopColor={stopColor}
      />
      <BeamEffect
        fromRef={divRef1}
        toRef={divRef3}
        containerRef={containerRef}
        curvature={-220}
        startXOffset={20}
        startYOffset={80}
        endXOffset={200}
        endYOffset={-60}
        duration={20}
        gradientStartColor={startColor}
        gradientStopColor={stopColor}
      />
      <BeamEffect
        reverse
        fromRef={divRef1}
        toRef={divRef4}
        containerRef={containerRef}
        curvature={120}
        startXOffset={60}
        startYOffset={-20}
        endXOffset={200}
        endYOffset={140}
        duration={11}
        gradientStartColor={startColor}
        gradientStopColor={stopColor}
      />
      <BeamEffect
        reverse
        fromRef={divRef3}
        toRef={divRef1}
        containerRef={containerRef}
        curvature={-150}
        startXOffset={200}
        startYOffset={-40}
        endXOffset={10}
        endYOffset={150}
        duration={17}
        gradientStartColor={startColor}
        gradientStopColor={stopColor}
      />
    </div>
  )
}

function Cobe () {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0
    if (!canvasRef.current) return
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800 * 2,
      height: 800 * 2,
      phi: 0,
      theta: -0.003,
      dark: 0.9,
      scale: 1.4,
      diffuse: 0.2,
      mapSamples: 8000,
      mapBrightness: 1,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.3, 0.3, 0.3],
      markers: [
        // longitude latitude -33.8882660526033, 151.186737977912
        // -37.83804545665295, 145.04187781033474
        // -26.20445829243173, 28.04954057960671
        // -16.7798330729519, -64.31743542675979
        // 28.023919273564022, -81.24930689818535

        { location: [-21.0132, 45.9549], size: 0.1 }, // Sydney
        { location: [47.1029, -121.8688], size: 0.15 }, // Sydney
        { location: [28.0239, -81.2493], size: 0.1 }, // Sydney
        { location: [-16.7798, -64.3174], size: 0.02 }, // Sydney
        { location: [30.0674, 31.2429], size: 0.08 }, // Sydney
        { location: [14.5276, 120.9699], size: 0.4 }, // Sydney
        { location: [-33.8882, 151.1867], size: 0.03 }, // Sydney
        { location: [-37.838, 145.0419], size: 0.05 }, // Melbourne
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi
        phi += 0.0005
      },
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return (
    <div className='h-screen absolute bottom-0 pb-80 left-0 w-screen aspect-square rotate-180'>
      <canvas
        ref={canvasRef}
        style={{ height: '30%', width: '100%' }}
        className='aspect-square pb-20'
      />
    </div>
  )
}

// const Hero = (props: { divRef1: RefObject<HTMLDivElement> }) => (
//   <>
//     <div className="potrait:p-4 absolute left-10 flex h-20 w-full space-x-8 p-8 text-xl portrait:left-4 portrait:top-6 portrait:p-4">
//       <Image
//         width={0}
//         height={0}
//         priority
//         unoptimized
//         alt="airliner"
//         src="/svg/qantas_v2.svg"
//         className="h-24 w-28"
//       />
//       <div ref={props.divRef1} className="size-5"></div>
//     </div>
//     <div className="absolute left-8 top-32 -space-y-2">
//       <div className="relative -top-1 w-fit rounded-lg border-coal/20 px-2 py-0.5 font-dm text-2xl font-semibold tracking-tighter text-coal/50 -rotate-3 portrait:px-0">
//         Take the
//       </div>
//       <div className="font-kan text-4xl font-semibold tracking-[-0.06em] text-hades md:text-6xl">
//         Global
//       </div>
//       <div className="font-kan text-4xl font-semibold tracking-[-0.06em] text-hades md:text-6xl">
//         Leap<span className="px-[1px] text-macl-mint">.</span>
//       </div>

//       <div className="flex h-36 w-full items-center">
//         <Button
//           variant="shadow"
//           size="md"
//           color="secondary"
//           className="gap-4 bg-macl-mint"
//         >
//           <span className="text-white">Get Started</span>
//           <ArrowRightCircleIcon className="size-7" />
//         </Button>
//       </div>
//     </div>
//   </>
// );

interface NodeProps {
  children: ReactNode;
  className?: ClassName;
}
const Node = ({ children, className }: NodeProps) => (
  <div
    className={cn(
      'absolute flex flex-col text-xl',
      'h-64 w-full',
      'left-10 space-x-8 p-8',
      'portrait:left-4 portrait:top-6 portrait:p-4',
      className
    )}
  >
    {children}
  </div>
)
