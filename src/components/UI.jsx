import { Loader2, Globe } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ text = 'Working on it...', size = 'md' }) {
  return (
    <div className="flex items-center gap-2.5 text-terra-400 text-sm">
      <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
      <span className="text-ink-500">{text}</span>
    </div>
  )
}

export function AriaAvatar({ size = 'md', pulse = false }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-base' : size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-lg'
  return (
    <div className={clsx(
      sz, 'rounded-full flex items-center justify-center shrink-0',
      'bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm-sm',
      pulse && 'animate-bounce-soft'
    )}>
      ✦
    </div>
  )
}

export function AriaSays({ children, loading = false }) {
  return (
    <div className="flex gap-3 items-start">
      <AriaAvatar />
      <div className="aria-bubble flex-1">
        {loading
          ? <span className="text-ink-400 italic">Aria is thinking<span className="dot-typing" /></span>
          : children}
      </div>
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  const friendly =
    message === 'NO_API_KEY'  ? 'No Groq API key found. Tap the ⚙️ icon and paste your key.' :
    message === 'INVALID_KEY' ? 'That API key doesn\'t seem right. Double-check it in Settings.' :
    message
  return (
    <div className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
      <span>⚠️</span>
      <span className="flex-1">{friendly}</span>
      {onDismiss && <button onClick={onDismiss} className="text-red-400 hover:text-red-600 ml-1">✕</button>}
    </div>
  )
}

export function WebBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-sage-100 text-sage-600 border border-sage-200 rounded-full px-2 py-0.5">
      <Globe size={9} /> live data
    </span>
  )
}

export function PotentialBadge({ level }) {
  const styles = {
    'High':      'bg-sand-100 text-sand-600 border-sand-200',
    'Very High': 'bg-terra-100 text-terra-600 border-terra-200',
    'Explosive': 'bg-red-100 text-red-600 border-red-200',
  }
  return (
    <span className={clsx('text-[11px] font-mono rounded-full px-2.5 py-0.5 border', styles[level] || styles['High'])}>
      🔥 {level}
    </span>
  )
}

export function PriorityBadge({ level }) {
  return (
    <span className={clsx(
      'text-[10px] font-mono rounded-full px-2 py-0.5 border',
      level === 'High'
        ? 'bg-terra-100 text-terra-600 border-terra-200'
        : 'bg-cream-100 text-ink-400 border-cream-300'
    )}>
      {level}
    </span>
  )
}

export function SectionCard({ icon, title, subtitle, accent = 'terra', children, className = '' }) {
  const accents = {
    terra: 'border-terra-200',
    sage:  'border-sage-200',
    sand:  'border-sand-200',
    cream: 'border-cream-300',
  }
  return (
    <div className={clsx('card p-6 md:p-8', accents[accent], className)}>
      <div className="flex items-start gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-display text-xl text-ink-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-ink-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function Chip({ children, active, onClick, variant = 'terra' }) {
  const activeStyles = variant === 'sage' ? 'chip-sage-active' : 'chip-active'
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('chip', active ? activeStyles : 'chip-idle')}
    >
      {children}
    </button>
  )
}

export function Divider({ label }) {
  if (!label) return <hr className="border-cream-200 my-6" />
  return (
    <div className="flex items-center gap-3 my-6">
      <hr className="flex-1 border-cream-200" />
      <span className="text-xs font-mono text-ink-300 uppercase tracking-widest">{label}</span>
      <hr className="flex-1 border-cream-200" />
    </div>
  )
}

export function BackButton({ onClick, label = 'Back' }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-ink-400 hover:text-ink-700 text-sm font-body transition-colors mb-6">
      ← {label}
    </button>
  )
}
