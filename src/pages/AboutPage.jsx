import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const useCounter = (target, duration = 2000, active = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
};

const StatCard = ({ value, suffix = '', label, active }) => {
  const count = useCounter(value, 2200, active);
  return (
    <div style={{
      padding: '32px 24px',
      background: '#0D0D0D',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,184,138,0.4), transparent)',
      }} />
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 44, fontWeight: 700, color: '#C9B88A',
        lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: '#555',
        marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.14em',
      }}>
        {label}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [statsActive, setStatsActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true); },
      { threshold: 0.25 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const STATS = [
    { value: 9000000, suffix: '+', label: 'Pakistani workers abroad' },
    { value: 27,      suffix: 'B+', label: 'USD remitted in 2023' },
    { value: 6,       suffix: '',   label: 'Gulf corridors mapped' },
    { value: 1,       suffix: '',   label: 'Maps live — more coming' },
  ];

  const VALUES = [
    {
      icon: '◎',
      title: 'Data as Narrative',
      body: 'Numbers alone don\'t move people. We pair every statistic with geography, time, and human context — so data becomes a story you can see.',
    },
    {
      icon: '◈',
      title: 'Ground Truth First',
      body: 'Every figure is sourced from primary databases — ILO, UNHCR, World Bank, national bureaus. No editorializing. No rounding for drama.',
    },
    {
      icon: '◇',
      title: 'Labour & Migration Focus',
      body: 'We center the workers who built skylines and sent remittances home. Their movement is economic history. We map it.',
    },
    {
      icon: '◉',
      title: 'Open & Explorable',
      body: 'Every map is interactive. Play a chapter, pause it, scrub the timeline. The story moves at your pace, not ours.',
    },
  ];

  const TECH = [
    ['Mapbox GL JS', 'Globe rendering, fog, animated layers'],
    ['React + Vite', 'Component-driven UI, fast dev loop'],
    ['requestAnimationFrame', 'Frame-accurate figure animations'],
    ['GeoJSON + MVT', 'Country fills, flow lines, city markers'],
    ['ILO / World Bank', 'Primary labour statistics'],
    ['UNHCR / OEC', 'Migration & remittance data'],
  ];

  const sectionDivider = {
    borderTop: '1px solid rgba(201,184,138,0.08)',
    position: 'relative', zIndex: 2,
    padding: '80px 48px',
    maxWidth: 1100, margin: '0 auto',
  };

  const eyebrow = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{ width: 24, height: 1, background: '#C9B88A', opacity: 0.5 }} />
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: '#C9B88A',
        textTransform: 'uppercase', letterSpacing: '0.2em',
      }} />
    </div>
  );

  return (
    <div style={{
      background: '#0D0D0D', minHeight: '100vh',
      color: '#F0E8D8', overflowX: 'hidden',
      fontFamily: 'Lato, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(201,184,138,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,184,138,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* corner accents */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: 100, height: 100,
        pointerEvents: 'none', zIndex: 1,
        borderTop: '1px solid rgba(201,184,138,0.15)',
        borderLeft: '1px solid rgba(201,184,138,0.15)',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, right: 0, width: 100, height: 100,
        pointerEvents: 'none', zIndex: 1,
        borderBottom: '1px solid rgba(201,184,138,0.15)',
        borderRight: '1px solid rgba(201,184,138,0.15)',
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'linear-gradient(180deg, rgba(13,13,13,0.97) 0%, transparent 100%)',
        backdropFilter: 'blur(8px)',
      }}>
        <Link to="/" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: '#C9B88A',
          textDecoration: 'none', letterSpacing: '0.18em',
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          ← AnimatedMaps
        </Link>
        <div style={{ display: 'flex', gap: 32 }}>
          {[['Maps', '/maps'], ['About', '/about']].map(([label, href]) => (
            <Link key={href} to={href} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: href === '/about' ? '#C9B88A' : '#555',
              textDecoration: 'none', letterSpacing: '0.16em',
              textTransform: 'uppercase',
              borderBottom: href === '/about' ? '1px solid rgba(201,184,138,0.4)' : 'none',
              paddingBottom: 2,
              transition: 'color 0.2s',
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
        <div style={{ ...fadeUp(0), display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{ width: 32, height: 1, background: '#C9B88A', opacity: 0.5 }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: '#C9B88A',
            textTransform: 'uppercase', letterSpacing: '0.22em',
          }}>
            About the Project
          </span>
        </div>

        <h1 style={{
          ...fadeUp(0.1),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 86px)',
          fontWeight: 700, lineHeight: 1.05,
          color: '#F0E8D8', marginBottom: 8,
          letterSpacing: '-0.025em',
        }}>
          Maps that carry
        </h1>
        <h1 style={{
          ...fadeUp(0.16),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 86px)',
          fontWeight: 700, lineHeight: 1.05,
          color: '#C9B88A', fontStyle: 'italic',
          marginBottom: 8, letterSpacing: '-0.025em',
        }}>
          the weight
        </h1>
        <h1 style={{
          ...fadeUp(0.22),
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 7vw, 86px)',
          fontWeight: 700, lineHeight: 1.05,
          color: '#F0E8D8', letterSpacing: '-0.025em',
        }}>
          of movement.
        </h1>

        <div style={{
          ...fadeUp(0.28),
          width: 60, height: 1,
          background: 'linear-gradient(90deg, #C9B88A, transparent)',
          margin: '36px 0',
        }} />

        <p style={{
          ...fadeUp(0.3),
          fontFamily: 'Lato, sans-serif',
          fontSize: 17, lineHeight: 1.85,
          color: '#aaa', maxWidth: 560, fontWeight: 300,
          marginBottom: 20,
        }}>
          AnimatedMaps is a data storytelling platform built around the invisible
          architectures of human migration — the labour corridors, remittance
          routes, and displacement arcs that define the modern world but rarely
          appear on any map.
        </p>
        <p style={{
          ...fadeUp(0.35),
          fontFamily: 'Lato, sans-serif',
          fontSize: 15, lineHeight: 1.85,
          color: '#555', maxWidth: 520, fontWeight: 300,
        }}>
          Each map is a chapter-driven animation layered onto a globe, combining
          geographic data, archival statistics, and narrative pacing into something
          you can watch, pause, and explore.
        </p>

        <div style={{ ...fadeUp(0.4), marginTop: 52, display: 'flex', gap: 16 }}>
          <Link to="/maps" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0D0D0D', background: '#C9B88A',
            padding: '14px 32px', textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Explore Maps
          </Link>
          <a href="#mission" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#C9B88A', background: 'transparent',
            border: '1px solid rgba(201,184,138,0.25)',
            padding: '14px 32px', textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,184,138,0.7)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,184,138,0.25)'}
          >
            Read More ↓
          </a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{
        position: 'relative', zIndex: 2,
        padding: '0 48px 100px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'rgba(201,184,138,0.07)',
        }}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} active={statsActive} />
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" style={sectionDivider}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.7fr',
          gap: 80, alignItems: 'start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1, background: '#C9B88A', opacity: 0.5 }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: '#C9B88A',
                textTransform: 'uppercase', letterSpacing: '0.2em',
              }}>
                Mission
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 3vw, 44px)',
              fontWeight: 600, lineHeight: 1.2, color: '#F0E8D8',
            }}>
              Why these<br />
              <em style={{ color: '#C9B88A' }}>maps?</em>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <p style={{
              fontFamily: 'Lato, sans-serif', fontSize: 15,
              lineHeight: 1.9, color: '#aaa', fontWeight: 300,
            }}>
              Labour migration is one of the largest economic forces in the developing world —
              yet it exists almost entirely outside conventional cartography. There are no
              Google Maps layers for remittance corridors. No atlas of recruitment networks.
              No animated timeline of how Gulf construction booms absorbed South Asian labour
              across five decades.
            </p>
            <p style={{
              fontFamily: 'Lato, sans-serif', fontSize: 15,
              lineHeight: 1.9, color: '#aaa', fontWeight: 300,
            }}>
              We build those maps. Starting with Pakistan — one of the world's largest
              labour exporters — and expanding outward toward every corridor where people
              move for work, survival, or the survival that gets called work.
            </p>
            <p style={{
              fontFamily: 'Lato, sans-serif', fontSize: 14,
              lineHeight: 1.9, color: '#C9B88A', fontWeight: 300,
              fontStyle: 'italic',
              borderLeft: '2px solid rgba(201,184,138,0.2)',
              paddingLeft: 20, marginTop: 4,
            }}>
              This is not a policy tool. It is not a protest. It is a record:
              precise, sourced, and navigable.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={sectionDivider}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
          <div style={{ width: 24, height: 1, background: '#C9B88A', opacity: 0.5 }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: '#C9B88A',
            textTransform: 'uppercase', letterSpacing: '0.2em',
          }}>
            Principles
          </span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1, background: 'rgba(201,184,138,0.06)',
        }}>
          {VALUES.map(({ icon, title, body }) => (
            <div key={title} style={{
              background: '#0D0D0D', padding: '36px 32px',
              transition: 'background 0.3s', cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,184,138,0.035)'}
              onMouseLeave={e => e.currentTarget.style.background = '#0D0D0D'}
            >
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 20, color: '#C9B88A',
                marginBottom: 20, opacity: 0.65,
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
                fontFamily: 'Lato, sans-serif',
                fontSize: 13, color: '#555', lineHeight: 1.85, fontWeight: 300,
              }}>
                {body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH ── */}
      <section style={sectionDivider}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.7fr',
          gap: 80, alignItems: 'start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1, background: '#C9B88A', opacity: 0.5 }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: '#C9B88A',
                textTransform: 'uppercase', letterSpacing: '0.2em',
              }}>
                Stack
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 3vw, 44px)',
              fontWeight: 600, lineHeight: 1.2, color: '#F0E8D8',
            }}>
              Built on<br />
              <em style={{ color: '#C9B88A' }}>open tools.</em>
            </h2>
            <p style={{
              fontFamily: 'Lato, sans-serif', fontSize: 13,
              color: '#444', lineHeight: 1.8, marginTop: 20, fontWeight: 300,
            }}>
              No proprietary pipeline. Every library is open-source or publicly
              documented. The data sources are linkable.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 1, background: 'rgba(201,184,138,0.06)',
          }}>
            {TECH.map(([name, desc]) => (
              <div key={name} style={{
                background: '#0D0D0D', padding: '24px',
                transition: 'background 0.25s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,184,138,0.035)'}
                onMouseLeave={e => e.currentTarget.style.background = '#0D0D0D'}
              >
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11, color: '#C9B88A', marginBottom: 8,
                }}>
                  {name}
                </div>
                <div style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: 11, color: '#444', lineHeight: 1.65,
                }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{
        ...sectionDivider,
        padding: '100px 48px 120px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: '#555',
          textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 28,
        }}>
          Start Exploring
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 62px)',
          fontWeight: 700, lineHeight: 1.1,
          color: '#F0E8D8', marginBottom: 52,
          letterSpacing: '-0.02em',
        }}>
          The first map is waiting.
        </h2>
        <Link to="/maps/pakistan-worker" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#0D0D0D', background: '#C9B88A',
          padding: '16px 44px', textDecoration: 'none',
          display: 'inline-block', transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Pakistan Labour Migration →
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
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: '#2a2a2a',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          AnimatedMaps © {new Date().getFullYear()}
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: '#2a2a2a', letterSpacing: '0.1em',
        }}>
          Data storytelling · Labour & Migration
        </span>
      </div>
    </div>
  );
};

export default AboutPage;