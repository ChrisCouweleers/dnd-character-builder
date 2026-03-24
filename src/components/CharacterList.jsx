import { useState } from 'react'
import { RACES, CLASSES } from '../lib/gameData'
import ConfirmModal from './ConfirmModal'

export default function CharacterList({ characters, onSelect, onCreate, onDelete, loading }) {
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (loading) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">⏳</div>
        <div className="empty-title">Loading characters...</div>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">⚔️</div>
        <div className="empty-title">No Adventurers Yet</div>
        <div className="empty-desc">Create your first character to begin your journey.</div>
        <button className="btn btn-gold btn-lg" onClick={onCreate}>✦ Create Character</button>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "22px", color: "var(--ink-light)" }}>Your Characters</h2>
        <button className="btn btn-gold" onClick={onCreate}>✦ New Character</button>
      </div>

      <div className="character-grid">
        {characters.map(c => {
          const cls = CLASSES[c.className] || CLASSES.fighter
          const race = RACES[c.race] || RACES.human
          return (
            <div key={c.id} className="char-card">
              <div className="char-card-level">Lvl {c.level}</div>
              <div className="char-card-icon">{cls.icon}</div>
              <div className="char-card-name">{c.name}</div>
              <div className="char-card-detail">{race.label} {cls.label}</div>
              <div className="char-card-detail" style={{ fontSize: "13px", marginTop: "2px" }}>
                HP: {c.hitPoints?.current || 0}/{c.hitPoints?.max || 0} • AC: {c.armorClass || 10}
              </div>
              <div className="char-card-actions">
                <button className="btn btn-primary btn-sm" onClick={() => onSelect(c)}>Open</button>
                <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); setConfirmDelete(c.id) }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Character?"
          message="This cannot be undone. The character will be permanently removed."
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
