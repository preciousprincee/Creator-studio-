import { Loader2, Globe } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ text='Working...', size='md' }) {
  return (
    <div className="flex items-center gap-2.5">
      <Loader2 size={size==='sm'?14:18} className="animate-spin" style={{color:'var(--terra)'}}/>
      <span className="text-sm tm">{text}</span>
    </div>
  )
}

export function AriaAvatar({ size='md', pulse=false }) {
  const sz = {sm:'w-8 h-8 text-sm', md:'w-10 h-10 text-lg', lg:'w-16 h-16 text-3xl'}[size]
  return (
    <div className={clsx(sz,'rounded-full flex items-center justify-center shrink-0 font-display', pulse&&'animate-bounce-soft')}
      style={{background:'linear-gradient(135deg,var(--terra-bg),var(--sand-bg))'}}>
      ✦
    </div>
  )
}

export function AriaSays({ children, loading=false }) {
  return (
    <div className="flex gap-3 items-start">
      <AriaAvatar/>
      <div className="aria-bubble flex-1">
        {loading ? <span className="tm italic">Aria is thinking<span className="dot-typing"/></span> : children}
      </div>
    </div>
  )
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  const txt = message==='NO_API_KEY' ? 'No Groq API key. Tap ⚙️ and paste your key.'
            : message==='INVALID_KEY' ? 'Invalid API key. Check Settings.'
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
    <span className="inline-flex items-center gap-1 text-[10px] font-mono rounded-full px-2 py-0.5 block-sage"
      style={{color:'var(--sage-text)'}}>
      <Globe size={9}/> live
    </span>
  )
}

export function PotentialBadge({ level }) {
  const map = {
    'High':      {bg:'var(--sand-bg)',  border:'var(--sand-bdr)',  color:'var(--sand-text)'},
    'Very High': {bg:'var(--terra-bg)', border:'var(--terra-bdr)', color:'var(--terra-text)'},
    'Explosive': {bg:'var(--terra-bg)', border:'var(--terra-bdr)', color:'var(--terra-text)'},
  }
  const s = map[level]||map['High']
  return (
    <span className="text-[11px] font-mono rounded-full px-2.5 py-0.5 border shrink-0"
      style={{background:s.bg, borderColor:s.border, color:s.color}}>
      🔥 {level}
    </span>
  )
}

export function PriorityBadge({ level }) {
  return (
    <span className="text-[10px] font-mono rounded-full px-2 py-0.5 border shrink-0"
      style={level==='High'
        ? {background:'var(--terra-bg)',border:'1px solid var(--terra-bdr)',color:'var(--terra-text)'}
        : {background:'var(--surface2)',border:'1px solid var(--border2)',color:'var(--text-muted)'}}>
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
          <h3 className="font-display text-xl t1 leading-tight">{title}</h3>
          {subtitle&&<p className="text-sm tm mt-0.5">{subtitle}</p>}
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
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm tm hover:t2 transition-colors mb-6">
      ← {label}
    </button>
  )
}
