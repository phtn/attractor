'use client'

import { DirectionAwareTabs, ITab } from '@/components/ui/direction-aware-tabs'

import { Icon } from '@/lib/icons'
import { IconSetCard } from './_components/cards'

import { useMemo, memo } from 'react'

export const Content = () => {
  const iconSetIds = useMemo(
    () => ['proicons', 'svg-spinners', 'pixelarticons', 'stash'],
    []
  )

  const tabs = useMemo(
    () =>
      [
        {
          id: 0,
          label: 'ICONS',
          content: () => <IconSets iconSetIds={iconSetIds} />,
        },

        {
          id: 1,
          label: 'HOOKS',
          content: () => <div />,
        },
      ] as ITab[],
    [iconSetIds]
  )

  return (
    <div className='flex border border-zinc-100/50 overflow-hidden w-full h-[70vh] relative rounded-md'>
      <div className='absolute top-0 left-0 w-full bg-zinc-100/15 border-b flex items-center h-12 pl-2 pr-4'>
        <Icon
          name='power-tool'
          className='size-12 text-zinc-600 -rotate-12 shrink-0'
        />{' '}
        <h1 className='text-xl font-light font-space tracking-tighter text-white'>
          {/* <span className="tracking-tighter">dev</span> */}
          <span className='font-extrabold'>devtools</span>
        </h1>
      </div>
      <DirectionAwareTabs tabs={tabs} />
    </div>
  )
}

interface IconSetsProps {
  iconSetIds: string[];
}
const IconSets = memo(function Comp ({ iconSetIds }: IconSetsProps) {
  return (
    <div className='_h-[calc(64lvh)] flex flex-wrap p-4 rounded-xs m-[0.33px]'>
      {iconSetIds.map((id) => (
        <div key={id} className='border-0 border-black col-span-4 '>
          <IconSetCard iconSetId={id} className='' />
        </div>
      ))}
    </div>
  )
})
