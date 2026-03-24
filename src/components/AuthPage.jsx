import { useState } from 'react'

// ─── D20 Logo (larger for hero) ─────────────────────────────────
const D20Hero = () => (
  <svg viewBox="0 0 100 100" width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" stroke="#C4973B" strokeWidth="2.5" fill="rgba(196,151,59,0.06)"/>
    <polygon points="50,5 95,30 50,50 5,30" stroke="#C4973B" strokeWidth="1" fill="rgba(196,151,59,0.1)"/>
    <polygon points="95,30 95,70 50,50" stroke="#C4973B" strokeWidth="1" fill="rgba(196,151,59,0.06)"/>
    <polygon points="50,95 95,70 50,50 5,70" stroke="#C4973B" strokeWidth="1" fill="rgba(196,151,59,0.04)"/>
    <polygon points="5,30 50,50 5,70" stroke="#C4973B" strokeWidth="1" fill="rgba(196,151,59,0.08)"/>
    <text x="50" y="57" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="22" fontWeight="700" fill="#C4973B">20</text>
  </svg>
)

const FEATURES = [
  { icon: '📜', title: 'Guided Creation', desc: 'Step-by-step wizard walks you through race, class, abilities, skills, and equipment.' },
  { icon: '🎲', title: 'Built-in Dice', desc: 'Roll ability checks, saving throws, and skill checks right from your character sheet.' },
  { icon: '💪', title: 'Full 5e Rules', desc: '10 races with subraces, 12 classes, 13 backgrounds — all modifiers calculated for you.' },
  { icon: '☁️', title: 'Cloud Saves', desc: 'Your characters are saved to the cloud. Access them from any device, anytime.' },
]

export default function AuthPage({ onAuth, signIn, signUp, resetPassword }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setConfirmMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setConfirmMsg('')

    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }

    if (mode === 'reset') {
      setLoading(true)
      try {
        await resetPassword(email)
        setConfirmMsg('Password reset link sent! Check your email.')
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const data = await signUp(email, password)
        if (data?.user && !data.session) {
          setConfirmMsg('Check your email for a confirmation link, then sign in.')
        }
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing-page">

      {/* ── TOP BAR ── */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <D20Hero />
            <span className="landing-logo-text">Forge & Fable</span>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="landing-hero">
        <div className="landing-hero-inner">

          {/* Left: copy */}
          <div className="landing-hero-copy">
            <h1 className="landing-headline">
              Your D&D Characters,<br />
              <span className="landing-headline-accent">Forged & Ready</span>
            </h1>
            <p className="landing-subheadline">
              Build, manage, and play your Dungeons & Dragons 5th Edition characters
              with a guided creation wizard, interactive character sheets, and built-in
              dice rolling — all saved to the cloud.
            </p>
            <div className="landing-badges">
              <span className="landing-badge">✦ Free to Use</span>
              <span className="landing-badge">✦ No Downloads</span>
              <span className="landing-badge">✦ D&D 5e</span>
            </div>
          </div>

          {/* Right: auth card */}
          <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 className="auth-title">
                {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Begin Your Journey' : 'Reset Password'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'signin'
                  ? 'Sign in to access your characters'
                  : mode === 'signup'
                  ? 'Create a free account to get started'
                  : 'Enter your email to receive a reset link'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adventurer@example.com"
                  autoFocus
                  autoComplete="email"
                />
              </div>

              {mode !== 'reset' && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>
              )}

              {error && <div className="auth-error">{error}</div>}
              {confirmMsg && <div className="auth-confirm">{confirmMsg}</div>}

              <button
                className="btn btn-gold btn-lg"
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                {loading
                  ? 'Loading...'
                  : mode === 'signup'
                  ? 'Create Account'
                  : mode === 'reset'
                  ? 'Send Reset Link'
                  : 'Sign In'}
              </button>
            </form>

            <div className="auth-switch">
              {mode === 'signin' && (
                <>
                  <div>
                    <button className="auth-switch-btn" onClick={() => switchMode('reset')}>
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    New adventurer?{' '}
                    <button className="auth-switch-btn" onClick={() => switchMode('signup')}>
                      Create account
                    </button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div>
                  Already have an account?{' '}
                  <button className="auth-switch-btn" onClick={() => switchMode('signin')}>
                    Sign in
                  </button>
                </div>
              )}
              {mode === 'reset' && (
                <div>
                  Remember your password?{' '}
                  <button className="auth-switch-btn" onClick={() => switchMode('signin')}>
                    Back to sign in
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features">
        <div className="landing-features-inner">
          <h2 className="landing-section-title">Everything You Need to Play</h2>
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-steps">
        <div className="landing-steps-inner">
          <h2 className="landing-section-title">Ready in Three Steps</h2>
          <div className="landing-steps-grid">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <h3 className="landing-step-title">Create an Account</h3>
              <p className="landing-step-desc">Sign up with your email — it's free and takes seconds.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <h3 className="landing-step-title">Build Your Character</h3>
              <p className="landing-step-desc">Pick race, class, and background. Roll or assign ability scores. Choose skills.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <h3 className="landing-step-title">Play</h3>
              <p className="landing-step-desc">Use your interactive character sheet at the table — roll checks, track HP, manage gear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <D20Hero />
          <p className="landing-footer-text">
            Forge & Fable — A D&D 5e Character Builder
          </p>
          <p className="landing-footer-sub">
            Not affiliated with Wizards of the Coast. D&D content used under the Open Gaming License.
          </p>
        </div>
      </footer>
    </div>
  )
}
