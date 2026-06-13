import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ text = 'Generating...', className = '' }) {
  return (
    <div className={clsx('flex items-center gap-2 text-violet-400 text-sm', className)}>
      <Loader2 size={16} className="animate-spin" />
      {text}
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  const friendly =
    message === 'NO_API_KEY' ? 'No API key found. Go to Settings and paste your Groq API key.' :
    message === 'INVALID_KEY' ? 'Invalid Groq API key. Double-check it in Settings.' :
    message

  return (
    <div className="flex items-start gap-3 bg-red-950/60 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-300">
      <span>⚠️</span>
      <span className="flex-1">{friendly}</span>
      {onDismiss && <button onClick={onDismiss} className="text-red-500 hover:text-red-300 ml-2">✕</button>}
    </div>
  )
}

export function Tag({ children, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-950/60 text-violet-400 border-violet-800/40',
    green: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    pink: 'bg-pink-950/60 text-pink-400 border-pink-800/40',
    sky: 'bg-sky-950/60 text-sky-400 border-sky-800/40',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
    orange: 'bg-orange-950/60 text-orange-400 border-orange-800/40',
  }
  return (
    <span className={clsx('text-[11px] font-mono rounded-full px-3 py-[3px] border', colors[color])}>
      {children}
    </span>
  )
}

export function SectionHeader({ label, title, subtitle }) {
  return (
    <div className="mb-6">
      {label && <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">{label}</p>}
      <h2 className="font-display font-bold text-2xl text-white mb-1">{title}</h2>
      {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
    </div>
  )
}

export function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm font-display transition-colors mb-6"
    >
      ← Back
    </button>
  )
}

export function Divider() {
  return <div className="border-t border-base-600 my-6" />
}
