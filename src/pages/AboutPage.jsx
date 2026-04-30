import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MAPS_REGISTRY, LIVE_COUNT, TOTAL_COUNT } from '@/data/mapsRegistry'

// ─── Animated counter ─────────────────────────────────────────────────────────
const useCounter = (target, duration = 2000, active = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

const StatCard = ({ value, suffix = '', label, active, small = false }) => {
  const count = useCounter(value, 2000, active)
  return (
    <div style={{
      padding: '36px 28px',
      background: '#0f0e0b',
      textAlign: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.3), transparent)',
      }} />
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: small ? 36 : 48, fontWeight: 700,
        color: '#C9B88A', lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9, color: '#4a4840',
        marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.16em',
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── AboutPage ────────────────────────────────────────────────────────────────
const AboutPage = () => {
  const [statsActive, setStatsActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true) },
      { threshold: 0.2 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  })

  // Pull topics from registry for the "covered so far" list
  const liveTopics = MAPS_REGISTRY.filter(m => m.status === 'live')

  const PLATFORM_STATS = [
    { value: LIVE_COUNT,   suffix: '',  label: 'Maps live' },
    { value: 77,           suffix: 'yr', label: 'History spanned so far', small: true },
    { value: TOTAL_COUNT,  suffix: '+', label: 'Stories in research' },
    { value: 100,          suffix: '%', label: 'Primary source data', small: true },
  ]

  const HOW = [
    {
      glyph: '01',
      title: 'Research',
      body: 'Every map begins with primary sources — census data, ILO records, UNHCR figures, national bureaus. No estimates. No paraphrased secondhand numbers.',
    },
    {
      glyph: '02',
      title: 'Structure',
      body: 'Data is shaped into chapters — time-ordered, geographically grounded. Each chapter has a claim, a visual, and a human detail that makes the number real.',
    },
    {
      glyph: '03',
      title: 'Animate',
      body: 'The globe moves. Flow lines travel. Figures count up. The animation is not decoration — it is the argument, paced so the viewer can follow it.',
    },
    {
      glyph: '04',
      title: 'Publish',
      body: 'Each map is a self-contained web experience. No app download. No paywall. Open in a browser, play it through, pause where you want to think.',
    },
  ]

  const PRINCIPLES = [
    {
      icon: '◎',
      title: 'Geography is argument',
      body: 'Where something happens — and the distance it travels — is data. We treat the map itself as a primary medium, not a backdrop.',
    },
    {
      icon: '◈',
      title: 'No editorialising',
      body: 'We do not tell you what to feel. The numbers, the routes, the scale — these speak. Our job is to make them visible, not to moralise.',
    },
    {
      icon: '◇',
      title: 'Motion earns meaning',
      body: 'Animation is used only when movement adds information. A dot travelling a route tells you something a static line cannot.',
    },
    {
      icon: '◉',
      title: 'Human scale alongside aggregate',
      body: 'Every map carries both the macro figure and the individual detail. 14 million workers is also one person at an airport with a contract they cannot read.',
    },
  ]

  const dividerSection = {
    borderTop: '1px solid rgba(201,184,138,0.07)',
    position: 'relative', zIndex: 2,
    padding: '80px 48px',
    maxWidth: 1100, margin: '0 auto',
  }

  const eyebrowEl = (text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{ width: 24, height: 1, background: '#C9B88A', opacity: 0.4 }} />
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        color: '#C9B88A', textTransform: 'uppercase', letterSpacing: '0.22em',
      }}>{text}</span>
    </div>
  )

  return (
    <div style={{
      background: '#12110E', minHeight: '100vh',
      color: '#F0E8D8', overflowX: 'hidden',
      fontFamily: "'Lato', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(201,184,138,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,184,138,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Warm glow */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-10%',
        width: '60%', height: '60%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 30% 30%, rgba(201,184,138,0.035) 0%, transparent 65%)',
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 48px',
        background: 'linear-gradient(180deg, rgba(18,17,14,0.97) 0%, transparent 100%)',
      }}>
        <Link to="/" style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: '#C9B88A', letterSpacing: '0.18em',
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          ← Animated Maps
        </Link>
        <div style={{ display: 'flex', gap: 40 }}>
          {[['Maps', '/maps'], ['About', '/about']].map(([label, href]) => (
            <Link key={href} to={href} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              color: href === '/about' ? '#C9B88A' : '#555',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              borderBottom: href === '/about' ? '1px solid rgba(201,184,138,0.35)' : 'none',
              paddingBottom: 2,
            }}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '140px 48px 80px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ ...fadeUp(0), display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
          <div style={{ width: 32, height: 1, background: '#C9B88A', opacity: 0.4 }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: '#C9B88A', textTransform: 'uppercase', letterSpacing: '0.22em',
          }}>
            About the Platform
          </span>
        </div>

        <h1 style={{
          ...fadeUp(0.08),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(44px, 7vw, 90px)',
          fontWeight: 700, lineHeight: 1.0,
          color: '#F0E8D8', letterSpacing: '-0.025em', marginBottom: 6,
        }}>
          History moves.
        </h1>
        <h1 style={{
          ...fadeUp(0.14),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(44px, 7vw, 90px)',
          fontWeight: 700, lineHeight: 1.0,
          color: '#C9B88A', fontStyle: 'italic',
          letterSpacing: '-0.025em', marginBottom: 6,
        }}>
          We map it
        </h1>
        <h1 style={{
          ...fadeUp(0.2),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(44px, 7vw, 90px)',
          fontWeight: 700, lineHeight: 1.0,
          color: '#F0E8D8', letterSpacing: '-0.025em',
        }}>
          in motion.
        </h1>

        <div style={{
          ...fadeUp(0.26),
          width: 48, height: 1,
          background: 'linear-gradient(90deg, #C9B88A, transparent)',
          margin: '40px 0',
        }} />

        <p style={{
          ...fadeUp(0.3),
          fontFamily: "'Lato', sans-serif", fontSize: 17,
          lineHeight: 1.9, color: '#7a7469',
          maxWidth: 560, fontWeight: 300, marginBottom: 18,
        }}>
          AnimatedMaps is a data storytelling platform. Each map is a
          chapter-driven animation built on real history — migration routes,
          labour corridors, displacement arcs, the movements that shaped
          the modern world but never made it onto a conventional map.
        </p>
        <p style={{
          ...fadeUp(0.35),
          fontFamily: "'Lato', sans-serif", fontSize: 15,
          lineHeight: 1.9, color: '#4a4840',
          maxWidth: 500, fontWeight: 300,
        }}>
          Not one subject. Not one region. Every story that deserves
          a globe, a timeline, and the space to breathe.
        </p>

        <div style={{ ...fadeUp(0.42), marginTop: 52, display: 'flex', gap: 16 }}>
          <Link to="/maps" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#12110E', background: '#C9B88A',
            padding: '14px 32px',
          }}>
            Browse the Atlas
          </Link>
          <a href="#how" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#C9B88A', border: '1px solid rgba(201,184,138,0.25)',
            padding: '14px 32px',
          }}>
            How it works ↓
          </a>
        </div>
      </section>

      {/* ── PLATFORM STATS ── */}
      <section ref={statsRef} style={{
        position: 'relative', zIndex: 2,
        padding: '0 48px 100px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, background: 'rgba(201,184,138,0.06)',
        }}>
          {PLATFORM_STATS.map(s => (
            <StatCard key={s.label} {...s} active={statsActive} />
          ))}
        </div>
      </section>

      {/* ── TOPICS COVERED ── */}
      <section style={dividerSection}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.8fr',
          gap: 80, alignItems: 'start',
        }}>
          <div>
            {eyebrowEl('The Atlas so far')}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(26px, 3vw, 42px)',
              fontWeight: 600, lineHeight: 1.2, color: '#F0E8D8',
            }}>
              Stories<br />
              <em style={{ color: '#C9B88A' }}>live now.</em>
            </h2>
            <p style={{
              fontFamily: "'Lato', sans-serif", fontSize: 13,
              color: '#4a4840', lineHeight: 1.8, marginTop: 20, fontWeight: 300,
            }}>
              Each entry is a complete interactive experience —
              chapters, animations, sourced data. More are in
              research and production.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(201,184,138,0.06)' }}>
            {liveTopics.map((map, i) => (
              <Link key={map.id} to={map.path} style={{
                background: '#0f0e0b', padding: '28px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.25s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,184,138,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0e0b'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    color: '#2e2c28', minWidth: 24,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22, fontWeight: 700, color: '#F0E8D8',
                      letterSpacing: '-0.01em', marginBottom: 4,
                    }}>
                      {map.title}
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 9,
                      color: '#4a4840', letterSpacing: '0.14em', textTransform: 'uppercase',
                    }}>
                      {map.eyebrow} · {map.year}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 8,
                    color: map.tagColor, border: `1px solid ${map.tagColor}`,
                    padding: '3px 10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    opacity: 0.7,
                  }}>
                    {map.tag}
                  </span>
                  <span style={{ color: '#3a3830', fontSize: 16 }}>→</span>
                </div>
              </Link>
            ))}

            {/* Coming soon row */}
            <div style={{
              background: '#0f0e0b', padding: '28px 32px',
              display: 'flex', alignItems: 'center', gap: 24, opacity: 0.3,
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                color: '#2e2c28', minWidth: 24,
              }}>
                {String(liveTopics.length + 1).padStart(2, '0')}
              </span>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22, fontWeight: 700, color: '#2e2c28',
              }}>
                In Research
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT'S MADE ── */}
      <section id="how" style={dividerSection}>
        {eyebrowEl('Process')}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 3vw, 46px)',
          fontWeight: 700, lineHeight: 1.1, color: '#F0E8D8',
          letterSpacing: '-0.02em', marginBottom: 52,
        }}>
          How every map<br />
          <em style={{ color: '#C9B88A' }}>gets made.</em>
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, background: 'rgba(201,184,138,0.06)',
        }}>
          {HOW.map(({ glyph, title, body }) => (
            <div key={glyph} style={{
              background: '#0f0e0b', padding: '32px 28px',
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 28, color: '#C9B88A',
                opacity: 0.2, marginBottom: 24, lineHeight: 1,
              }}>
                {glyph}
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 16, color: '#F0E8D8', marginBottom: 14,
              }}>
                {title}
              </div>
              <div style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 13, color: '#4a4840', lineHeight: 1.85, fontWeight: 300,
              }}>
                {body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section style={dividerSection}>
        {eyebrowEl('Principles')}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1, background: 'rgba(201,184,138,0.06)',
        }}>
          {PRINCIPLES.map(({ icon, title, body }) => (
            <div key={title} style={{
              background: '#0f0e0b', padding: '36px 32px',
              transition: 'background 0.25s', cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,184,138,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = '#0f0e0b'}
            >
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 20, color: '#C9B88A',
                marginBottom: 20, opacity: 0.5,
              }}>
                {icon}
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17, color: '#F0E8D8', marginBottom: 12,
              }}>
                {title}
              </div>
              <div style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 13, color: '#4a4840', lineHeight: 1.85, fontWeight: 300,
              }}>
                {body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ ...dividerSection, padding: '100px 48px 120px', textAlign: 'center' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: '#3a3830', textTransform: 'uppercase',
          letterSpacing: '0.22em', marginBottom: 28,
        }}>
          The Atlas
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 62px)',
          fontWeight: 700, lineHeight: 1.1,
          color: '#F0E8D8', marginBottom: 52,
          letterSpacing: '-0.02em',
        }}>
          {LIVE_COUNT} {LIVE_COUNT === 1 ? 'map' : 'maps'} live.<br />
          <em style={{ color: '#C9B88A' }}>More on the way.</em>
        </h2>
        <Link to="/maps" style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#12110E', background: '#C9B88A',
          padding: '16px 44px', display: 'inline-block',
        }}>
          Enter the Atlas →
        </Link>
      </section>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(201,184,138,0.06)',
        padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: '#2a2820', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          AnimatedMaps © {new Date().getFullYear()}
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: '#2a2820', letterSpacing: '0.1em',
        }}>
          Data storytelling · History in motion
        </span>
      </div>
    </div>
  )
}

export default AboutPage