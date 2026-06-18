import { Loader2, Globe } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ text = 'Working...', size = 'md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin text-terra-400" />
      <span className="text-ink-500 dark:text-gray-400 text-sm">{text}</span>
    </div>
  )
}

export function AriaAvatar({ size = 'md', pulse = false }) {
  const sz = { sm:'w-8 h-8 text-sm', md:'w-10 h-10 text-lg', lg:'w-16 h-16 text-3xl' }[size]
  return (
    <div className={clsx(sz, 'rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm-sm font-display', pulse && 'animate-bounce-soft')}>
      ✦
    </div>
  )
}

export function AriaSays({ children, loading = false }) {
  return (
    <div className="flex gap-3 items-start">
      <AriaAvatar />
      <div className="aria-bubble flex-1">
        {loading ? <span className="text-ink-400 dark:text-gray-500 italic">Aria is thinking<span className="dot-typing" /></span> : children}
      </div>
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  const friendly =
    message === 'NO_API_KEY'  ? 'No Groq API key found. Tap ⚙️ top-right and paste your key.' :
    message === 'INVALID_KEY' ? "API key invalid. Double-check it in Settings." : message
  return (
    <div className="flex gap-3 items-start bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
      <span>⚠️</span><span className="flex-1">{friendly}</span>
      {onDismiss && <button onClick={onDismiss} className="text-red-400 hover:text-red-600 shrink-0">✕</button>}
    </div>
  )
}

export function WebBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-sage-100 dark:bg-sage-900 text-sage-600 dark:text-sage-300 border border-sage-200 dark:border-sage-700 rounded-full px-2 py-0.5">
      <Globe size={9} /> live
    </span>
  )
}

export function PotentialBadge({ level }) {
  const s = {
    'High':      'bg-sand-100 dark:bg-sand-900 text-sand-600 dark:text-sand-300 border-sand-200',
    'Very High': 'bg-terra-100 dark:bg-terra-900 text-terra-600 dark:text-terra-300 border-terra-200',
    'Explosive': 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-200',
  }
  return <span className={clsx('text-[11px] font-mono rounded-full px-2.5 py-0.5 border shrink-0', s[level] || s['High'])}>🔥 {level}</span>
}

export function PriorityBadge({ level }) {
  return (
    <span className={clsx('text-[10px] font-mono rounded-full px-2 py-0.5 border shrink-0',
      level === 'High'
        ? 'bg-terra-100 dark:bg-terra-900 text-terra-600 dark:text-terra-300 border-terra-200'
        : 'bg-cream-100 dark:bg-gray-800 text-ink-400 dark:text-gray-500 border-cream-300 dark:border-gray-700'
    )}>
      {level}
    </span>
  )
}

export function SectionCard({ icon, title, subtitle, children, className = '' }) {
  return (
    <div className={clsx('card p-6', className)}>
      <div className="flex items-start gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-display text-xl text-ink-900 dark:text-gray-100 leading-tight">{title}</h3>
          {subtitle && <p className="text-ink-400 dark:text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function Chip({ children, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx('chip', active ? 'chip-active' : 'chip-idle')}>
      {children}
    </button>
  )
}

export function BackButton({ onClick, label = 'Back' }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-300 text-sm transition-colors mb-6">
      ← {label}
    </button>
  )
}
