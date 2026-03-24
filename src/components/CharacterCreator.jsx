import { useState, useEffect, useMemo } from 'react'
import {
  RACES, CLASSES, BACKGROUNDS, ALL_SKILLS, ABILITIES, ABILITY_SHORT,
  calcMod, modStr, calcProfBonus, genId, roll4d6DropLowest
} from '../lib/gameData'

const WIZARD_STEPS = ["basics", "abilities", "skills", "equipment", "review"]
const STEP_LABELS = { basics: "Basics", abilities: "Abilities", skills: "Skills", equipment: "Equipment", review: "Review" }

export default function CharacterCreator({ onSave, onCancel, editChar }) {
  const [step, setStep] = useState(0)
  const [char, setChar] = useState(editChar || {
    id: genId(),
    name: "",
    race: "human",
    subrace: "",
    className: "fighter",
    level: 1,
    background: "acolyte",
    abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    hitPoints: { max: 0, current: 0, temporary: 0 },
    armorClass: 10,
    speed: 30,
    skillProficiencies: [],
    equipment: [],
    spells: [],
    notes: "",
    playerName: "",
  })

  const updateChar = (updates) => setChar(prev => ({ ...prev, ...updates }))
  const updateAbility = (ability, value) => {
    const v = Math.max(1, Math.min(30, parseInt(value) || 0))
    setChar(prev => ({ ...prev, abilityScores: { ...prev.abilityScores, [ability]: v } }))
  }

  const raceData = RACES[char.race] || RACES.human
  const subraceData = char.subrace && raceData.subraces ? raceData.subraces[char.subrace] : null
  const classData = CLASSES[char.className] || CLASSES.fighter
  const bgData = BACKGROUNDS[char.background] || BACKGROUNDS.acolyte

  const autoSkills = useMemo(() => {
    const set = new Set()
    ;(raceData.autoProficiencies || []).forEach(s => set.add(s))
    ;(bgData.skills || []).forEach(s => set.add(s))
    return [...set]
  }, [char.race, char.background])

  const maxClassSkills = classData.skillChoices
  const availableClassSkills = classData.skills.filter(s => !autoSkills.includes(s))
  const manualSkills = char.skillProficiencies.filter(s => !autoSkills.includes(s))
  const canSelectMore = manualSkills.length < maxClassSkills

  const toggleSkill = (skill) => {
    if (autoSkills.includes(skill)) return
    setChar(prev => {
      const current = prev.skillProficiencies.filter(s => !autoSkills.includes(s))
      if (current.includes(skill)) {
        return { ...prev, skillProficiencies: [...autoSkills, ...current.filter(s => s !== skill)] }
      }
      if (current.length >= maxClassSkills) return prev
      return { ...prev, skillProficiencies: [...autoSkills, ...current, skill] }
    })
  }

  useEffect(() => {
    setChar(prev => {
      const manual = prev.skillProficiencies.filter(s => !autoSkills.includes(s))
      return { ...prev, skillProficiencies: [...autoSkills, ...manual.slice(0, maxClassSkills)] }
    })
  }, [char.race, char.background, char.className])

  const getRaceBonus = (ability) => {
    let bonus = 0
    if (raceData.abilityBonuses?.[ability]) bonus += raceData.abilityBonuses[ability]
    if (subraceData?.abilityBonuses?.[ability]) bonus += subraceData.abilityBonuses[ability]
    return bonus
  }

  const getTotalAbility = (ability) => char.abilityScores[ability] + getRaceBonus(ability)

  const rollAllAbilities = () => {
    const newScores = {}
    ABILITIES.forEach(a => { newScores[a] = roll4d6DropLowest().total })
    setChar(prev => ({ ...prev, abilityScores: newScores }))
  }

  const applyStandardArray = () => {
    const arr = [15, 14, 13, 12, 10, 8]
    const newScores = {}
    ABILITIES.forEach((a, i) => { newScores[a] = arr[i] })
    setChar(prev => ({ ...prev, abilityScores: newScores }))
  }

  const [newEquipName, setNewEquipName] = useState("")
  const addEquipment = () => {
    if (!newEquipName.trim()) return
    setChar(prev => ({ ...prev, equipment: [...prev.equipment, { id: genId(), name: newEquipName.trim(), equipped: false }] }))
    setNewEquipName("")
  }
  const removeEquipment = (id) => {
    setChar(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }))
  }

  const computeHP = () => Math.max(1, classData.hitDie + calcMod(getTotalAbility("constitution")))

  const handleSave = () => {
    const speed = subraceData?.speed || raceData.speed
    const finalScores = {}
    ABILITIES.forEach(a => { finalScores[a] = getTotalAbility(a) })
    const hp = Math.max(1, classData.hitDie + calcMod(finalScores.constitution))
    const ac = 10 + calcMod(finalScores.dexterity)

    onSave({
      ...char,
      abilityScores: finalScores,
      hitPoints: { max: hp, current: hp, temporary: 0 },
      armorClass: ac,
      speed,
      savingThrows: classData.savingThrows,
    })
  }

  const currentStep = WIZARD_STEPS[step]
  const canGoNext = () => {
    if (currentStep === "basics") return char.name.trim().length > 0
    return true
  }

  return (
    <div className="fade-in">
      <div className="wizard-steps">
        {WIZARD_STEPS.map((s, i) => (
          <button key={s} className={`wizard-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`} onClick={() => i <= step && setStep(i)}>
            {i < step ? "✓ " : ""}{STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {/* STEP: BASICS */}
      {currentStep === "basics" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">📜</span> Character Basics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Character Name</label>
              <input className="form-input" value={char.name} onChange={e => updateChar({ name: e.target.value })} placeholder="Enter your character's name" maxLength={50} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Race</label>
              <select className="form-select" value={char.race} onChange={e => updateChar({ race: e.target.value, subrace: "" })}>
                {Object.entries(RACES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {raceData.subraces && (
              <div className="form-group">
                <label className="form-label">Subrace</label>
                <select className="form-select" value={char.subrace} onChange={e => updateChar({ subrace: e.target.value })}>
                  <option value="">Choose subrace...</option>
                  {Object.entries(raceData.subraces).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Class</label>
              <select className="form-select" value={char.className} onChange={e => updateChar({ className: e.target.value })}>
                {Object.entries(CLASSES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <input className="form-input" type="number" min={1} max={20} value={char.level} onChange={e => updateChar({ level: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Background</label>
              <select className="form-select" value={char.background} onChange={e => updateChar({ background: e.target.value })}>
                {Object.entries(BACKGROUNDS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Player Name</label>
              <input className="form-input" value={char.playerName} onChange={e => updateChar({ playerName: e.target.value })} placeholder="Your name (optional)" maxLength={30} />
            </div>
          </div>
          <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "12px", background: "var(--parchment)", borderRadius: "var(--radius)", border: "1px solid var(--parchment-deep)" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-ghost)", marginBottom: "4px" }}>Race Traits</div>
              <div style={{ fontSize: "14px", color: "var(--ink-faded)" }}>
                Speed {subraceData?.speed || raceData.speed}ft • {[...(raceData.traits || []), ...(subraceData?.traits || [])].join(", ")}
              </div>
            </div>
            <div style={{ padding: "12px", background: "var(--parchment)", borderRadius: "var(--radius)", border: "1px solid var(--parchment-deep)" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-ghost)", marginBottom: "4px" }}>Class Features</div>
              <div style={{ fontSize: "14px", color: "var(--ink-faded)" }}>
                Hit Die d{classData.hitDie} • Primary {ABILITY_SHORT[classData.primaryAbility]} • Saves {classData.savingThrows.map(s => ABILITY_SHORT[s]).join(", ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP: ABILITIES */}
      {currentStep === "abilities" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">💪</span> Ability Scores</div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <button className="btn btn-secondary btn-sm" onClick={rollAllAbilities}>🎲 Roll 4d6 Drop Lowest</button>
            <button className="btn btn-secondary btn-sm" onClick={applyStandardArray}>📊 Standard Array</button>
          </div>
          <div className="ability-grid">
            {ABILITIES.map(ability => {
              const bonus = getRaceBonus(ability)
              const isPrimary = ability === classData.primaryAbility
              return (
                <div key={ability} className={`ability-block ${isPrimary ? "primary" : ""}`}>
                  <div className="ability-name">{ABILITY_SHORT[ability]}</div>
                  <input className="ability-score-input" type="number" min={1} max={30} value={char.abilityScores[ability]} onChange={e => updateAbility(ability, e.target.value)} />
                  {bonus > 0 && <div className="ability-bonus">+{bonus} racial</div>}
                  <div className="ability-mod">{modStr(calcMod(getTotalAbility(ability)))}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--ink-ghost)", textAlign: "center" }}>
            Total (with racial bonuses): {ABILITIES.map(a => getTotalAbility(a)).reduce((s, v) => s + v, 0)} points
          </div>
        </div>
      )}

      {/* STEP: SKILLS */}
      {currentStep === "skills" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">🎯</span> Skill Proficiencies</div>
          <div style={{ fontSize: "14px", color: "var(--ink-faded)", marginBottom: "16px" }}>
            Choose <strong>{maxClassSkills}</strong> class skills ({manualSkills.length}/{maxClassSkills} selected).
            Green skills are granted automatically by your race or background.
          </div>
          <div className="skills-grid">
            {Object.entries(ALL_SKILLS).map(([skill, ability]) => {
              const isAuto = autoSkills.includes(skill)
              const isManual = manualSkills.includes(skill)
              const isAvailable = availableClassSkills.includes(skill)
              const isChecked = isAuto || isManual
              const isDisabled = isAuto || (!isManual && !canSelectMore) || (!isAuto && !isAvailable && !isManual)
              const mod = calcMod(getTotalAbility(ability))
              const bonus = isChecked ? mod + calcProfBonus(char.level) : mod

              return (
                <label key={skill} className={`skill-row ${isAuto ? "auto" : ""}`} style={{ opacity: (!isAvailable && !isAuto && !isManual) ? 0.4 : 1 }}>
                  <input type="checkbox" checked={isChecked} disabled={isDisabled} onChange={() => toggleSkill(skill)} />
                  <span className="skill-ability">{ABILITY_SHORT[ability]}</span>
                  <span className="skill-name">{skill}</span>
                  <span className="skill-bonus">{modStr(bonus)}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP: EQUIPMENT */}
      {currentStep === "equipment" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">🎒</span> Equipment</div>
          <div style={{ fontSize: "14px", color: "var(--ink-faded)", marginBottom: "16px" }}>
            Add your starting equipment. You can always edit this later on your character sheet.
          </div>
          {char.equipment.map(item => (
            <div key={item.id} className="equip-item">
              <span className="equip-name">{item.name}</span>
              <button className="btn btn-danger btn-sm" onClick={() => removeEquipment(item.id)}>✕</button>
            </div>
          ))}
          <div className="add-equip-row">
            <input className="form-input" value={newEquipName} onChange={e => setNewEquipName(e.target.value)} placeholder="Item name..." onKeyDown={e => e.key === "Enter" && addEquipment()} />
            <button className="btn btn-secondary" onClick={addEquipment}>Add</button>
          </div>
        </div>
      )}

      {/* STEP: REVIEW */}
      {currentStep === "review" && (
        <div className="card fade-in">
          <div className="card-title"><span className="icon">✅</span> Review Character</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div><div className="form-label">Name</div><div style={{ fontSize: "18px", fontWeight: 600 }}>{char.name || "Unnamed"}</div></div>
            <div><div className="form-label">Race</div><div>{raceData.label}{subraceData ? ` (${subraceData.label})` : ""}</div></div>
            <div><div className="form-label">Class & Level</div><div>{classData.icon} {classData.label} {char.level}</div></div>
            <div><div className="form-label">Background</div><div>{bgData.label}</div></div>
            <div><div className="form-label">Hit Points</div><div>{computeHP()}</div></div>
            <div><div className="form-label">Armor Class</div><div>{10 + calcMod(getTotalAbility("dexterity"))}</div></div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <div className="form-label">Ability Scores (with racial bonuses)</div>
            <div className="ability-display-grid">
              {ABILITIES.map(a => (
                <div key={a} className="ability-display">
                  <div className="ability-display-name">{ABILITY_SHORT[a]}</div>
                  <div className="ability-display-mod">{modStr(calcMod(getTotalAbility(a)))}</div>
                  <div className="ability-display-score">{getTotalAbility(a)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <div className="form-label">Proficiencies</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[...new Set([...autoSkills, ...manualSkills])].map(s => (
                <span key={s} className="tag" style={{ fontSize: "12px" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="wizard-nav">
        <div style={{ display: "flex", gap: "8px" }}>
          {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>}
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
        <div>
          {step < WIZARD_STEPS.length - 1 ? (
            <button className="btn btn-primary" disabled={!canGoNext()} onClick={() => setStep(step + 1)}>Next →</button>
          ) : (
            <button className="btn btn-gold btn-lg" disabled={!char.name.trim()} onClick={handleSave}>
              {editChar ? "Save Changes" : "⚔️ Create Character"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
