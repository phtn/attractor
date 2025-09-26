import { Icon } from '@/lib/icons'

export function PullRequests () {
  return (
    <div className='border-b dark:border-zinc-800 space-y-6 p-6 h-[10.5rem]'>
      <div className='flex items-center justify-start gap-2'>
        <Icon name='pull-request' size={12} solid className='text-zinc-500' />
        <h2
          className='text-xs font-bold uppercase font-mono tracking-[0.20em] dark:text-zinc-400/90 text-foreground'
        >
          pull requests
        </h2>
      </div>

      <div className='space-y-3'>
        {activities.map((activity, index) => (
          <div key={index} className='flex gap-4 text-xs'>
            <span className='text-zinc-500 w-32 flex-shrink-0'>
              {activity.time}
            </span>
            <span className='text-zinc-400'>Agent</span>
            <span className='text-zinc-100'>{activity.agent}</span>
            <span className='text-zinc-500'>{activity.action}</span>
            <span className='text-zinc-100'>{activity.location}</span>
            {activity.target && (
              <>
                <span className='text-zinc-500'>with agent</span>
                <span className='text-zinc-100'>{activity.target}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
const activities = [
  {
    time: '25/06/2025 09:29',
    agent: 'gh0st Fire',
    action: 'completed mission in',
    location: 'Berlin',
    target: 'zer0 Nigh',
  },
  {
    time: '25/06/2025 08:12',
    agent: 'dr4g0n V3in',
    action: 'extracted high-value target in',
    location: 'Cairo',
    target: '',
  },
  {
    time: '24/06/2025 22:55',
    agent: 'sn4ke Sh4de',
    action: 'lost communication in',
    location: 'Havana',
    target: '',
  },
]
