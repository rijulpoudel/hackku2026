'use client'
import { motion } from 'framer-motion'
import { CharacterType } from '@/types/game'

const CHARACTERS: Array<{
  type: CharacterType
  title: string
  subtitle: string
  salary: string
  emoji: string
  description: string
}> = [
  {
    type: 'employee',
    title: 'Corporate Employee',
    subtitle: 'Software company, Austin TX',
    salary: '$52,000/year',
    emoji: '💼',
    description: 'Stable salary. 401k with match. Health insurance. The classic path.',
  },
  {
    type: 'freelancer',
    title: 'Freelancer',
    subtitle: 'Design & web, remote',
    salary: '$48,000/year',
    emoji: '🎨',
    description: 'Variable income. No benefits. Full control. Self-employment taxes.',
  },
  {
    type: 'student',
    title: 'Grad Student',
    subtitle: 'Stipend + part-time work',
    salary: '$28,000/year',
    emoji: '📚',
    description: 'Low income now. High potential later. Unique tax situation.',
  },
  {
    type: 'side-hustler',
    title: 'Side Hustler',
    subtitle: 'Day job + side business',
    salary: '$58,000/year',
    emoji: '🚀',
    description: 'Two income streams. Complex taxes. High upside. High stress.',
  },
]

interface Props {
  onSelect: (character: CharacterType, name: string) => void
}

export function CharacterSelect({ onSelect }: Props) {
  const handleSelect = (type: CharacterType) => {
    const names: Record<CharacterType, string> = {
      employee: 'Alex',
      freelancer: 'Jordan',
      student: 'Casey',
      'side-hustler': 'Morgan',
    }
    onSelect(type, names[type])
  }

  return (
    <div className="character-select-wrapper">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="character-select-header"
      >
        <h2 className="character-select-title">Who are you?</h2>
        <p className="character-select-subtitle">
          Every graduate starts differently. Choose your path — it shapes every decision ahead.
        </p>
      </motion.div>

      <div className="character-grid">
        {CHARACTERS.map((char, i) => (
          <motion.button
            key={char.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => handleSelect(char.type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="character-card"
          >
            <div className="character-emoji">{char.emoji}</div>
            <h3 className="character-name">{char.title}</h3>
            <p className="character-salary">{char.salary}</p>
            <p className="character-location">{char.subtitle}</p>
            <p className="character-description">{char.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
