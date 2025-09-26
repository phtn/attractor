export function AgentList () {
  const agents = [
    { id: 'G-078W', name: 'VENGEFUL SPIRIT' },
    { id: 'G-079X', name: 'OBSIDIAN SENTINEL' },
    { id: 'G-080Y', name: 'GHOSTLY FURY' },
    { id: 'G-081Z', name: 'CURSED REVENANT' },
    { id: 'G-082A', name: 'VENOMOUS SHADE' },
    { id: 'G-083B', name: 'MYSTIC ENIGMA' },
    { id: 'G-084C', name: 'WRAITH AVENGER' },
    { id: 'G-085D', name: 'SPECTRAL FURY' },
    { id: 'G-086E', name: 'PHANTOM STRIKE' },
    { id: 'G-087F', name: 'DARK VENGEANCE' },
    { id: 'G-088G', name: 'ECLIPSE WARDEN' },
    { id: 'G-089H', name: 'SILENT BLADE' },
    { id: 'G-090I', name: 'SHADOW HUNTER' },
    { id: 'G-091J', name: 'CRIMSON WHISPER' },
    { id: 'G-092K', name: 'NIGHT STALKER' },
    { id: 'G-094M', name: 'GHOST FIRE' },
  ]

  return (
    <div className=''>
      <div className='grid px-6 h-16 grid-cols-2 gap-4 text-xs text-zinc-400 border-b border-xy'>
        <div className='h-full flex items-center'>Commits</div>
        <div className='h-full flex items-center'>Repo</div>
      </div>

      <div className='space-y-2 p-6'>
        {agents.map((agent) => (
          <div
            key={agent.id}
            className='grid grid-cols-2 gap-4 text-xs py-1 hover:bg-zinc-900/50'
          >
            <div className='text-zinc-400'>{agent.id}</div>
            <div className='text-zinc-300'>{agent.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
