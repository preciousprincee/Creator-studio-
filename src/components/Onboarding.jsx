import { useState } from 'react'
import { AriaSays, Chip, ErrorBanner, Spinner } from './UI'
import clsx from 'clsx'

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn']
const FOLLOWERS = ['0–1K', '1K–10K', '10K–50K', '50K–100K', '100K+']
const FREQ      = ['Never / just starting', '1–2x per week', '3–4x per week', 'Daily']
const STRUGGLES = ['Coming up with ideas', 'Getting more views', 'Building engagement', 'Staying consistent', 'Finding my niche', 'Converting followers', 'Going viral']
const GOALS     = ['Grow my following fast', 'Build a personal brand', 'Make money from content', 'Educate my audience', 'Become an authority', 'Just have fun & create']
const STYLES    = ['Funny & entertaining', 'Educational & informative', 'Inspirational & motivational', 'Raw & authentic', 'Polished & aesthetic', 'Conversational & chatty']
const STEPS     = ['welcome','name','platforms','niche','followers','frequency','struggle','goal','style','review']

export default function Onboarding({ onComplete, loading, error, onClearError }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name:'', platforms:[], niche:'', followers:'', postingFreq:'', struggle:'', goal:'', style:'' })

  const stepName = STEPS[step]
  const progress = (step / (STEPS.length - 1)) * 100
  function next()       { setStep(s => Math.min(s+1, STEPS.length-1)) }
  function back()       { setStep(s => Math.max(s-1, 0)) }
  function set(k,v)     { setForm(f => ({...f,[k]:v})) }
  function toggle(k,v)  { setForm(f => ({...f,[k]: f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]})) }

  const row = (active) => clsx(
    'w-full text-left px-5 py-3.5 rounded-2xl border text-sm transition-all',
    active ? 'bg-terra-50 dark:bg-terra-900 border-terra-300 dark:border-terra-600 text-terra-700 dark:text-terra-200 font-medium'
           : 'bg-white dark:bg-gray-800 border-cream-300 dark:border-gray-600 text-ink-600 dark:text-gray-300 hover:border-terra-200'
  )

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950 flex flex-col">
      {step > 0 && step < STEPS.length-1 && (
        <div className="h-1 bg-cream-200 dark:bg-gray-800">
          <div className="h-1 bg-terra-300 transition-all duration-500" style={{width:`${progress}%`}} />
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {stepName === 'welcome' && (
            <div className="animate-fade-up text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm flex items-center justify-center text-4xl font-display mx-auto mb-6">✦</div>
              <h1 className="font-display text-4xl text-ink-900 dark:text-gray-100 mb-2">Meet Aria</h1>
              <p className="font-display italic text-lg text-ink-400 dark:text-gray-500 mb-6">Your personal content strategist</p>
              <div className="card p-6 mb-8 text-left">
                <AriaSays>Hey! I'm Aria 👋 Think of me as your personal guide to growing on TikTok and Reels. I'll build you a custom strategy, 7-day calendar, content ideas, and scripts — all based on <em>your</em> specific situation. Let's get started!</AriaSays>
              </div>
              <button onClick={next} className="btn-primary w-full py-4 text-base">Let's build my strategy →</button>
              <p className="text-ink-300 dark:text-gray-600 text-xs mt-3">Takes about 2 minutes</p>
            </div>
          )}

          {stepName === 'name' && (
            <div className="animate-fade-up">
              <AriaSays>First — what should I call you? 😊</AriaSays>
              <div className="mt-6">
                <input autoFocus value={form.name} onChange={e=>set('name',e.target.value)} onKeyDown={e=>e.key==='Enter'&&form.name.trim()&&next()} placeholder="Your name or creator handle..." className="input text-base py-4" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.name.trim()} className="btn-primary flex-1">That's me →</button>
              </div>
            </div>
          )}

          {stepName === 'platforms' && (
            <div className="animate-fade-up">
              <AriaSays>Nice to meet you, {form.name}! 🎉 Which platforms are you on?</AriaSays>
              <div className="flex flex-wrap gap-2 mt-6 mb-6">
                {PLATFORMS.map(p=><Chip key={p} active={form.platforms.includes(p)} onClick={()=>toggle('platforms',p)}>{p}</Chip>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.platforms.length} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'niche' && (
            <div className="animate-fade-up">
              <AriaSays>What's your content about? Be specific — the more detail, the better your strategy. 🎯</AriaSays>
              <div className="mt-6 mb-2">
                <textarea autoFocus value={form.niche} onChange={e=>set('niche',e.target.value)} placeholder="e.g. Budget cooking for college students — quick meals under $5 that actually taste great..." rows={4} className="input resize-none leading-relaxed" />
                <p className={clsx('text-right text-xs mt-1.5 font-mono', form.niche.length>15?'text-sage-500':'text-ink-300 dark:text-gray-600')}>
                  {form.niche.length} chars {form.niche.length>15?'✓':''}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={form.niche.trim().length<10} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'followers' && (
            <div className="animate-fade-up">
              <AriaSays>Where are you at with followers? No judgment — this helps me calibrate your strategy. 📊</AriaSays>
              <div className="flex flex-wrap gap-2 mt-6 mb-6">
                {FOLLOWERS.map(f=><Chip key={f} active={form.followers===f} onClick={()=>set('followers',f)}>{f} followers</Chip>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.followers} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'frequency' && (
            <div className="animate-fade-up">
              <AriaSays>How often are you posting right now? Be honest — I'll build around your real capacity. 📅</AriaSays>
              <div className="flex flex-col gap-2 mt-6 mb-6">
                {FREQ.map(f=><button key={f} onClick={()=>set('postingFreq',f)} className={row(form.postingFreq===f)}>{f}</button>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.postingFreq} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'struggle' && (
            <div className="animate-fade-up">
              <AriaSays>What's your biggest challenge right now? I'll tackle it head-on in your strategy. 💪</AriaSays>
              <div className="flex flex-wrap gap-2 mt-6 mb-6">
                {STRUGGLES.map(s=><Chip key={s} active={form.struggle===s} onClick={()=>set('struggle',s)}>{s}</Chip>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.struggle} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'goal' && (
            <div className="animate-fade-up">
              <AriaSays>What's the main thing you want to achieve? 🎯</AriaSays>
              <div className="flex flex-col gap-2 mt-6 mb-6">
                {GOALS.map(g=><button key={g} onClick={()=>set('goal',g)} className={row(form.goal===g)}>{g}</button>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.goal} className="btn-primary flex-1">Continue →</button>
              </div>
            </div>
          )}

          {stepName === 'style' && (
            <div className="animate-fade-up">
              <AriaSays>Last one — what's your content vibe? 🎨</AriaSays>
              <div className="flex flex-wrap gap-2 mt-6 mb-6">
                {STYLES.map(s=><Chip key={s} active={form.style===s} onClick={()=>set('style',s)}>{s}</Chip>)}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary px-5">←</button>
                <button onClick={next} disabled={!form.style} className="btn-primary flex-1">See my strategy →</button>
              </div>
            </div>
          )}

          {stepName === 'review' && (
            <div className="animate-fade-up">
              <AriaSays>Perfect, {form.name}! Building your personalised strategy now ✨</AriaSays>
              <div className="card p-5 mt-6 mb-6 space-y-3">
                {[['Creator',form.name],['Platforms',form.platforms.join(', ')],['Niche',form.niche],['Followers',form.followers],['Posting',form.postingFreq],['Struggle',form.struggle],['Goal',form.goal],['Style',form.style]].map(([label,val])=>(
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="label-tag w-20 shrink-0 pt-0.5">{label}</span>
                    <span className="text-ink-700 dark:text-gray-300 leading-snug">{val}</span>
                  </div>
                ))}
              </div>
              {error && <div className="mb-4"><ErrorBanner message={error} onDismiss={onClearError} /></div>}
              {loading
                ? <div className="flex flex-col items-center gap-3 py-4">
                    <Spinner text="Aria is crafting your strategy…" />
                    <p className="text-xs text-ink-300 dark:text-gray-600 font-mono">Searching trends · building your plan</p>
                  </div>
                : <div className="flex gap-3">
                    <button onClick={back} className="btn-secondary px-5">Edit</button>
                    <button onClick={()=>onComplete(form)} className="btn-primary flex-1 py-4">Build my strategy ✦</button>
                  </div>
              }
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
