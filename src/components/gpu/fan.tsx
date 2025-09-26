import type { FanDirection, FanSpeed } from '@/components/gpu'
import { useTheme } from 'next-themes'
import { useCallback, useMemo } from 'react'

interface GPUFanProps {
  fanSpeed: FanSpeed;
  fanDirection: FanDirection;
  isOn: boolean;
}

export const GPUFanSVG = ({ fanSpeed, fanDirection, isOn }: GPUFanProps) => {
  const { theme } = useTheme()
  const isDark = useMemo(() => theme === 'dark', [theme])
  const FanBlades = useCallback(
    () => (
      <g
        style={{
          transformOrigin: '100px 100px',
          animation: `spin ${fanSpeed} linear infinite ${fanDirection}`,
        }}
      >
        {/* Generate 9 realistic curved overlapping blades */}
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 360) / 9
          const radian = (angle * Math.PI) / 180

          // Create curved blade path that spirals outward
          const innerRadius = 26
          const outerRadius = 84.5
          const curveOffset = 0.8 // Controls the curve intensity

          // Start point (inner)
          const x1 = 100 + Math.cos(radian) * innerRadius
          const y1 = 100 + Math.sin(radian) * innerRadius

          // End point (outer)
          const x4 = 100 + Math.cos(radian + curveOffset) * outerRadius
          const y4 = 100 + Math.sin(radian + curveOffset) * outerRadius

          // Control points for smooth S-curve
          const x2 =
            100 + Math.cos(radian + curveOffset * 0.3) * (innerRadius + 15)
          const y2 =
            100 + Math.sin(radian + curveOffset * 0.3) * (innerRadius + 15)

          const x3 =
            100 + Math.cos(radian + curveOffset * 0.7) * (outerRadius - 15)
          const y3 =
            100 + Math.sin(radian + curveOffset * 0.7) * (outerRadius - 15)

          // Blade width points
          const widthOffset = 0.24
          const x1b = 100 + Math.cos(radian - widthOffset) * innerRadius
          const y1b = 100 + Math.sin(radian - widthOffset) * innerRadius

          const x4b =
            100 + Math.cos(radian + curveOffset - widthOffset) * outerRadius
          const y4b =
            100 + Math.sin(radian + curveOffset - widthOffset) * outerRadius

          const x2b =
            100 +
            Math.cos(radian + curveOffset * 0.3 - widthOffset) *
              (innerRadius + 15)
          const y2b =
            100 +
            Math.sin(radian + curveOffset * 0.3 - widthOffset) *
              (innerRadius + 15)

          const x3b =
            100 +
            Math.cos(radian + curveOffset * 0.7 - widthOffset) *
              (outerRadius - 15)
          const y3b =
            100 +
            Math.sin(radian + curveOffset * 0.5 - widthOffset) *
              (outerRadius - 10)

          return (
            <g key={i}>
              {/* Shadow/gap between blades for depth */}
              <path
                d={`M ${x1.toFixed(3)} ${y1.toFixed(3)} C ${x2.toFixed(3)} ${y2.toFixed(3)} ${x3.toFixed(3)} ${y3.toFixed(3)} ${x4.toFixed(3)} ${y4.toFixed(3)} L ${x4b.toFixed(3)} ${y4b.toFixed(3)} C ${x3b.toFixed(3)} ${y3b.toFixed(3)} ${x2b.toFixed(3)} ${y2b.toFixed(3)} ${x1b.toFixed(3)} ${y1b.toFixed(3)} Z`}
                fill={
                  isDark
                    ? 'url(#bladeShadowGradient)'
                    : 'url(#bladeShadowGradient)'
                }
                stroke='none'
                opacity={isDark ? '0.3' : '0.4'}
                transform='translate(2, 2)'
              />

              {/* Main blade with gradient */}
              <path
                d={`M ${x1.toFixed(3)} ${y1.toFixed(3)} C ${x2.toFixed(3)} ${y2.toFixed(3)} ${x3.toFixed(3)} ${y3.toFixed(3)} ${x4.toFixed(3)} ${y4.toFixed(3)} L ${x4b.toFixed(3)} ${y4b.toFixed(3)} C ${x3b.toFixed(3)} ${y3b.toFixed(3)} ${x2b.toFixed(3)} ${y2b.toFixed(3)} ${x1b.toFixed(3)} ${y1b.toFixed(3)} Z`}
                fill={
                  i % 3 === 0
                    ? isDark
                      ? 'url(#bladeGradient2Dark)'
                      : 'url(#bladeGradientLight)'
                    : isDark
                      ? 'url(#bladeGradient2Dark)'
                      : 'url(#bladeGradient2Light)'
                }
                stroke={isDark ? '#202023' : '#6b4423'}
                strokeWidth='0.8'
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity={isDark ? '0.50' : '0.95'}
              />

              {/* Blade highlight for 3D effect */}
              <path
                d={`M ${x1.toFixed(3)} ${y1.toFixed(3)} C ${x2.toFixed(3)} ${y2.toFixed(3)} ${x3.toFixed(3)} ${y3.toFixed(3)} ${x4.toFixed(3)} ${y4.toFixed(3)}`}
                fill='none'
                stroke={isDark ? '#52525b' : '#d4a574'}
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity={isDark ? '0.6' : '0.7'}
              />

              {/* Dark edge for overlap effect */}
              <path
                d={`M ${x1b.toFixed(3)} ${y1b.toFixed(3)} C ${x2b.toFixed(3)} ${y2b.toFixed(3)} ${x3b.toFixed(3)} ${y3b.toFixed(3)} ${x4b.toFixed(3)} ${y4b.toFixed(3)}`}
                fill='none'
                stroke={isDark ? '#111' : '#3d2418'}
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
                opacity={isDark ? '0.8' : '0.6'}
              />
            </g>
          )
        })}
      </g>
    ),
    [fanDirection, fanSpeed, isDark]
  )

  return (
    <div className='flex justify-center scale-[25%]'>
      <div className='relative'>
        <svg
          width='200'
          height='200'
          viewBox='0 0 200 200'
          className='drop-shadow-lg'
        >
          {/* Define gradients for 3D effect */}
          <defs>
            {/* Dark mode gradients */}
            <radialGradient id='bladeGradientDark' cx='0.3' cy='0.3' r='0.8'>
              <stop offset='0%' stopColor='#666' />
              <stop offset='50%' stopColor='#27272a' />
              <stop offset='100%' stopColor='#18181b' />
            </radialGradient>
            <radialGradient id='bladeGradient2Dark' cx='0.7' cy='0.3' r='0.8'>
              <stop offset='0%' stopColor='#555' />
              <stop offset='50%' stopColor='#3f3f46' />
              <stop offset='100%' stopColor='#111' />
            </radialGradient>
            <radialGradient id='hubGradientDark' cx='0.3' cy='0.3' r='1'>
              <stop offset='0%' stopColor='#222' />
              <stop offset='70%' stopColor='#18181b' />
              <stop offset='100%' stopColor='#000' />
            </radialGradient>

            {/* Light mode gradients - realistic brown fan theme */}
            <radialGradient id='bladeGradientLight' cx='0.2' cy='0.2' r='1.0'>
              <stop offset='0%' stopColor='#c4956b' />
              <stop offset='30%' stopColor='#b8845a' />
              <stop offset='60%' stopColor='#a67348' />
              <stop offset='100%' stopColor='#8b5a2b' />
            </radialGradient>
            <radialGradient id='bladeGradient2Light' cx='0.8' cy='0.2' r='1.0'>
              <stop offset='0%' stopColor='#b8845a' />
              <stop offset='30%' stopColor='#a67348' />
              <stop offset='60%' stopColor='#8b5a2b' />
              <stop offset='100%' stopColor='#6b4423' />
            </radialGradient>
            <radialGradient id='hubGradientLight' cx='0.3' cy='0.3' r='1'>
              <stop offset='0%' stopColor='#c4956b' />
              <stop offset='40%' stopColor='#b8845a' />
              <stop offset='80%' stopColor='#a67348' />
              <stop offset='100%' stopColor='#8b5a2b' />
            </radialGradient>
            <radialGradient
              id='innerRingGradientLight'
              cx='0.1'
              cy='0.1'
              r='1.5'
            >
              <stop offset='0%' stopColor='#2a1810' />
              <stop offset='30%' stopColor='#3d2418' />
              <stop offset='70%' stopColor='#5a3a28' />
              <stop offset='100%' stopColor='#6b4423' />
            </radialGradient>
            <radialGradient id='bladeShadowGradient' cx='0.5' cy='0.5' r='0.8'>
              <stop offset='0%' stopColor='#1a0f08' />
              <stop offset='50%' stopColor='#2a1810' />
              <stop offset='100%' stopColor='#3d2418' />
            </radialGradient>
          </defs>

          {/* Outer ring/housing */}
          <circle
            cx='100'
            cy='100'
            r='95'
            fill={isDark ? '#18181b' : '#f5f5dc'}
            stroke={isDark ? '#1a1a1a' : '#e8e8d0'}
            strokeWidth='3'
          />

          {/* Inner ring - dark recessed area in light mode */}
          <circle
            suppressHydrationWarning
            cx='100'
            cy='100'
            r='85'
            fill={isDark ? '#10101b' : 'url(#innerRingGradientLight)'}
            stroke={isDark ? '#404040' : '#3d2418'}
            strokeWidth='2'
            className='relative z-10'
          />
          <FanBlades />

          {/* Center hub with realistic design */}
          <circle
            suppressHydrationWarning
            cx='100'
            cy='100'
            r='25'
            fill={isDark ? 'url(#hubGradientDark)' : 'url(#hubGradientLight)'}
            stroke={isDark ? '#52525b' : '#6b4423'}
            strokeWidth='2'
          />
          <circle
            cx='100'
            cy='100'
            r='20'
            fill={isDark ? '#1a1a1a' : '#c4956b'}
            stroke={isDark ? '#333' : '#8b5a2b'}
            strokeWidth='1'
          />

          {/* Center logo area */}
          <circle
            cx='100'
            cy='100'
            r='15'
            fill={isDark ? '#2a2a2a' : '#b8845a'}
            stroke={isDark ? '#666' : '#6b4423'}
            strokeWidth='1'
          />

          {/* Brand text (simplified) */}
          <text
            x='100'
            y='102'
            textAnchor='middle'
            fontSize='6'
            fill={isDark ? '#888' : '#3d2418'}
            fontFamily='Arial, sans-serif'
            fontWeight='bold'
          >
            AXIAL
          </text>
          <text
            x='100'
            y='110'
            textAnchor='middle'
            fontSize='4'
            fill={isDark ? '#666' : '#6b4423'}
            fontFamily='Arial, sans-serif'
          >
            COOLING
          </text>

          {/* Center LED indicator */}
          <circle
            cx='100'
            cy='100'
            r='2'
            fill={isOn ? '#00ff41' : isDark ? '#333' : '#3d2418'}
          />

          {/* Mounting points - keep creamy for outer housing */}
          <circle
            cx='25'
            cy='25'
            r='5'
            fill={isDark ? '#222' : '#f0f0e0'}
            stroke={isDark ? '#444' : '#d4d4aa'}
            strokeWidth='1'
          />
          <circle
            cx='175'
            cy='25'
            r='5'
            fill={isDark ? '#222' : '#f0f0e0'}
            stroke={isDark ? '#444' : '#d4d4aa'}
            strokeWidth='1'
          />
          <circle
            cx='25'
            cy='175'
            r='5'
            fill={isDark ? '#222' : '#f0f0e0'}
            stroke={isDark ? '#444' : '#d4d4aa'}
            strokeWidth='1'
          />
          <circle
            cx='175'
            cy='175'
            r='5'
            fill={isDark ? '#222' : '#f0f0e0'}
            stroke={isDark ? '#444' : '#d4d4aa'}
            strokeWidth='1'
          />

          {/* Additional housing details */}
          <circle
            cx='100'
            cy='100'
            r='88'
            fill='none'
            stroke={isDark ? '#18181b' : '#e8e8d0'}
            strokeWidth='1'
            opacity='0.8'
          />
          {/* Inner Circle Overlap - dark transition for depth */}
          <circle
            cx='100'
            cy='100'
            r='84'
            fill='none'
            stroke={isDark ? '#202023' : '#2a1810'}
            strokeWidth='2'
            opacity='0.8'
          />
        </svg>
      </div>
    </div>
  )
}
