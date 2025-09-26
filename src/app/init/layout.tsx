import { ReactNode } from 'react'
import { FootGL } from './_components/foot-gl'
import { Header } from './_components/header'
import { cn } from '@/lib/utils'

export default function InitLayout ({ children }: { children: ReactNode }) {
  return (
    <div className={cn('md:h-screen flex flex-col w-screen')}>
      <Header />
      {/* <div className="h-32" /> */}
      <div className='relative h-[calc(64lvh)] z-20'>
        <main className=' z-10 w-full max-w-7xl mx-auto'>{children}</main>
      </div>

      <FootGL />
    </div>
  )
}
