import { useState } from 'react'
import { rollDice } from '../lib/gameData'

export default function DiceRoller() {
  const [result, setResult] = useState(null)
  const dice = [4, 6, 8, 10, 12, 20, 100]

  const roll = (sides) => {
    const rolls = rollDice(sides, 1)
    setResult({ sides, rolls, total: rolls[0] })
  }

  return (
    <div className="card fade-in">
      <div className="card-title"><span className="icon">🎲</span> Dice Roller</div>
      <div className="dice-tray">
        {dice.map(d => (
          <button key={d} className="dice-btn" onClick={() => roll(d)}>d{d}</button>
        ))}
      </div>
      {result && (
        <div className="dice-result roll-animate" key={result.total + Math.random()}>
          <div className="dice-result-value">{result.total}</div>
          <div className="dice-result-detail">Rolled 1d{result.sides}</div>
        </div>
      )}
    </div>
  )
}
