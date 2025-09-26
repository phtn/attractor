import { Card, CardHeader } from '@/components/ui/card'
import { type Cat } from 'vx/cats/d'
import Link from 'next/link'

export default function CategoryGrid ({ cats }: { cats: Cat[] }) {
  return (
    <div className='grid grid-cols-5 gap-4 mb-8'>
      {cats?.map((category, index) => (
        <Link href={`/init/${category.slug}`} key={index}>
          <Card>
            <CardHeader>
              <div className='flex items-start justify-start gap-4'>
                <div className='size-16 rounded-xl' />
                <h3 className='font-semibold text-foreground'>
                  {category.name}
                </h3>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export const categories = [
  {
    title: 'Apps',
    slug: 'apps',
    subtitle: 'Sleek, abstract objects',
    image: '/placeholder.svg?height=80&width=80',
    bgColor: 'bg-amber-100',
  },
  {
    title: 'Components',
    slug: 'components',
    subtitle: 'Dreamy, scenic vibes',
    image: '/placeholder.svg?height=80&width=80',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Templates',
    slug: 'templates',
    subtitle: 'Minimalist, soft',
    image: '/placeholder.svg?height=80&width=80',
    bgColor: 'bg-gray-100',
  },
  {
    title: 'Themes',
    slug: 'themes',
    subtitle: 'Clean, rounded icons',
    image: '/placeholder.svg?height=80&width=80',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Other',
    slug: 'other',
    subtitle: 'Modern buildings',
    image: '/placeholder.svg?height=80&width=80',
    bgColor: 'bg-blue-100',
  },
]
