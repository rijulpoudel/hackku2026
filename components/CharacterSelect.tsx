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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-light text-white mb-3">Who are you?</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Every graduate starts differently. Choose your path — it shapes every decision ahead.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {CHARACTERS.map((char, i) => (
          <motion.button
            key={char.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            onClick={() => handleSelect(char.type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-left p-5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 hover:border-amber-400/30 transition-all duration-200"
          >
            <div className="text-3xl mb-3">{char.emoji}</div>
            <h3 className="text-white font-medium mb-1">{char.title}</h3>
            <p className="text-amber-400 text-xs font-medium mb-1">{char.salary}</p>
            <p className="text-gray-500 text-xs mb-2">{char.subtitle}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{char.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
