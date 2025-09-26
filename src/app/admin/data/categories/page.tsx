import { api } from '@@/api'
import { Content } from './content'
import { preloadQuery } from 'convex/nextjs'

export default async function CategoriesPage () {
  const preloaded = await preloadQuery(api.cats.get.all)

  return (
    <div className='px-6'>
      <Content preloaded={preloaded} />
    </div>
  )
}
