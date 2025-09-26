import { useEventsCtx } from '@/ctx/events-ctx'
import { RepoSelect } from './webhooks/repo-select'

export function Repositories () {
  const ctx = useEventsCtx()
  return (
    <div className='px-2 border-t py-6 h-[10.5rem] font-jet'>
      <RepoSelect {...ctx} />
    </div>
  )
}
