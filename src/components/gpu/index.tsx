import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GPUFanSVG } from './fan'

export type FanState = 'off' | 'low' | 'medium' | 'high'
export type FanSpeed = '9s' | '2s' | '1s' | '0.5s' | '0s'
export type FanDirection = 'reverse' | 'normal' | '1.5s' | '0.8s'

interface GPUFanProps {
  on?: boolean;
  suppressHydrationWarning: boolean;
}

export const GPUFan = ({ on = false }: GPUFanProps) => {
  const [fanState, setFanState] = useState<FanState>('low')
  const [isOn, setIsOn] = useState(on)

  const fanSpeed = useMemo(() => {
    if (!isOn || fanState === 'off') return '9s'
    switch (fanState) {
      case 'low':
        return '2s'
      case 'medium':
        return '1s'
      case 'high':
        return '0.5s'
      default:
        return '9s'
    }
  }, [fanState, isOn])

  const fanDirection = useMemo(
    () => (fanState === 'high' ? 'reverse' : 'normal'),
    [fanState]
  )

  const handlePowerToggle = () => {
    setIsOn(!isOn)
    if (isOn) {
      setFanState('off')
    } else {
      setFanState('low')
    }
  }

  const handleSpeedChange = (speed: FanState) => {
    if (speed === 'off') {
      setIsOn(false)
      setFanState('low')
    } else {
      setIsOn(true)
      setFanState(speed)
    }
  }

  // const getStateColor = () => {
  //   if (!isOn || fanState === "off") return "bg-gray-500";
  //   switch (fanState) {
  //     case "low":
  //       return "bg-green-500";
  //     case "medium":
  //       return "bg-yellow-500";
  //     case "high":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

  return (
    <div className='flex items-center justify-center size-[5.75rem] -mx-2'>
      <GPUFanSVG fanSpeed={fanSpeed} fanDirection={fanDirection} isOn={isOn} />

      {/* Controls */}
      <div className='space-y-4'>
        {/* Power Toggle */}

        {/* Speed Controls */}
        <div className='_grid grid-cols-4 gap-2 hidden'>
          <Button
            onClick={handlePowerToggle}
            variant={fanState === 'off' ? 'default' : 'outline'}
            size='sm'
          >
            {isOn ? 'Turn Off' : 'Turn On'}
          </Button>
          <Button
            onClick={() => handleSpeedChange('low')}
            variant={fanState === 'low' ? 'default' : 'outline'}
            size='sm'
            disabled={!isOn}
            className={
              fanState === 'low' ? 'bg-green-600 hover:bg-green-700' : ''
            }
          >
            Low
          </Button>
          <Button
            onClick={() => handleSpeedChange('medium')}
            variant={fanState === 'medium' ? 'default' : 'outline'}
            size='sm'
            disabled={!isOn}
            className={
              fanState === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
            }
          >
            Medium
          </Button>
          <Button
            onClick={() => handleSpeedChange('high')}
            variant={fanState === 'high' ? 'default' : 'outline'}
            size='sm'
            disabled={!isOn}
            className={fanState === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            High
          </Button>
        </div>
      </div>

      {/* Status Display */}
      <div className='text-center hidden space-x-2 _flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          Status:{' '}
          <span className='font-semibold'>{isOn ? 'Running' : 'Stopped'}</span>
        </div>
        {isOn && (
          <div className='text-xs text-gray-500'>
            RPM:{' '}
            {fanState === 'low'
              ? '1200'
              : fanState === 'medium'
                ? '2400'
                : '3600'}
          </div>
        )}
        <div className='text-sm text-gray-600'>
          Speed:{' '}
          <span className='font-semibold'>
            {fanState.charAt(0).toUpperCase() + fanState.slice(1)}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
      </style>
    </div>
  )
}
