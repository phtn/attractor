'use client'

import { Loader } from '@/components/loader'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const Content = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/init')
  }, [router])
  return (
    <main className='h-screen w-full flex items-start justify-center'>
      <div className='h-1/2 flex items-center justify-center'>
        <div className='size-full flex items-center w-full justify-center'>
          <Loader />
        </div>
      </div>
    </main>
  )
}
