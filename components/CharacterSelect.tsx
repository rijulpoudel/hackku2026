'use client'
import { motion } from 'framer-motion'
import { CharacterType } from '@/types/game'

const CHARACTERS: Array<{
  type: CharacterType
  name: string
  title: string
  subtitle: string
  salary: string
  emoji: string
  netWorth: string
  description: string
}> = [
  {
    type: 'maya',
    name: 'Maya Chen',
    title: 'PhD Student',
    subtitle: 'Biochemistry → Academic/Research',
    salary: '$28,000/year stipend',
    emoji: '🔬',
    netWorth: '-$34,000',
    description: 'Free tuition. Health insurance. Loans deferred — but accruing interest. Smart, disciplined, and completely unprepared for real-world money.',
  },
  {
    type: 'alex',
    name: 'Alex Rivera',
    title: 'Corporate Tech',
    subtitle: 'Software company, Austin TX',
    salary: '$58,000/year',
    emoji: '💼',
    netWorth: '-$29,900',
    description: 'Stable salary. 401k with 5% match. Full benefits. On paper: the dream. High enough income to build real wealth — or make expensive mistakes that compound for decades.',
  },
  {
    type: 'jordan',
    name: 'Jordan Kim',
    title: 'Freelance Creative',
    subtitle: 'Graphic design, remote',
    salary: '$0 (building)',
    emoji: '🎨',
    netWorth: '-$36,000',
    description: 'Building a client base from scratch. No employer to catch anything. Taxes, health insurance, retirement — all yours. High freedom, high responsibility.',
  },
  {
    type: 'sam',
    name: 'Sam Patel',
    title: 'Public School Teacher',
    subtitle: 'Hometown district',
    salary: '$38,000/year',
    emoji: '📚',
    netWorth: '-$31,900',
    description: 'Low income on paper. But PSLF-eligible from day one. Pension. Low cost of living. If played right, the most financially secure path of the four.',
  },
]

interface Props {
  onSelect: (character: CharacterType, name: string) => void
}

export function CharacterSelect({ onSelect }: Props) {
  return (
    <div className="character-select-wrapper">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="character-select-header"
      >
        <h2 className="character-select-title">Who are you?</h2>
        <p className="character-select-subtitle">
          Four graduates. Four completely different financial lives. Choose your path — it shapes every decision ahead.
        </p>
      </motion.div>

      <div className="character-grid">
        {CHARACTERS.map((char, i) => (
          <motion.button
            key={char.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => onSelect(char.type, char.name)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="character-card"
          >
            <div className="character-emoji">{char.emoji}</div>
            <h3 className="character-name">{char.name}</h3>
            <p className="character-salary">{char.title}</p>
            <p className="character-location">{char.subtitle}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '0.25rem 0' }}>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{char.salary}</span>
              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{char.netWorth} net worth</span>
            </div>
            <p className="character-description">{char.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
