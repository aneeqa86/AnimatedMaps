import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT, TOTAL_COUNT } from '@/data/mapsRegistry'

// ─── Palette (matches HomePage + MapsPage) ────────────────────────────────────
const BG    = '#F5F0E8'
const INK   = '#1A1612'
const INKMD = '#4A4035'
const INKLT = '#8A7A60'
const GOLD  = '#8B6414'
const RULE  = 'rgba(26,22,18,0.1)'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400&family=Lato:wght@300;400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; color: inherit; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) both; }

.map-link:hover                 { background: rgba(139,100,20,0.05) !important; }
.map-link:hover .map-link-title { color: ${GOLD} !important; }
.map-link:hover .map-link-arrow { color: ${GOLD} !important; transform: translateX(4px) !important; }
nav a:hover                     { color: ${INK} !important; }
.browse-btn:hover               { background: ${INK} !important; color: ${BG} !important; }
.how-btn:hover                  { background: rgba(26,22,18,0.06) !important; }
`

// ─── Hooks ───────────────────────────────────────────────────────────────────
const useCounter = (target, duration = 2000, active = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

const useVisible = (ref, threshold = 0.15) => {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return vis
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Logo = () => (
  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
    <svg width="24" height="24" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="11" stroke={INK} strokeWidth="1" fill="none" opacity="0.7"/>
      <line x1="2" y1="13" x2="24" y2="13" stroke={INK} strokeWidth="0.6" opacity="0.35"/>
      <ellipse cx="13" cy="13" rx="4.5" ry="11" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.25"/>
      <polygon points="9,8 9,18 20,13" fill={INK} opacity="0.85"/>
    </svg>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: INK, lineHeight: 1.5, opacity: 0.7 }}>
      ANIMATED<br/>MAPS
    </span>
  </Link>
)

const Eyebrow = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
    <div style={{ width: 22, height: 1, background: GOLD }}/>
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.24em' }}>
      {text}
    </span>
  </div>
)

const FadeSection = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null)
  const vis = useVisible(ref)
  return (
    <div ref={ref} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(16px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

const StatCard = ({ value, suffix = '', label, active, small = false }) => {
  const count = useCounter(value, 2000, active)
  return (
    <div style={{
      padding: '32px 24px', background: '#FFFFFF',
      borderRight: `1px solid ${RULE}`, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: small ? 34 : 44, fontWeight: 700,
        color: GOLD, lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 8.5,
        color: INKLT, marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.16em',
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PLATFORM_STATS = [
  { value: LIVE_COUNT,  suffix: '',   label: 'Maps live' },
  { value: 77,          suffix: 'yr', label: 'History spanned', small: true },
  { value: TOTAL_COUNT, suffix: '+',  label: 'Stories in research' },
  { value: 100,         suffix: '%',  label: 'Primary source data', small: true },
]

const HOW_STEPS = [
  { n: '01', title: 'Research',  body: 'Every map begins with primary sources — census data, ILO records, UNHCR figures, declassified archives, national bureaus. No estimates. No paraphrased secondhand numbers.' },
  { n: '02', title: 'Structure', body: 'Data is shaped into chapters — time-ordered, geographically grounded. Each chapter has a claim, a visual, and a human detail that makes the number real.' },
  { n: '03', title: 'Animate',   body: 'The globe moves. Flow lines travel. Figures count up. The animation is not decoration — it is the argument, paced so the viewer can follow it.' },
  { n: '04', title: 'Publish',   body: 'Each map is a self-contained web experience. No app download. No paywall. Open in a browser, play it through, pause where you want to think.' },
]

const PRINCIPLES = [
  { icon: '◎', title: 'Geography is argument',         body: 'Where something happens — and the distance it travels — is data. We treat the map itself as a primary medium, not a backdrop.' },
  { icon: '◈', title: 'No editorialising',             body: 'We do not tell you what to feel. The numbers, the routes, the scale — these speak. Our job is to make them visible, not to moralise.' },
  { icon: '◇', title: 'Motion earns meaning',          body: 'Animation is used only when movement adds information. A dot travelling a route tells you something a static line cannot.' },
  { icon: '◉', title: 'Human scale alongside aggregate', body: 'Every map carries both the macro figure and the individual detail. 14 million workers is also one person at an airport with a contract they cannot read.' },
]

const section = { padding: '72px 48px', borderTop: `1px solid ${RULE}`, maxWidth: 1100, margin: '0 auto' }

// ─── AboutPage ────────────────────────────────────────────────────────────────
const AboutPage = () => {
  const [heroVis,   setHeroVis]   = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => { const t = setTimeout(() => setHeroVis(true), 60); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true) }, { threshold: 0.2 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const fadeUp = (delay = 0) => ({
    opacity: heroVis ? 1 : 0,
    transform: heroVis ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  })

  const liveMaps = MAPS_REGISTRY.filter(m => m.status === 'live')

  return (
    <div style={{ background: BG, minHeight: '100vh', color: INK, fontFamily: "'Lato', sans-serif" }}>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 48px', borderBottom: `1px solid ${RULE}`,
        background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(8px)',
      }}>
        <Logo />
        <div style={{ display: 'flex', gap: 32 }}>
          {[['Maps', '/maps'], ['About', '/about']].map(([label, href]) => (
            <Link key={href} to={href} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9.5,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: href === '/about' ? INK : INKLT,
              borderBottom: href === '/about' ? `1px solid ${INK}` : 'none',
              paddingBottom: href === '/about' ? 2 : 0,
              transition: 'color 0.15s',
            }}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px 72px' }}>
        <div style={{ ...fadeUp(0), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 22, height: 1, background: GOLD }}/>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.24em' }}>
            About the Platform
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end' }}>
          <div>
            <h1 style={{
              ...fadeUp(0.07),
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(40px, 5.5vw, 76px)',
              fontWeight: 700, lineHeight: 1.0,
              letterSpacing: '-0.025em', color: INK,
            }}>
              History moves.<br/>
              <em style={{ color: GOLD }}>We map it</em><br/>
              in motion.
            </h1>
          </div>
          <div style={{ ...fadeUp(0.14), paddingBottom: 4 }}>
            <div style={{ width: 40, height: 2, background: INK, marginBottom: 24 }}/>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 15, lineHeight: 1.85, color: INKMD, fontWeight: 300, marginBottom: 16 }}>
              AnimatedMaps is a data storytelling platform. Each map is a chapter-driven animation built on real history — migration routes, labour corridors, displacement arcs, the movements that shaped the modern world but never made it onto a conventional map.
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, lineHeight: 1.85, color: INKLT, fontWeight: 300 }}>
              Not one subject. Not one region. Every story that deserves a globe, a timeline, and the space to breathe.
            </p>
            <div style={{ ...fadeUp(0.22), marginTop: 36, display: 'flex', gap: 12 }}>
              <Link to="/maps" className="browse-btn" style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: BG, background: INK, padding: '12px 28px',
                transition: 'background 0.2s, color 0.2s',
              }}>
                Browse the Atlas
              </Link>
              <a href="#how" className="how-btn" style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9.5,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: INK, border: `1px solid ${RULE}`,
                padding: '12px 28px', transition: 'background 0.2s',
              }}>
                How it works ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {PLATFORM_STATS.map(s => <StatCard key={s.label} {...s} active={statsActive} />)}
        </div>
      </section>

      {/* ── MAPS IN THE ATLAS ── */}
      <section style={section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 72, alignItems: 'start' }}>
          <FadeSection>
            <Eyebrow text="The Atlas so far" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 700, lineHeight: 1.2, color: INK }}>
              Stories<br/><em style={{ color: GOLD }}>live now.</em>
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: INKMD, lineHeight: 1.8, marginTop: 16, fontWeight: 300 }}>
              Each entry is a complete interactive experience — chapters, animations, sourced data. More are in research and production.
            </p>
          </FadeSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: RULE }}>
            {liveMaps.map((map, i) => (
              <Link
                key={map.id} to={map.path} className="map-link"
                style={{ background: '#FFFFFF', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.18s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: INKLT, minWidth: 22 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="map-link-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: INK, letterSpacing: '-0.01em', marginBottom: 3, transition: 'color 0.15s' }}>
                      {map.title}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: INKLT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      {map.eyebrow} · {map.year}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: map.tagColor, border: `1px solid ${map.tagColor}60`, padding: '2px 8px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {map.tag}
                  </span>
                  <span className="map-link-arrow" style={{ fontSize: 16, color: INKLT, transition: 'color 0.15s, transform 0.15s', display: 'inline-block' }}>→</span>
                </div>
              </Link>
            ))}
            <div style={{ background: '#FFFFFF', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 20, opacity: 0.3 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: INKLT, minWidth: 22 }}>{String(liveMaps.length + 1).padStart(2, '0')}</span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: INK }}>In Research</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT'S MADE ── */}
      <section id="how" style={{ ...section, background: '#FFFFFF', maxWidth: '100%', padding: '72px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <FadeSection>
            <Eyebrow text="Process" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, lineHeight: 1.1, color: INK, letterSpacing: '-0.02em', marginBottom: 48 }}>
              How every map<br/><em style={{ color: GOLD }}>gets made.</em>
            </h2>
          </FadeSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: RULE }}>
            {HOW_STEPS.map(({ n, title, body }, i) => (
              <FadeSection key={n} delay={i * 0.08}>
                <div style={{ background: '#FFFFFF', padding: '28px 24px', height: '100%' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: GOLD, opacity: 0.35, marginBottom: 20, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: INK, marginBottom: 12 }}>{title}</div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12.5, color: INKMD, lineHeight: 1.85, fontWeight: 300 }}>{body}</div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section style={section}>
        <FadeSection>
          <Eyebrow text="Principles" />
        </FadeSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: RULE }}>
          {PRINCIPLES.map(({ icon, title, body }, i) => (
            <FadeSection key={title} delay={i * 0.07}>
              <div style={{ background: BG, padding: '32px 28px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: GOLD, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: INK, marginBottom: 10 }}>{title}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: INKMD, lineHeight: 1.85, fontWeight: 300 }}>{body}</div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ ...section, textAlign: 'center', padding: '80px 48px 100px' }}>
        <FadeSection>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: INKLT, textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: 24 }}>
            The Atlas
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.1, color: INK, marginBottom: 44, letterSpacing: '-0.02em' }}>
            {LIVE_COUNT} {LIVE_COUNT === 1 ? 'map' : 'maps'} live.<br/>
            <em style={{ color: GOLD }}>More on the way.</em>
          </h2>
          <Link to="/maps" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9.5,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: BG, background: INK, padding: '14px 40px', display: 'inline-block',
          }}>
            Enter the Atlas →
          </Link>
        </FadeSection>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '16px 48px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: INKLT, textTransform: 'uppercase' }}>AnimatedMaps © {new Date().getFullYear()}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: INKLT }}>Data storytelling · History in motion</span>
      </footer>
    </div>
  )
}

export default AboutPage