import { supabase } from './supabase'

// ── Map JS shape ↔ DB shape ─────────────────────────────────────

function toDbRow(char, userId) {
  return {
    id: char.id,
    user_id: userId,
    name: char.name,
    race: char.race,
    subrace: char.subrace || '',
    class_name: char.className,
    level: char.level,
    background: char.background,
    ability_scores: char.abilityScores,
    hit_points: char.hitPoints,
    armor_class: char.armorClass,
    speed: char.speed,
    saving_throws: char.savingThrows || [],
    skill_proficiencies: char.skillProficiencies || [],
    equipment: char.equipment || [],
    spells: char.spells || [],
    notes: char.notes || '',
    player_name: char.playerName || '',
  }
}

function fromDbRow(row) {
  return {
    id: row.id,
    name: row.name,
    race: row.race,
    subrace: row.subrace || '',
    className: row.class_name,
    level: row.level,
    background: row.background,
    abilityScores: row.ability_scores,
    hitPoints: row.hit_points,
    armorClass: row.armor_class,
    speed: row.speed,
    savingThrows: row.saving_throws || [],
    skillProficiencies: row.skill_proficiencies || [],
    equipment: row.equipment || [],
    spells: row.spells || [],
    notes: row.notes || '',
    playerName: row.player_name || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ── CRUD ─────────────────────────────────────────────────────────

export async function fetchCharacters() {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data || []).map(fromDbRow)
}

export async function createCharacter(char, userId) {
  const row = toDbRow(char, userId)
  const { data, error } = await supabase
    .from('characters')
    .insert(row)
    .select()
    .single()

  if (error) throw error
  return fromDbRow(data)
}

export async function updateCharacter(char, userId) {
  const row = toDbRow(char, userId)
  delete row.user_id // don't overwrite owner

  const { data, error } = await supabase
    .from('characters')
    .update(row)
    .eq('id', char.id)
    .select()
    .single()

  if (error) throw error
  return fromDbRow(data)
}

export async function deleteCharacter(id) {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)

  if (error) throw error
}
