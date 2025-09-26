import { greetHello } from '@/server/callers'
import { useCallback } from 'react'

export const useGreet = () => {
  const log = useCallback(async () => {
    const result = await greetHello({ text: 'motherfucker!' })
    console.log(result.text)
  }, [])

  return {
    log,
  }
}
