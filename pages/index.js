import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Particle System ────────────────────────────────────────────────────────
function Particles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: i % 3 === 0
              ? 'rgba(245,197,24,0.7)'
              : i % 3 === 1
              ? 'rgba(168,85,247,0.6)'
              : 'rgba(59,130,246,0.5)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MOODS = [
  { value: 'relax',     emoji: '🏖️',  label: 'Relax'     },
  { value: 'adventure', emoji: '🧗',   label: 'Adventure' },
  { value: 'romantic',  emoji: '🍷',   label: 'Romantic'  },
  { value: 'cultural',  emoji: '🏛️',  label: 'Culture'   },
  { value: 'party',     emoji: '🪩',   label: 'Party'     },
];

const TRAVEL_TYPES = [
  { value: 'solo',    emoji: '🧘',  label: 'Solo'    },
  { value: 'couple',  emoji: '👫',  label: 'Couple'  },
  { value: 'friends', emoji: '👯',  label: 'Friends' },
  { value: 'family',  emoji: '👨‍👩‍👧', label: 'Family'  },
];

const BUDGETS = [
  { value: 'low',     emoji: '🎒',  label: 'Budget',  sub: 'Backpacking' },
  { value: 'medium',  emoji: '✈️',  label: 'Comfort', sub: 'Mid-range'   },
  { value: 'luxury',  emoji: '👑',  label: 'Luxury',  sub: 'Premium'     },
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp    = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const fadeLeft  = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 30 },  show: { opacity: 1, x: 0 } };
const stagger   = { show: { transition: { staggerChildren: 0.1 } } };

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    budget: 'medium',
    mood: 'relax',
    days: 3,
    travelType: 'solo',
    hiddenGems: false,
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [mounted, setMounted] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const handleField = (name, value) =>
    setFormData(p => ({ ...p, [name]: value }));

  const generateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Wanderlust AI — Your Dream Trip Awaits</title>
        <meta name="description" content="AI-powered travel planner. Get personalized itineraries tailored to your mood, budget and travel style." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>

      {/* ── Background ── */}
      <div className="stars-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <Particles />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ── NAV ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>✈️</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              Wanderlust<span className="grad-gold">AI</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', alignItems: 'center' }}>
            <span style={{
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 999,
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}>● Live AI</span>
          </div>
        </motion.nav>

        {/* ── HERO ── */}
        <motion.section
          initial="hidden" animate="show" variants={stagger}
          style={{ textAlign: 'center', padding: '60px 24px 40px' }}
        >
          <motion.div variants={fadeUp} className="hero-float" style={{ marginBottom: 24 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(245,197,24,0.1)',
              border: '1px solid rgba(245,197,24,0.3)',
              borderRadius: 999,
              padding: '6px 20px',
              fontSize: '0.8rem',
              color: '#f5c518',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>✨ Powered by Groq AI</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Your Dream Trip,<br />
            <span className="grad-text">Crafted by AI</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1.1rem',
              maxWidth: 520,
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Tell us your vibe. We'll build you a personalized, day-by-day itinerary with hidden gems and budget insights.
          </motion.p>
        </motion.section>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
          className="main-grid"
        >

          {/* ─── FORM ─── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={generateTrip} className="glass" style={{ padding: 32 }}>

              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🗺️</span> Plan Your Journey
              </h2>

              {/* Destination */}
              <div style={{ marginBottom: 22 }}>
                <div className="section-label">Where to?</div>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Paris, Bali, Tokyo… or surprise me!"
                  required
                  value={formData.destination}
                  onChange={e => handleField('destination', e.target.value)}
                />
              </div>

              {/* Days */}
              <div style={{ marginBottom: 22 }}>
                <div className="section-label">Duration (days)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    type="button"
                    onClick={() => handleField('days', Math.max(1, formData.days - 1))}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '1.3rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >−</button>
                  <span style={{ fontSize: '2rem', fontWeight: 800, minWidth: 32, textAlign: 'center', color: '#f5c518' }}>
                    {formData.days}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleField('days', Math.min(14, formData.days + 1))}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '1.3rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >+</button>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>1–14 days</span>
                </div>
              </div>

              {/* Mood */}
              <div style={{ marginBottom: 22 }}>
                <div className="section-label">Your Vibe</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {MOODS.map(m => (
                    <div
                      key={m.value}
                      className={`mood-pill ${formData.mood === m.value ? 'active' : ''}`}
                      onClick={() => handleField('mood', m.value)}
                    >
                      {m.emoji} {m.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Type */}
              <div style={{ marginBottom: 22 }}>
                <div className="section-label">Traveling As</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TRAVEL_TYPES.map(t => (
                    <div
                      key={t.value}
                      className={`mood-pill ${formData.travelType === t.value ? 'active' : ''}`}
                      onClick={() => handleField('travelType', t.value)}
                    >
                      {t.emoji} {t.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 22 }}>
                <div className="section-label">Budget Style</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {BUDGETS.map(b => (
                    <div
                      key={b.value}
                      onClick={() => handleField('budget', b.value)}
                      style={{
                        background: formData.budget === b.value
                          ? 'linear-gradient(135deg, rgba(245,197,24,0.2), rgba(255,149,0,0.1))'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${formData.budget === b.value ? 'rgba(245,197,24,0.6)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 14,
                        padding: '14px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: formData.budget === b.value ? '0 0 20px rgba(245,197,24,0.15)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{b.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: formData.budget === b.value ? '#f5c518' : '#fff' }}>{b.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{b.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Gems Toggle */}
              <div style={{ marginBottom: 28 }}>
                <div
                  className="toggle-wrap"
                  onClick={() => handleField('hiddenGems', !formData.hiddenGems)}
                >
                  <div className={`toggle-track ${formData.hiddenGems ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>💎 Hidden Gems Mode</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Skip tourist traps, find local secrets</div>
                  </div>
                </div>
              </div>

              <div className="glow-line" />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)',
                      borderTop: '2px solid #000', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }} />
                    Crafting your journey...
                  </>
                ) : (
                  <> ✨ Generate My Trip</>
                )}
              </button>

            </form>
          </motion.div>

          {/* ─── OUTPUT ─── */}
          <div ref={resultRef}>
            <AnimatePresence mode="wait">

              {/* Empty State */}
              {!result && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass"
                  style={{
                    padding: 48,
                    textAlign: 'center',
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    style={{ fontSize: 72 }}
                  >🌍</motion.div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.7 }}>
                    Fill in your preferences and hit<br />
                    <strong style={{ color: '#f5c518' }}>Generate My Trip</strong> to begin your adventure
                  </p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    {['🗼', '🏝️', '🗻', '🏜️', '🌊'].map((e, i) => (
                      <motion.span
                        key={i}
                        style={{ fontSize: 24, cursor: 'default' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      >{e}</motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Loading State */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass"
                  style={{
                    padding: 48, textAlign: 'center', minHeight: 400,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 24,
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div className="spinner" />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>✈️</div>
                  </div>
                  <div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f5c518', marginBottom: 6 }}>
                      Consulting AI travel experts...
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                      Discovering hidden gems just for you
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c518' }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 20,
                    padding: 28,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>Generation Failed</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{error}</div>
                </motion.div>
              )}

              {/* Results */}
              {result && !loading && (
                <motion.div
                  key="result"
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >

                  {/* Story Card */}
                  <motion.div variants={fadeUp}>
                    <div className="story-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <span style={{ fontSize: 20 }}>✨</span>
                        <span style={{ fontWeight: 700, color: '#f5c518', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Your Trip Story
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.15rem',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.85)',
                        fontStyle: 'italic',
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        {result.story}
                      </p>
                    </div>
                  </motion.div>

                  {/* Budget Card */}
                  <motion.div variants={fadeUp} className="glass" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                      <span style={{ fontSize: 20 }}>💰</span>
                      <span style={{ fontWeight: 700 }}>Budget Breakdown</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      {[
                        { icon: '🏨', label: 'Stay',      value: result.budget?.stay      },
                        { icon: '🍜', label: 'Food',      value: result.budget?.food      },
                        { icon: '🚌', label: 'Transport', value: result.budget?.transport },
                      ].map(b => (
                        <div key={b.label} className="budget-pill">
                          <div style={{ fontSize: 26, marginBottom: 8 }}>{b.icon}</div>
                          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{b.label}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.4 }}>{b.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Itinerary */}
                  <motion.div variants={fadeUp} className="glass" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                      <span style={{ fontSize: 20 }}>📅</span>
                      <span style={{ fontWeight: 700 }}>Day-by-Day Itinerary</span>
                      <span style={{
                        marginLeft: 'auto',
                        background: 'rgba(245,197,24,0.1)',
                        border: '1px solid rgba(245,197,24,0.3)',
                        borderRadius: 999,
                        padding: '3px 12px',
                        fontSize: '0.75rem',
                        color: '#f5c518',
                        fontWeight: 600,
                      }}>{result.itinerary?.length} days</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {result.itinerary?.map((item, i) => (
                        <motion.div
                          key={i}
                          variants={fadeUp}
                          className="day-card"
                          style={{ display: 'flex', gap: 16 }}
                        >
                          <div className="day-number">{item.day}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                              Day {item.day}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                              {item.plan}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Reset */}
                  <motion.button
                    variants={fadeUp}
                    onClick={() => setResult(null)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.4)',
                      borderRadius: 12,
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={{ borderColor: 'rgba(245,197,24,0.4)', color: '#f5c518' }}
                  >
                    ↩ Plan Another Trip
                  </motion.button>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '20px 24px',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.8rem',
        }}>
          WanderlustAI · Powered by Groq LLaMA 3.3 · Built with Next.js
        </div>
      </div>

      {/* ── RESPONSIVE ── */}
      <style>{`
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
