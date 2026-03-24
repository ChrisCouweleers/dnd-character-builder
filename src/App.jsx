import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './lib/useAuth'
import { fetchCharacters, createCharacter, updateCharacter, deleteCharacter } from './lib/database'
import AuthPage from './components/AuthPage'
import CharacterList from './components/CharacterList'
import CharacterCreator from './components/CharacterCreator'
import CharacterSheet from './components/CharacterSheet'
import './styles.css'

// ─── D20 Logo ───────────────────────────────────────────────────
const D20Icon = () => (
  <svg viewBox="0 0 100 100" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" stroke="#C4973B" strokeWidth="3" fill="none"/>
    <polygon points="50,5 95,30 50,50 5,30" stroke="#C4973B" strokeWidth="1.5" fill="rgba(196,151,59,0.1)"/>
    <polygon points="95,30 95,70 50,50" stroke="#C4973B" strokeWidth="1.5" fill="rgba(196,151,59,0.06)"/>
    <polygon points="50,95 95,70 50,50 5,70" stroke="#C4973B" strokeWidth="1.5" fill="rgba(196,151,59,0.04)"/>
    <polygon points="5,30 50,50 5,70" stroke="#C4973B" strokeWidth="1.5" fill="rgba(196,151,59,0.08)"/>
    <text x="50" y="56" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="22" fontWeight="700" fill="#C4973B">20</text>
  </svg>
)

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth()
  const [view, setView] = useState("list")
  const [characters, setCharacters] = useState([])
  const [selectedChar, setSelectedChar] = useState(null)
  const [charsLoading, setCharsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // ── Load characters when user signs in ────────────────────────
  const loadChars = useCallback(async () => {
    if (!user) return
    setCharsLoading(true)
    setError(null)
    try {
      const chars = await fetchCharacters()
      setCharacters(chars)
    } catch (err) {
      setError("Failed to load characters. Please try refreshing.")
      console.error(err)
    } finally {
      setCharsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) loadChars()
    else {
      setCharacters([])
      setView("list")
    }
  }, [user, loadChars])

  // ── CRUD handlers ─────────────────────────────────────────────
  const handleSaveNew = async (char) => {
    setSaving(true)
    try {
      const saved = await createCharacter(char, user.id)
      setCharacters(prev => [saved, ...prev])
      setView("list")
    } catch (err) {
      setError("Failed to save character.")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateChar = async (updated) => {
    setSelectedChar(updated)
    // Optimistic update
    setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c))
    try {
      await updateCharacter(updated, user.id)
    } catch (err) {
      console.error("Update failed:", err)
      // Reload on failure
      loadChars()
    }
  }

  const handleDeleteChar = async (id) => {
    setCharacters(prev => prev.filter(c => c.id !== id))
    if (selectedChar?.id === id) {
      setSelectedChar(null)
      setView("list")
    }
    try {
      await deleteCharacter(id)
    } catch (err) {
      console.error("Delete failed:", err)
      loadChars()
    }
  }

  const handleSelectChar = (char) => {
    setSelectedChar(char)
    setView("sheet")
  }

  // ── Auth loading ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="app">
        <div className="empty-state" style={{ marginTop: "20vh" }}>
          <div className="empty-icon">⚔️</div>
          <div className="empty-title">Forge & Fable</div>
          <div className="empty-desc">Loading...</div>
        </div>
      </div>
    )
  }

  // ── Not signed in ─────────────────────────────────────────────
  if (!user) {
    return <AuthPage signIn={signIn} signUp={signUp} resetPassword={resetPassword} />
  }

  // ── Signed in ─────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo" onClick={() => setView("list")}>
            <div className="logo-icon"><D20Icon /></div>
            <span className="logo-text">Forge & Fable</span>
          </div>
          <nav className="header-nav">
            <button className={`nav-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>Characters</button>
            <button className={`nav-btn ${view === "create" ? "active" : ""}`} onClick={() => { setSelectedChar(null); setView("create") }}>Create</button>
            <button className="nav-btn" onClick={signOut}>Sign Out</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="card" style={{ borderColor: "var(--crimson)", marginBottom: "16px" }}>
            <div style={{ color: "var(--crimson)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{error}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setError(null)}>✕</button>
            </div>
          </div>
        )}

        {view === "list" && (
          <CharacterList
            characters={characters}
            loading={charsLoading}
            onSelect={handleSelectChar}
            onCreate={() => { setSelectedChar(null); setView("create") }}
            onDelete={handleDeleteChar}
          />
        )}

        {view === "create" && (
          <CharacterCreator
            onSave={handleSaveNew}
            onCancel={() => setView("list")}
            editChar={selectedChar}
          />
        )}

        {view === "sheet" && selectedChar && (
          <CharacterSheet
            character={selectedChar}
            onUpdate={handleUpdateChar}
            onBack={() => setView("list")}
          />
        )}
      </main>
    </div>
  )
}
