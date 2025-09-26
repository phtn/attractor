'use client'

import { Preloaded, usePreloadedQuery } from 'convex/react'
import { api } from 'vx/_generated/api'

interface Props {
  preloaded: Preloaded<typeof api.cats.get.active>;
}
export const Content = ({ preloaded }: Props) => {
  const data = usePreloadedQuery(preloaded)
  return (
    <div>
      <div>{data[0].name}</div>
      {/* <AssetGallery category="apps" data={data} /> */}
    </div>
  )
}
