import { useState } from 'react'
import { RotateCcw, Copy, Check, RefreshCw } from 'lucide-react'
import { AriaAvatar, AriaSays, SectionCard, PotentialBadge, PriorityBadge, WebBadge, Spinner } from './UI'
import clsx from 'clsx'

const FORMAT_EMOJI = { 'Face to Camera':'🎤','Text on Screen + Music':'✍️','Voiceover + B-roll':'🎙️','Tutorial':'📋','POV / Skit':'🎭','Trend':'🔥' }
const DAY_COLORS   = ['bg-terra-100 text-terra-700','bg-sage-100 text-sage-700','bg-sand-100 text-sand-700','bg-cream-200 text-ink-600','bg-terra-100 text-terra-700','bg-sage-100 text-sage-700','bg-cream-100 text-ink-500']

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function doCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }
  return (
    <button onClick={doCopy} className="btn-primary py-2.5 flex-1 text-xs flex items-center justify-center gap-1.5">
      {copied ? <><Check size={13}/> Copied!</> : <><Copy size={13}/> Copy Script</>}
    </button>
  )
}

function ScriptPanel({ ideaTitle, scriptState, onGenerate }) {
  if (!scriptState && !ideaTitle) return null
  const { loading, data, error } = scriptState || {}

  return (
    <div className="mt-4 border-t border-cream-200 dark:border-gray-700 pt-4">
      {!scriptState && (
        <button onClick={onGenerate} className="btn-primary w-full py-2.5 text-sm">
          ✍️ Generate Full Script
        </button>
      )}
      {loading && (
        <div className="flex justify-center py-4"><Spinner text="Writing your script…" size="sm" /></div>
      )}
      {error && (
        <div className="text-center py-3">
          <p className="text-red-500 text-sm mb-2">Script failed to generate.</p>
          <button onClick={onGenerate} className="btn-secondary py-2 px-4 text-xs">Try again</button>
        </div>
      )}
      {data && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <p className="label-tag text-terra-500">✍️ Script · <span className="font-mono">{data.duration}</span></p>
            <button onClick={onGenerate} className="text-xs text-ink-400 dark:text-gray-500 hover:text-ink-600 flex items-center gap-1">
              <RefreshCw size={11}/> Redo
            </button>
          </div>

          <div className="rounded-2xl p-3.5 border border-terra-200 dark:border-terra-800 bg-terra-50 dark:bg-terra-950">
            <p className="label-tag mb-1.5 text-terra-500">🎬 Hook — First 3 seconds</p>
            <p className="text-ink-800 dark:text-gray-200 text-sm font-semibold leading-relaxed">"{data.hook}"</p>
          </div>

          <div className="rounded-2xl p-3.5 border border-cream-200 dark:border-gray-700 bg-cream-50 dark:bg-gray-800">
            <p className="label-tag mb-2">📢 Body</p>
            {data.body?.map((pt, i) => (
              <div key={i} className="flex gap-2.5 text-sm text-ink-700 dark:text-gray-300 mb-2 last:mb-0">
                <span className="text-ink-300 dark:text-gray-600 font-mono shrink-0 mt-0.5">{i+1}.</span>
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-3.5 border border-sage-200 dark:border-sage-800 bg-sage-50 dark:bg-sage-950">
            <p className="label-tag mb-1.5 text-sage-600">📣 CTA</p>
            <p className="text-ink-800 dark:text-gray-200 text-sm font-semibold leading-relaxed">"{data.cta}"</p>
          </div>

          {data.tip && (
            <div className="rounded-2xl p-3 border border-sand-200 dark:border-gray-700 bg-sand-50 dark:bg-gray-800">
              <p className="label-tag mb-1 text-sand-500">💡 Delivery Tip</p>
              <p className="text-ink-500 dark:text-gray-400 text-xs leading-relaxed">{data.tip}</p>
            </div>
          )}

          <CopyButton text={`HOOK:\n"${data.hook}"\n\nBODY:\n${data.body?.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\nCTA:\n"${data.cta}"\n\nTIP: ${data.tip}`} />
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ profile, strategy, webUsed, onReset, generateScript, generateNewIdeas, scripts, loadingNewIdeas }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [confirmReset, setConfirmReset] = useState(false)

  const tabs = [
    {id:'overview', label:'Overview', emoji:'✦'},
    {id:'brand',    label:'Brand',    emoji:'🎨'},
    {id:'growth',   label:'Growth',   emoji:'📈'},
    {id:'calendar', label:'Calendar', emoji:'📅'},
    {id:'ideas',    label:'Ideas',    emoji:'💡'},
    {id:'tips',     label:'Tips',     emoji:'⚡'},
  ]

  const savedAt = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('aria_user_data')||'{}')
      return d.savedAt ? new Date(d.savedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : null
    } catch { return null }
  })()

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-cream-50/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-cream-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AriaAvatar size="sm" />
            <div className="min-w-0">
              <p className="font-display text-sm text-ink-800 dark:text-gray-200 leading-none truncate">Aria for {profile.name}</p>
              {savedAt && <p className="text-[10px] text-ink-300 dark:text-gray-600 font-mono mt-0.5 truncate">saved {savedAt}</p>}
            </div>
          </div>

          {/* Controls — no overlap issues */}
          <div className="flex items-center gap-2 shrink-0">
            {webUsed && <WebBadge />}
            {confirmReset ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-ink-500 dark:text-gray-400 hidden sm:inline">Sure?</span>
                <button onClick={onReset} className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-xl px-2.5 py-1.5">Yes</button>
                <button onClick={()=>setConfirmReset(false)} className="text-xs text-ink-400 border border-cream-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5">No</button>
              </div>
            ) : (
              <button onClick={()=>setConfirmReset(true)} className="text-xs text-ink-400 dark:text-gray-500 hover:text-ink-600 dark:hover:text-gray-300 border border-cream-300 dark:border-gray-700 rounded-xl px-3 py-1.5 transition-all">
                New profile
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar pb-2 pt-1">
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                activeTab===t.id ? 'tab-active' : 'tab-idle'
              )}>
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-4">

        {/* OVERVIEW */}
        {activeTab==='overview' && (
          <div className="animate-fade-up space-y-4">
            <div className="card p-6">
              <AriaSays>{strategy.greeting}</AriaSays>
              {savedAt && (
                <div className="flex items-center gap-2 mt-4 bg-sage-50 dark:bg-sage-950 border border-sage-100 dark:border-sage-900 rounded-2xl px-4 py-2.5">
                  <span className="text-sage-500 text-sm">💾</span>
                  <p className="text-sage-700 dark:text-sage-300 text-xs">Session restored from {savedAt}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {label:'Platform', value:profile.platforms?.[0]},
                  {label:'Followers', value:profile.followers},
                  {label:'Posting', value:profile.postingFreq?.split(' ').slice(0,2).join(' ')},
                  {label:'Goal', value:profile.goal?.split(' ').slice(0,3).join(' ')+'…'},
                ].map(s=>(
                  <div key={s.label} className="bg-cream-50 dark:bg-gray-800 rounded-2xl p-3 border border-cream-200 dark:border-gray-700 text-center">
                    <p className="label-tag mb-1">{s.label}</p>
                    <p className="text-ink-800 dark:text-gray-200 text-sm font-semibold leading-snug">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {tab:'brand',    emoji:'🎨', title:'Brand Voice',      sub:`${strategy.brandVoice?.pillars?.length||3} pillars defined`},
                {tab:'growth',   emoji:'📈', title:'Growth Strategy',  sub:`${strategy.growthStrategy?.tactics?.length||4} tactics`},
                {tab:'calendar', emoji:'📅', title:'7-Day Calendar',   sub:'Ready to post'},
                {tab:'ideas',    emoji:'💡', title:'Content Ideas',    sub:`${strategy.contentIdeas?.length||6} ideas + scripts`},
              ].map(c=>(
                <button key={c.tab} onClick={()=>setActiveTab(c.tab)}
                  className="card p-5 text-left hover:shadow-warm-lg transition-all active:scale-[0.98] group">
                  <span className="text-2xl mb-2 block">{c.emoji}</span>
                  <p className="font-display text-base text-ink-800 dark:text-gray-200 mb-0.5">{c.title}</p>
                  <p className="text-xs text-ink-400 dark:text-gray-500 group-hover:text-terra-500 transition-colors">{c.sub}</p>
                </button>
              ))}
            </div>

            <SectionCard icon="⚡" title="This Week's Quick Wins">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w,i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-sage-200 dark:bg-sage-800 text-sage-700 dark:text-sage-300 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">{i+1}</span>
                    <p className="text-ink-700 dark:text-gray-300 text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="card p-5">
              <div className="flex gap-2 items-center mb-3">
                <span className="text-xl">🎯</span>
                <p className="font-display text-base text-ink-900 dark:text-gray-100">Fix: {profile.struggle}</p>
              </div>
              <p className="text-ink-600 dark:text-gray-400 text-sm leading-relaxed">{strategy.performanceTips?.struggleFix}</p>
              <button onClick={()=>setActiveTab('tips')} className="mt-3 text-xs text-terra-500 hover:text-terra-600 font-medium">See all tips →</button>
            </div>
          </div>
        )}

        {/* BRAND */}
        {activeTab==='brand' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="🎨" title="Your Brand Voice" subtitle="What makes you, you.">
              <div className="mb-5">
                <p className="label-tag mb-2">Your unique angle</p>
                <p className="text-ink-700 dark:text-gray-300 text-sm bg-terra-50 dark:bg-terra-950 rounded-2xl p-4 border border-terra-100 dark:border-terra-900 leading-relaxed italic">
                  "{strategy.brandVoice?.uniqueAngle}"
                </p>
              </div>
              <div className="mb-5">
                <p className="label-tag mb-3">Tone of voice</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.brandVoice?.tone?.map(t=>(
                    <span key={t} className="bg-sand-100 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 text-sand-600 dark:text-sand-300 text-sm rounded-full px-3 py-1.5">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-tag mb-2">What to avoid</p>
                {strategy.brandVoice?.avoid?.map(a=>(
                  <div key={a} className="flex gap-2 items-start text-sm text-ink-500 dark:text-gray-400 mb-1.5">
                    <span className="text-terra-300 shrink-0">✕</span>{a}
                  </div>
                ))}
              </div>
            </SectionCard>
            <p className="label-tag px-1">Content pillars</p>
            {strategy.brandVoice?.pillars?.map((p,i)=>(
              <div key={i} className="card p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-cream-100 dark:bg-gray-800 border border-cream-200 dark:border-gray-700 flex items-center justify-center text-2xl shrink-0">{p.emoji}</div>
                <div>
                  <p className="font-display text-base text-ink-900 dark:text-gray-100 mb-1">{p.name}</p>
                  <p className="text-ink-500 dark:text-gray-400 text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GROWTH */}
        {activeTab==='growth' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="📈" title="Growth Strategy">
              <p className="text-ink-600 dark:text-gray-400 text-sm leading-relaxed mb-5">{strategy.growthStrategy?.summary}</p>
              <div className="space-y-3">
                {strategy.growthStrategy?.tactics?.map((t,i)=>(
                  <div key={i} className="bg-cream-50 dark:bg-gray-800 rounded-2xl p-4 border border-cream-200 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-display text-base text-ink-800 dark:text-gray-200">{t.title}</p>
                      <PriorityBadge level={t.priority} />
                    </div>
                    <p className="text-ink-500 dark:text-gray-400 text-sm leading-relaxed mb-2">{t.description}</p>
                    <p className="text-[11px] font-mono text-ink-300 dark:text-gray-600">⏱ {t.timeframe}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="⏰" title="Posting Schedule">
              <div className="mb-4">
                <p className="label-tag mb-2">Recommended frequency</p>
                <p className="text-ink-700 dark:text-gray-300 text-sm bg-sand-50 dark:bg-gray-800 rounded-xl p-3 border border-sand-100 dark:border-gray-700 leading-relaxed">{strategy.growthStrategy?.postingSchedule?.frequency}</p>
              </div>
              <div className="mb-4">
                <p className="label-tag mb-2">Best times</p>
                {strategy.growthStrategy?.postingSchedule?.bestTimes?.map((t,i)=>(
                  <div key={i} className="flex gap-2 text-sm text-ink-600 dark:text-gray-400 mb-1.5">
                    <span className="text-terra-400 shrink-0">→</span>{t}
                  </div>
                ))}
              </div>
              <div className="bg-sage-50 dark:bg-sage-950 rounded-xl p-3 border border-sage-100 dark:border-sage-900">
                <p className="label-tag mb-1 text-sage-600">Consistency tip</p>
                <p className="text-ink-600 dark:text-gray-400 text-sm leading-relaxed">{strategy.growthStrategy?.postingSchedule?.consistency}</p>
              </div>
            </SectionCard>
          </div>
        )}

        {/* CALENDAR */}
        {activeTab==='calendar' && (
          <div className="animate-fade-up space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-display text-xl text-ink-900 dark:text-gray-100">Weekly Calendar</h2>
              <span className="label-tag">7-day plan</span>
            </div>
            {strategy.calendar?.map((day,i)=>(
              <div key={day.day} className={clsx('card p-5', day.day==='Sunday'&&'opacity-70')}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0', DAY_COLORS[i]||DAY_COLORS[0])}>
                    {day.day.slice(0,3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base text-ink-900 dark:text-gray-100">{day.day}</p>
                    <p className="text-xs text-ink-400 dark:text-gray-500 truncate">{day.theme}</p>
                  </div>
                  {day.format&&day.format!=='optional'&&<span className="text-xl shrink-0">{FORMAT_EMOJI[day.format]||'📹'}</span>}
                </div>
                {day.idea&&<>
                  <p className="text-ink-700 dark:text-gray-300 text-sm font-medium mb-1.5 leading-snug">{day.idea}</p>
                  {day.hook&&<p className="text-ink-400 dark:text-gray-500 text-xs italic mb-3">"{day.hook}"</p>}
                  {day.caption&&(
                    <div className="bg-cream-50 dark:bg-gray-800 rounded-xl p-3 border border-cream-200 dark:border-gray-700">
                      <p className="label-tag mb-1">Caption tip</p>
                      <p className="text-ink-500 dark:text-gray-400 text-xs leading-relaxed">{day.caption}</p>
                    </div>
                  )}
                </>}
              </div>
            ))}
          </div>
        )}

        {/* IDEAS */}
        {activeTab==='ideas' && (
          <div className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-xl text-ink-900 dark:text-gray-100">Content Ideas</h2>
                <p className="text-ink-400 dark:text-gray-500 text-xs mt-0.5">Tap "Generate Script" on any idea</p>
              </div>
              <button
                onClick={generateNewIdeas}
                disabled={loadingNewIdeas}
                className="flex items-center gap-1.5 btn-secondary py-2 px-3 text-xs disabled:opacity-50"
              >
                <RotateCcw size={12} className={loadingNewIdeas?'animate-spin':''} />
                {loadingNewIdeas ? 'Finding ideas…' : 'New Ideas'}
              </button>
            </div>

            {loadingNewIdeas && (
              <div className="card p-6 flex justify-center">
                <Spinner text="Finding fresh content ideas…" />
              </div>
            )}

            {!loadingNewIdeas && strategy.contentIdeas?.map((idea,i)=>{
              const scriptState = scripts[idea.title]
              return (
                <div key={i} className="card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{idea.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base text-ink-900 dark:text-gray-100 mb-1 leading-snug">{idea.title}</p>
                      <p className="text-ink-400 dark:text-gray-500 text-sm italic leading-relaxed">"{idea.hook}"</p>
                    </div>
                    <PotentialBadge level={idea.potential} />
                  </div>

                  <div className="bg-cream-50 dark:bg-gray-800 rounded-xl p-3 border border-cream-200 dark:border-gray-700 mb-3">
                    <p className="label-tag mb-1">Why this works for you</p>
                    <p className="text-ink-600 dark:text-gray-400 text-xs leading-relaxed">{idea.why}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-300 dark:text-gray-600">{FORMAT_EMOJI[idea.format]||'📹'} {idea.format}</span>
                  </div>

                  <ScriptPanel
                    ideaTitle={idea.title}
                    scriptState={scriptState}
                    onGenerate={()=>generateScript(idea)}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* TIPS */}
        {activeTab==='tips' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="🎯" title="Fix Your Biggest Struggle" subtitle={profile.struggle}>
              <p className="text-ink-700 dark:text-gray-300 text-sm leading-relaxed bg-terra-50 dark:bg-terra-950 rounded-2xl p-4 border border-terra-100 dark:border-terra-900">
                {strategy.performanceTips?.struggleFix}
              </p>
            </SectionCard>
            <SectionCard icon="🚀" title="Level Up Advice" subtitle={`For ${profile.followers} followers`}>
              <p className="text-ink-700 dark:text-gray-300 text-sm leading-relaxed">{strategy.performanceTips?.levelUpTip}</p>
            </SectionCard>
            <SectionCard icon="📊" title="Metrics to Track">
              <div className="space-y-3">
                {strategy.performanceTips?.metrics?.map((m,i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-sand-100 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 flex items-center justify-center text-xs text-sand-600 dark:text-sand-300 font-bold shrink-0 mt-0.5">{i+1}</span>
                    <p className="text-ink-600 dark:text-gray-400 text-sm leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard icon="⚡" title="Quick Wins This Week">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w,i)=>(
                  <div key={i} className="flex gap-3 items-start bg-cream-50 dark:bg-gray-800 rounded-2xl p-3.5 border border-cream-200 dark:border-gray-700">
                    <span className="w-5 h-5 rounded-full bg-terra-200 dark:bg-terra-800 text-terra-700 dark:text-terra-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                    <p className="text-ink-700 dark:text-gray-300 text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

      </main>
    </div>
  )
}
