import { useState } from 'react'
import {
  RACES, CLASSES, BACKGROUNDS, ALL_SKILLS, ABILITIES, ABILITY_SHORT,
  calcMod, modStr, calcProfBonus, genId, rollDice
} from '../lib/gameData'
import DiceRoller from './DiceRoller'

export default function CharacterSheet({ character, onUpdate, onBack }) {
  const [char, setChar] = useState(character)
  const [tab, setTab] = useState("stats")
  const [hpDelta, setHpDelta] = useState("")
  const [diceResult, setDiceResult] = useState(null)
  const [newEquipName, setNewEquipName] = useState("")

  const classData = CLASSES[char.className] || CLASSES.fighter
  const raceData = RACES[char.race] || RACES.human
  const bgData = BACKGROUNDS[char.background] || BACKGROUNDS.acolyte
  const profBonus = calcProfBonus(char.level)
  const allProfs = char.skillProficiencies || []

  const updateAndSave = (updates) => {
    const updated = { ...char, ...updates }
    setChar(updated)
    onUpdate(updated)
  }

  const adjustHP = (amount) => {
    const delta = parseInt(amount)
    if (isNaN(delta)) return
    const newCurrent = Math.max(0, Math.min(char.hitPoints.max, char.hitPoints.current + delta))
    updateAndSave({ hitPoints: { ...char.hitPoints, current: newCurrent } })
    setHpDelta("")
  }

  const hpPercent = char.hitPoints.max > 0 ? (char.hitPoints.current / char.hitPoints.max) * 100 : 0
  const hpClass = hpPercent > 50 ? "healthy" : hpPercent > 25 ? "wounded" : "critical"

  const rollCheck = (mod, label) => {
    const roll = rollDice(20, 1)[0]
    setDiceResult({ roll, mod, total: roll + mod, label, nat: roll === 20 ? "NAT 20!" : roll === 1 ? "NAT 1!" : null })
  }

  const addEquip = () => {
    if (!newEquipName.trim()) return
    updateAndSave({ equipment: [...(char.equipment || []), { id: genId(), name: newEquipName.trim(), equipped: false }] })
    setNewEquipName("")
  }

  const removeEquip = (id) => updateAndSave({ equipment: (char.equipment || []).filter(e => e.id !== id) })
  const toggleEquip = (id) => updateAndSave({ equipment: (char.equipment || []).map(e => e.id === id ? { ...e, equipped: !e.equipped } : e) })

  const TABS = ["stats", "skills", "equipment", "notes", "dice"]

  return (
    <div className="fade-in">
      <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: "16px" }}>← All Characters</button>

      {/* Header */}
      <div className="card">
        <div className="sheet-header">
          <div className="sheet-avatar">{classData.icon}</div>
          <div className="sheet-info">
            <div className="sheet-name">{char.name}</div>
            <div className="sheet-subtitle">Level {char.level} {raceData.label} {classData.label}</div>
            <div className="sheet-tags">
              <span className="tag tag-gold">Lvl {char.level}</span>
              <span className="tag">{bgData.label}</span>
              <span className="tag tag-crimson">Prof +{profBonus}</span>
              {char.playerName && <span className="tag">Player: {char.playerName}</span>}
            </div>
          </div>
        </div>

        {/* HP Bar */}
        <div className="hp-bar-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-ghost)" }}>Hit Points</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "var(--ink-faded)" }}>
              {char.hitPoints.current} / {char.hitPoints.max}
              {char.hitPoints.temporary > 0 && <span style={{ color: "var(--sapphire)" }}> (+{char.hitPoints.temporary} temp)</span>}
            </span>
          </div>
          <div className="hp-bar-track">
            <div className={`hp-bar-fill ${hpClass}`} style={{ width: `${hpPercent}%` }} />
          </div>
          <div className="hp-controls">
            <input className="hp-input" type="number" value={hpDelta} onChange={e => setHpDelta(e.target.value)} placeholder="±" />
            <button className="btn btn-secondary btn-sm" onClick={() => adjustHP(parseInt(hpDelta) || 0)}>Heal</button>
            <button className="btn btn-danger btn-sm" onClick={() => adjustHP(-(Math.abs(parseInt(hpDelta)) || 0))}>Damage</button>
            <button className="btn btn-secondary btn-sm" onClick={() => updateAndSave({ hitPoints: { ...char.hitPoints, current: char.hitPoints.max } })}>Full Heal</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stat-row">
          <div className="stat-block">
            <div className="stat-value">{char.armorClass}</div>
            <div className="stat-label">Armor Class</div>
          </div>
          <div className="stat-block" style={{ cursor: "pointer" }} onClick={() => rollCheck(calcMod(char.abilityScores.dexterity), "Initiative")}>
            <div className="stat-value">{modStr(calcMod(char.abilityScores.dexterity))}</div>
            <div className="stat-label">Initiative</div>
          </div>
          <div className="stat-block">
            <div className="stat-value">{char.speed}ft</div>
            <div className="stat-label">Speed</div>
          </div>
          <div className="stat-block">
            <div className="stat-value">{10 + calcMod(char.abilityScores.wisdom) + (allProfs.includes("Perception") ? profBonus : 0)}</div>
            <div className="stat-label">Passive Perception</div>
          </div>
        </div>
      </div>

      {/* Dice result toast */}
      {diceResult && (
        <div className="card roll-animate" style={{ borderColor: diceResult.nat ? (diceResult.roll === 20 ? "var(--gold)" : "var(--crimson)") : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "36px", fontWeight: 500, color: diceResult.nat ? (diceResult.roll === 20 ? "var(--gold)" : "var(--crimson)") : "var(--ink)" }}>{diceResult.total}</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>{diceResult.label} Check</div>
              <div style={{ fontSize: "14px", color: "var(--ink-faded)" }}>
                d20 ({diceResult.roll}) {modStr(diceResult.mod)}
                {diceResult.nat && <strong style={{ marginLeft: "8px", color: diceResult.roll === 20 ? "var(--gold)" : "var(--crimson)" }}>{diceResult.nat}</strong>}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setDiceResult(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="section-tabs">
        {TABS.map(t => (
          <button key={t} className={`section-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "stats" ? "Abilities" : t === "skills" ? "Skills" : t === "equipment" ? "Equipment" : t === "notes" ? "Notes" : "Dice"}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">💪</span> Ability Scores & Saving Throws</div>
          <div style={{ fontSize: "13px", color: "var(--ink-ghost)", marginBottom: "12px" }}>Click an ability to roll a check. Gold border = saving throw proficiency.</div>
          <div className="ability-display-grid">
            {ABILITIES.map(ability => {
              const score = char.abilityScores[ability]
              const mod = calcMod(score)
              const hasSaveProf = (char.savingThrows || []).includes(ability)
              const saveMod = hasSaveProf ? mod + profBonus : mod
              return (
                <div key={ability} className={`ability-display ${hasSaveProf ? "saving-prof" : ""}`} style={{ cursor: "pointer" }} onClick={() => rollCheck(mod, ABILITY_SHORT[ability])}>
                  <div className="ability-display-name">{ABILITY_SHORT[ability]}</div>
                  <div className="ability-display-mod">{modStr(mod)}</div>
                  <div className="ability-display-score">{score}</div>
                  <div className="ability-display-save">Save {modStr(saveMod)}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="form-label">Racial Traits</div>
            {(raceData.traits || []).map((t, i) => <div key={i} className="trait-item">{t}</div>)}
          </div>
          <div style={{ marginTop: "16px" }}>
            <div className="form-label">Background Feature</div>
            <div className="trait-item">{bgData.feature}</div>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">🎯</span> Skills</div>
          <div style={{ fontSize: "13px", color: "var(--ink-ghost)", marginBottom: "12px" }}>Click a skill to roll a check.</div>
          <div className="skills-display">
            {Object.entries(ALL_SKILLS).map(([skill, ability]) => {
              const mod = calcMod(char.abilityScores[ability])
              const isProf = allProfs.includes(skill)
              const bonus = isProf ? mod + profBonus : mod
              return (
                <div key={skill} className="skill-display-row" style={{ cursor: "pointer" }} onClick={() => rollCheck(bonus, skill)}>
                  <span className={`skill-prof-dot ${isProf ? "filled" : ""}`} />
                  <span className="skill-display-bonus">{modStr(bonus)}</span>
                  <span className="skill-display-name">{skill}</span>
                  <span className="skill-display-ability">{ABILITY_SHORT[ability]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === "equipment" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">🎒</span> Equipment & Inventory</div>
          {(char.equipment || []).length === 0 && <div style={{ fontSize: "14px", color: "var(--ink-ghost)", marginBottom: "12px" }}>No equipment yet. Add items below.</div>}
          {(char.equipment || []).map(item => (
            <div key={item.id} className="equip-item">
              <input type="checkbox" checked={item.equipped} onChange={() => toggleEquip(item.id)} style={{ accentColor: "var(--crimson)" }} />
              <span className="equip-name" style={{ opacity: item.equipped ? 1 : 0.7 }}>{item.name}</span>
              {item.equipped && <span className="tag tag-gold" style={{ fontSize: "9px" }}>Equipped</span>}
              <button className="btn btn-danger btn-sm" onClick={() => removeEquip(item.id)}>✕</button>
            </div>
          ))}
          <div className="add-equip-row">
            <input className="form-input" value={newEquipName} onChange={e => setNewEquipName(e.target.value)} placeholder="Add item..." onKeyDown={e => e.key === "Enter" && addEquip()} />
            <button className="btn btn-secondary" onClick={addEquip}>Add</button>
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">📝</span> Notes</div>
          <textarea className="notes-area" value={char.notes || ""} onChange={e => updateAndSave({ notes: e.target.value })} placeholder="Character backstory, session notes, spell slots tracking..." />
        </div>
      )}

      {tab === "dice" && <DiceRoller />}
    </div>
  )
}
