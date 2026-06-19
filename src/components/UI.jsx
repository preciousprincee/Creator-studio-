import { Loader2, Globe } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ text = 'Working...', size = 'md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <Loader2 size={size==='sm'?14:18} className="animate-spin text-terra-400" />
      <span className="text-ink-500 dark:text-gray-400 text-sm">{text}</span>
    </div>
  )
}

export function AriaAvatar({ size='md', pulse=false }) {
  const sz = {sm:'w-8 h-8 text-sm', md:'w-10 h-10 text-lg', lg:'w-16 h-16 text-3xl'}[size]
  return (
    <div className={clsx(sz,'rounded-full flex items-center justify-center shrink-0 font-display',
      pulse && 'animate-bounce-soft')}
      style={{background:'linear-gradient(135deg,#f8cfc0,#d9c9a8)',boxShadow:'0 1px 3px rgba(100,70,40,0.12)'}}>
      ✦
    </div>
  )
}

export function AriaSays({ children, loading=false }) {
  return (
    <div className="flex gap-3 items-start">
      <AriaAvatar />
      <div className="aria-bubble flex-1">
        {loading ? <span className="text-ink-400 dark:text-gray-500 italic">Aria is thinking<span className="dot-typing"/></span> : children}
      </div>
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  const txt = message==='NO_API_KEY' ? 'No Groq API key. Tap ⚙️ and paste your key.'
            : message==='INVALID_KEY' ? 'Invalid API key. Check it in Settings.'
            : message
  return (
    <div className="flex gap-3 items-start rounded-2xl px-4 py-3 text-sm"
      style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#991b1b'}}>
      <span>⚠️</span><span className="flex-1">{txt}</span>
      {onDismiss&&<button onClick={onDismiss} style={{color:'#f87171'}} className="shrink-0 hover:opacity-70">✕</button>}
    </div>
  )
}

export function WebBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono rounded-full px-2 py-0.5"
      style={{background:'#e8f0eb',border:'1px solid #ccddd2',color:'#326944'}}>
      <Globe size={9}/> live
    </span>
  )
}

export function PotentialBadge({ level }) {
  const styles = {
    'High':      {bg:'#f5f0e8',border:'#d9c9a8',color:'#a6884e'},
    'Very High': {bg:'#fce8df',border:'#f0a98f',color:'#a8432a'},
    'Explosive': {bg:'#fee2e2',border:'#fca5a5',color:'#dc2626'},
  }
  const s = styles[level]||styles['High']
  return (
    <span className="text-[11px] font-mono rounded-full px-2.5 py-0.5 border shrink-0"
      style={{background:s.bg,borderColor:s.border,color:s.color}}>
      🔥 {level}
    </span>
  )
}

export function PriorityBadge({ level }) {
  return (
    <span className="text-[10px] font-mono rounded-full px-2 py-0.5 border shrink-0"
      style={level==='High'
        ? {background:'#fce8df',borderColor:'#f0a98f',color:'#a8432a'}
        : {background:'#faf4e8',borderColor:'#edd9b8',color:'#9e8872'}}>
      {level}
    </span>
  )
}

export function SectionCard({ icon, title, subtitle, children, className='' }) {
  return (
    <div className={clsx('card p-6', className)}>
      <div className="flex items-start gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-display text-xl text-ink-900 dark:text-gray-100 leading-tight">{title}</h3>
          {subtitle&&<p className="text-ink-400 dark:text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function Chip({ children, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx('chip', active&&'active')}>
      {children}
    </button>
  )
}

export function BackButton({ onClick, label='Back' }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-300 text-sm transition-colors mb-6">
      ← {label}
    </button>
  )
}

export function InfoRow({ label, value, color='terra' }) {
  const colors = {terra:'text-terra-600 dark:text-terra-300', sage:'text-sage-600 dark:text-sage-300', sand:'text-sand-500 dark:text-sand-400'}
  return (
    <div className="flex gap-2 items-start text-sm">
      <span className="text-terra-300 shrink-0 mt-0.5">→</span>
      <div><span className="text-ink-400 dark:text-gray-500 mr-1.5">{label}:</span><span className={clsx('text-ink-700 dark:text-gray-300', colors[color]&&'')}>{value}</span></div>
    </div>
  )
}
