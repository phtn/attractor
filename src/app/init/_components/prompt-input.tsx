import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Sparkles, ChevronDown, Mic, ArrowUp } from 'lucide-react'

export function PromptInput () {
  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4'>
      <div className='bg-white rounded-2xl shadow-lg border p-4'>
        <div className='flex items-center gap-3'>
          <Button size='icon' variant='ghost' className='h-10 w-10 rounded-full'>
            <Plus className='h-5 w-5' />
          </Button>

          <div className='flex-1 relative'>
            <Input
              placeholder='Describe your 3D object or scene...'
              className='border-0 bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 pr-12'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='outline' className='h-9 gap-2'>
              <Sparkles className='h-4 w-4 text-green-500' />
              Inspiration
              <ChevronDown className='h-4 w-4' />
            </Button>

            <Button variant='outline' className='h-9 gap-2'>
              Brainwave 2.5
              <ChevronDown className='h-4 w-4' />
            </Button>

            <Button size='icon' variant='ghost' className='h-9 w-9'>
              <Mic className='h-4 w-4' />
            </Button>

            <Button size='icon' className='h-9 w-9 bg-black hover:bg-gray-800'>
              <ArrowUp className='h-4 w-4 text-white' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
