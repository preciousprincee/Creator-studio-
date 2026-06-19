import { useState } from 'react'
import { RotateCcw, Copy, Check, RefreshCw, Users } from 'lucide-react'
import { AriaAvatar, AriaSays, SectionCard, PotentialBadge, PriorityBadge, WebBadge, Spinner } from './UI'
import clsx from 'clsx'

const FORMAT_EMOJI = {'Face to Camera':'🎤','Text on Screen + Music':'✍️','Voiceover + B-roll':'🎙️','Tutorial':'📋','POV / Skit':'🎭','Trend':'🔥','optional':''}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={()=>{navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
      className="btn-primary text-xs flex items-center justify-center gap-1.5 w-full py-2.5">
      {copied ? <><Check size={13}/> Copied!</> : <><Copy size={13}/> Copy Script</>}
    </button>
  )
}

function ScriptPanel({ scriptState, onGenerate }) {
  const { loading, data, error } = scriptState || {}
  if (!scriptState) return (
    <div className="mt-4 pt-4" style={{borderTop:'1px solid var(--border)'}}>
      <button onClick={onGenerate} className="btn-primary w-full py-2.5 text-sm">✍️ Generate Full Script</button>
    </div>
  )
  return (
    <div className="mt-4 pt-4 space-y-3" style={{borderTop:'1px solid var(--border)'}}>
      {loading && <div className="flex justify-center py-3"><Spinner text="Writing your script…" size="sm"/></div>}
      {error && <div className="text-center py-2"><p className="text-sm mb-2 t3">Failed. <button onClick={onGenerate} className="underline">Retry</button></p></div>}
      {data && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="label-tag" style={{color:'var(--terra-text)'}}>✍️ Script · {data.duration}</p>
            <button onClick={onGenerate} className="text-xs flex items-center gap-1 tm hover:opacity-70"><RefreshCw size={11}/> Redo</button>
          </div>
          <div className="rounded-2xl p-3.5 block-terra">
            <p className="label-tag mb-1.5" style={{color:'var(--terra-text)'}}>🎬 Hook — First 3 seconds</p>
            <p className="text-sm font-bold leading-relaxed t1">"{data.hook}"</p>
          </div>
          {data.setup && (
            <div className="rounded-2xl p-3.5 block-base">
              <p className="label-tag mb-1" style={{color:'var(--sand-text)'}}>⚡ Setup</p>
              <p className="text-sm leading-relaxed t2">{data.setup}</p>
            </div>
          )}
          <div className="rounded-2xl p-3.5 block-base">
            <p className="label-tag mb-2 tm">📢 Body</p>
            <div className="space-y-2">
              {data.body?.map((pt,i)=>(
                <div key={i} className="flex gap-2.5 text-sm t2">
                  <span className="font-mono shrink-0 mt-0.5 tf">{i+1}.</span>
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
          {data.payoff && (
            <div className="rounded-2xl p-3.5 block-sage">
              <p className="label-tag mb-1" style={{color:'var(--sage-text)'}}>🎯 Payoff</p>
              <p className="text-sm font-medium leading-relaxed t1">{data.payoff}</p>
            </div>
          )}
          <div className="rounded-2xl p-3.5 block-sage">
            <p className="label-tag mb-1" style={{color:'var(--sage-text)'}}>📣 CTA</p>
            <p className="text-sm font-bold leading-relaxed t1">"{data.cta}"</p>
          </div>
          {data.editingTips?.length > 0 && (
            <div className="rounded-2xl p-3.5 block-sand">
              <p className="label-tag mb-2" style={{color:'var(--sand-text)'}}>🎞️ Editing Tips</p>
              <div className="space-y-1.5">
                {data.editingTips.map((t,i)=>(
                  <div key={i} className="flex gap-2 text-xs t3"><span className="tf">•</span>{t}</div>
                ))}
              </div>
            </div>
          )}
          {data.captionSuggestion && (
            <div className="rounded-2xl p-3.5 block-base">
              <p className="label-tag mb-1 tm">📝 Caption</p>
              <p className="text-xs leading-relaxed t3">{data.captionSuggestion}</p>
            </div>
          )}
          <CopyBtn text={[
            `HOOK: "${data.hook}"`,
            data.setup?`\nSETUP: ${data.setup}`:'',
            `\nBODY:\n${data.body?.map((p,i)=>`${i+1}. ${p}`).join('\n')}`,
            data.payoff?`\nPAYOFF: ${data.payoff}`:'',
            `\nCTA: "${data.cta}"`,
            data.editingTips?.length?`\nEDITING:\n${data.editingTips.map(t=>`• ${t}`).join('\n')}` : '',
            data.captionSuggestion?`\nCAPTION:\n${data.captionSuggestion}`:'',
          ].filter(Boolean).join('')}/>
        </div>
      )}
    </div>
  )
}

function CompetitorCard({ c }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button onClick={()=>setOpen(o=>!o)} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 block-terra"
              style={{fontSize:18}}>{c.name?.charAt(0)||'?'}</div>
            <div className="min-w-0">
              <p className="font-display text-base t1 leading-tight">{c.name}</p>
              <p className="text-xs mt-0.5 tm">{c.platform} · {c.followers}</p>
              <p className="text-xs mt-1 t3 truncate">{c.niche}</p>
            </div>
          </div>
          <span className="tf text-sm shrink-0">{open?'▲':'▼'}</span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 animate-fade-in" style={{borderTop:'1px solid var(--border)'}}>
          <div className="pt-4 space-y-3">
            <div><p className="label-tag mb-0.5">Content style</p><p className="text-sm t2 leading-relaxed">{c.contentStyle}</p></div>
            <div><p className="label-tag mb-0.5">Posts</p><p className="text-sm t2">{c.postingFreq}</p></div>
            <div>
              <p className="label-tag mb-1.5">Top formats</p>
              <div className="flex flex-wrap gap-1.5">
                {c.topFormats?.map(f=>(
                  <span key={f} className="text-xs rounded-full px-2.5 py-1 block-base t3">{FORMAT_EMOJI[f]||'📹'} {f}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-3 block-sage">
              <p className="label-tag mb-1" style={{color:'var(--sage-text)'}}>✅ Why they work</p>
              <p className="text-sm t2 leading-relaxed">{c.whatWorks}</p>
            </div>
            <div className="rounded-xl p-3 block-terra">
              <p className="label-tag mb-1" style={{color:'var(--terra-text)'}}>🪝 Signature hook</p>
              <p className="text-sm italic t2">"{c.signatureHook}"</p>
            </div>
            <div className="rounded-xl p-3 block-sand">
              <p className="label-tag mb-1" style={{color:'var(--sand-text)'}}>⚠️ Their weakness</p>
              <p className="text-sm t3">{c.weaknesses}</p>
            </div>
            <div className="rounded-xl p-3 block-sage">
              <p className="label-tag mb-1" style={{color:'var(--sage-text)'}}>💡 Steal this idea (put your spin on it)</p>
              <p className="text-sm font-medium t1">{c.inspireIdea}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ profile, strategy, competitors, webUsed, onReset, scripts, loadingNewIdeas, loadingCompetitors, generateScript, generateNewIdeas, generateCompetitors }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [confirmReset, setConfirmReset] = useState(false)

  const tabs = [
    {id:'overview',    label:'Overview',    emoji:'✦'},
    {id:'brand',       label:'Brand',       emoji:'🎨'},
    {id:'growth',      label:'Growth',      emoji:'📈'},
    {id:'calendar',    label:'Calendar',    emoji:'📅'},
    {id:'ideas',       label:'Ideas',       emoji:'💡'},
    {id:'competitors', label:'Competitors', emoji:'🔍'},
    {id:'tips',        label:'Tips',        emoji:'⚡'},
  ]

  const savedAt = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('aria_user_data')||'{}')
      return d.savedAt ? new Date(d.savedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : null
    } catch { return null }
  })()

  return (
    <div className="min-h-screen" style={{background:'var(--bg)'}}>
      {/* ── HEADER ── */}
      <header className="header-bg sticky top-0 z-40" style={{borderBottom:'1px solid var(--border)'}}>

        {/* Row 1: Avatar + name | New profile button */}
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3" style={{height:56}}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <AriaAvatar size="sm"/>
            <div className="min-w-0">
              <p className="font-display text-sm t1 leading-none truncate">Aria for {profile.name}</p>
              {savedAt && <p className="text-[10px] tf font-mono mt-0.5">saved {savedAt}</p>}
            </div>
          </div>

          {/* Status badges + New Profile — these live ONLY here, not in the floating toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            {webUsed && <WebBadge/>}
            {!confirmReset ? (
              <button onClick={()=>setConfirmReset(true)}
                className="text-xs px-3 py-1.5 rounded-xl tm hover:t2 transition-colors"
                style={{border:'1px solid var(--border2)'}}>
                New profile
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-xs tm hidden sm:inline">Reset?</span>
                <button onClick={onReset} className="text-xs px-2.5 py-1.5 rounded-xl" style={{color:'#ef4444',border:'1px solid #fca5a5'}}>Yes</button>
                <button onClick={()=>setConfirmReset(false)} className="text-xs px-2.5 py-1.5 rounded-xl tm" style={{border:'1px solid var(--border2)'}}>No</button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Tab bar */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar pb-2 pt-1">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                activeTab===t.id?'tab-active':'tab-idle')}>
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-4">

        {/* ── OVERVIEW ── */}
        {activeTab==='overview' && (
          <div className="animate-fade-up space-y-4">
            <div className="card p-6">
              <AriaSays>{strategy.greeting}</AriaSays>
              {savedAt && (
                <div className="flex items-center gap-2 mt-4 rounded-2xl px-4 py-2.5 block-sage">
                  <span style={{color:'var(--sage)'}}>💾</span>
                  <p className="text-xs" style={{color:'var(--sage-text)'}}>Session restored · {savedAt}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {label:'Platform',  value:profile.platforms?.[0]},
                  {label:'Followers', value:profile.followers},
                  {label:'Posting',   value:profile.postingFreq?.split(' ').slice(0,2).join(' ')},
                  {label:'Goal',      value:profile.goal?.split(' ').slice(0,3).join(' ')+'…'},
                ].map(s=>(
                  <div key={s.label} className="rounded-2xl p-3 text-center block-base">
                    <p className="label-tag mb-1">{s.label}</p>
                    <p className="text-sm font-semibold leading-snug t1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {tab:'brand',       emoji:'🎨', title:'Brand Voice',    sub:`${strategy.brandVoice?.pillars?.length||3} content pillars`},
                {tab:'growth',      emoji:'📈', title:'Growth Strategy',sub:`${strategy.growthStrategy?.tactics?.length||4} tactics`},
                {tab:'calendar',    emoji:'📅', title:'7-Day Calendar', sub:'Ready to post'},
                {tab:'ideas',       emoji:'💡', title:'Content Ideas',  sub:`${strategy.contentIdeas?.length||6} ideas + scripts`},
                {tab:'competitors', emoji:'🔍', title:'Competitors',    sub:competitors?`${competitors.competitors?.length} analysed`:'Tap to research'},
                {tab:'tips',        emoji:'⚡', title:'Tips & Metrics', sub:'Performance advice'},
              ].map(c=>(
                <button key={c.tab} onClick={()=>setActiveTab(c.tab)}
                  className="card p-4 text-left active:scale-[0.98] group"
                  style={{transition:'box-shadow 0.2s'}}>
                  <span className="text-xl mb-2 block">{c.emoji}</span>
                  <p className="font-display text-sm t1 mb-0.5">{c.title}</p>
                  <p className="text-xs tm">{c.sub}</p>
                </button>
              ))}
            </div>

            <SectionCard icon="⚡" title="This Week's Quick Wins">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w,i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold block-sage" style={{color:'var(--sage-text)'}}>{i+1}</span>
                    <p className="text-sm t2 leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="card p-5">
              <div className="flex gap-2 items-center mb-3">
                <span className="text-xl">🎯</span>
                <p className="font-display text-base t1">Fix: {profile.struggle}</p>
              </div>
              <p className="text-sm t3 leading-relaxed">{strategy.performanceTips?.struggleFix}</p>
              <button onClick={()=>setActiveTab('tips')} className="mt-3 text-xs font-medium" style={{color:'var(--terra)'}}>See all tips →</button>
            </div>
          </div>
        )}

        {/* ── BRAND ── */}
        {activeTab==='brand' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="🎨" title="Your Brand Voice" subtitle="What makes you, you.">
              <div className="mb-5">
                <p className="label-tag mb-2">Your unique angle</p>
                <p className="text-sm italic leading-relaxed p-4 rounded-2xl block-terra" style={{color:'var(--text-2)'}}>
                  "{strategy.brandVoice?.uniqueAngle}"
                </p>
              </div>
              <div className="mb-5">
                <p className="label-tag mb-2">Tone of voice</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.brandVoice?.tone?.map(t=>(
                    <span key={t} className="text-sm rounded-full px-3 py-1.5 block-sand" style={{color:'var(--sand-text)'}}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-tag mb-2">What to avoid</p>
                {strategy.brandVoice?.avoid?.map(a=>(
                  <div key={a} className="flex gap-2 items-start text-sm t3 mb-1.5">
                    <span style={{color:'var(--terra-bdr)'}}>✕</span>{a}
                  </div>
                ))}
              </div>
            </SectionCard>
            <p className="label-tag px-1">Content pillars</p>
            {strategy.brandVoice?.pillars?.map((p,i)=>(
              <div key={i} className="card p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 block-base">{p.emoji}</div>
                <div>
                  <p className="font-display text-base t1 mb-1">{p.name}</p>
                  <p className="text-sm t3 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── GROWTH ── */}
        {activeTab==='growth' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="📈" title="Growth Strategy">
              <p className="text-sm t3 leading-relaxed mb-5">{strategy.growthStrategy?.summary}</p>
              <div className="space-y-3">
                {strategy.growthStrategy?.tactics?.map((t,i)=>(
                  <div key={i} className="rounded-2xl p-4 block-base">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-display text-base t1">{t.title}</p>
                      <PriorityBadge level={t.priority}/>
                    </div>
                    <p className="text-sm t3 leading-relaxed mb-2">{t.description}</p>
                    <p className="text-[11px] font-mono tf">⏱ {t.timeframe}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard icon="⏰" title="Posting Schedule">
              <div className="mb-4">
                <p className="label-tag mb-2">Recommended frequency</p>
                <p className="text-sm t2 leading-relaxed p-3 rounded-xl block-sand">{strategy.growthStrategy?.postingSchedule?.frequency}</p>
              </div>
              <div className="mb-4">
                <p className="label-tag mb-2">Best times</p>
                {strategy.growthStrategy?.postingSchedule?.bestTimes?.map((t,i)=>(
                  <div key={i} className="flex gap-2 text-sm t3 mb-1.5">
                    <span style={{color:'var(--terra)'}}>→</span>{t}
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3 block-sage">
                <p className="label-tag mb-1" style={{color:'var(--sage-text)'}}>Consistency tip</p>
                <p className="text-sm t3 leading-relaxed">{strategy.growthStrategy?.postingSchedule?.consistency}</p>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── CALENDAR ── */}
        {activeTab==='calendar' && (
          <div className="animate-fade-up space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-display text-xl t1">Weekly Calendar</h2>
              <span className="label-tag">7-day plan</span>
            </div>
            {strategy.calendar?.map((day,i)=>(
              <div key={day.day} className={clsx('card p-5', day.day==='Sunday'&&'opacity-60')}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0 block-terra"
                    style={{color:'var(--terra-text)'}}>
                    {day.day.slice(0,3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base t1">{day.day}</p>
                    <p className="text-xs tm truncate">{day.theme}</p>
                  </div>
                  {day.format&&day.format!=='optional'&&<span className="text-xl shrink-0">{FORMAT_EMOJI[day.format]||'📹'}</span>}
                </div>
                {day.idea&&<>
                  <p className="text-sm font-medium t2 mb-1.5 leading-snug">{day.idea}</p>
                  {day.hook&&<p className="text-xs italic mb-3 tm">"{day.hook}"</p>}
                  {day.caption&&(
                    <div className="rounded-xl p-3 block-base">
                      <p className="label-tag mb-1">Caption tip</p>
                      <p className="text-xs t3 leading-relaxed">{day.caption}</p>
                    </div>
                  )}
                </>}
              </div>
            ))}
          </div>
        )}

        {/* ── IDEAS ── */}
        {activeTab==='ideas' && (
          <div className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-xl t1">Content Ideas</h2>
                <p className="text-xs tm mt-0.5">Generate a full script for any idea</p>
              </div>
              <button onClick={generateNewIdeas} disabled={loadingNewIdeas}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 disabled:opacity-50">
                <RotateCcw size={12} className={loadingNewIdeas?'animate-spin':''} />
                {loadingNewIdeas?'Finding…':'New Ideas'}
              </button>
            </div>
            {loadingNewIdeas && <div className="card p-6 flex justify-center"><Spinner text="Finding fresh ideas…"/></div>}
            {!loadingNewIdeas && strategy.contentIdeas?.map((idea,i)=>(
              <div key={`${idea.title}-${i}`} className="card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl shrink-0">{idea.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base t1 mb-1 leading-snug">{idea.title}</p>
                    <p className="text-sm italic tm leading-relaxed">"{idea.hook}"</p>
                  </div>
                  <PotentialBadge level={idea.potential}/>
                </div>
                <div className="rounded-xl p-3 mb-3 block-base">
                  <p className="label-tag mb-1">Why this works for you</p>
                  <p className="text-xs t3 leading-relaxed">{idea.why}</p>
                </div>
                <p className="text-xs tf mb-1">{FORMAT_EMOJI[idea.format]||'📹'} {idea.format}</p>
                <ScriptPanel scriptState={scripts[idea.title]} onGenerate={()=>generateScript(idea)}/>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPETITORS ── */}
        {activeTab==='competitors' && (
          <div className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-xl t1">Competitor Research</h2>
                <p className="text-xs tm mt-0.5">Creators posting similar content</p>
              </div>
              <button onClick={generateCompetitors} disabled={loadingCompetitors}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 disabled:opacity-50">
                <RefreshCw size={12} className={loadingCompetitors?'animate-spin':''}/>
                {loadingCompetitors?'Searching…':competitors?'Refresh':'Research'}
              </button>
            </div>

            {!competitors && !loadingCompetitors && (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 block-terra">🔍</div>
                <p className="font-display text-lg t1 mb-2">Discover your competitors</p>
                <p className="text-sm tm mb-6 leading-relaxed">
                  Aria will find creators posting similar content — what they do well, where they fall short, and ideas you can take inspiration from.
                </p>
                <button onClick={generateCompetitors} className="btn-primary flex items-center gap-2 mx-auto">
                  <Users size={15}/> Research Competitors
                </button>
              </div>
            )}

            {loadingCompetitors && (
              <div className="card p-8 flex flex-col items-center gap-3">
                <Spinner text="Searching for creators in your niche…"/>
                <p className="text-xs tm font-mono">Analysing content, hooks & strategies</p>
              </div>
            )}

            {competitors && !loadingCompetitors && (
              <>
                <div className="card p-5">
                  <p className="label-tag mb-2">Market overview</p>
                  <p className="text-sm t2 leading-relaxed">{competitors.summary}</p>
                </div>
                <div className="space-y-3">
                  {competitors.competitors?.map((c,i)=><CompetitorCard key={i} c={c}/>)}
                </div>
                <div className="card p-5" style={{borderLeft:'3px solid var(--terra)'}}>
                  <p className="label-tag mb-2" style={{color:'var(--terra-text)'}}>✨ Your edge in this market</p>
                  <p className="text-sm t2 leading-relaxed mb-4">{competitors.yourEdge}</p>
                  <p className="label-tag mb-2">Do this now</p>
                  <div className="space-y-2">
                    {competitors.doThis?.map((a,i)=>(
                      <div key={i} className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 block-terra"
                          style={{color:'var(--terra-text)'}}>{i+1}</span>
                        <p className="text-sm t2 leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TIPS ── */}
        {activeTab==='tips' && (
          <div className="animate-fade-up space-y-4">
            <SectionCard icon="🎯" title="Fix Your Struggle" subtitle={profile.struggle}>
              <p className="text-sm t2 leading-relaxed p-4 rounded-2xl block-terra">
                {strategy.performanceTips?.struggleFix}
              </p>
            </SectionCard>
            <SectionCard icon="🚀" title="Level Up" subtitle={`Going beyond ${profile.followers}`}>
              <p className="text-sm t2 leading-relaxed">{strategy.performanceTips?.levelUpTip}</p>
            </SectionCard>
            <SectionCard icon="📊" title="Metrics to Track">
              <div className="space-y-3">
                {strategy.performanceTips?.metrics?.map((m,i)=>(
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 block-sand"
                      style={{color:'var(--sand-text)'}}>{i+1}</span>
                    <p className="text-sm t3 leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard icon="⚡" title="Quick Wins This Week">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w,i)=>(
                  <div key={i} className="flex gap-3 items-start rounded-2xl p-3.5 block-base">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 block-terra"
                      style={{color:'var(--terra-text)'}}>{i+1}</span>
                    <p className="text-sm t2 leading-relaxed">{w}</p>
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
