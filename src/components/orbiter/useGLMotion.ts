'use client'

import { useEffect, useState } from 'react'
import { useTime } from 'framer-motion'

export const useGLMotion = () => {
  const ry = useTime()
  const [rotY, setRotY] = useState<number>(0)

  useEffect(() => {
    const unsub = ry.on('change', (v) => {
      setRotY(getHertz(v / 10000, -0.12, 0.12))
    })
    return unsub
  }, [ry])

  return { rotY }
}

const getHertz = (t: number, min: number, max: number) => {
  const normalizedTime = (t % 2) / 2 // Normalize time to the 0-1 range
  const oscillationValue =
    min + (max - min) * ((Math.sin(normalizedTime * 2 * Math.PI) + 1) / 2) // Use sin() to create the oscillation, normalized to 0-1 range
  return oscillationValue
}
