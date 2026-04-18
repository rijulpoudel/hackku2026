'use client'
import { motion } from 'framer-motion'
import { GeneratedChoice } from '@/types/game'

const LABEL_COLORS: Record<string, string> = {
  Best: 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10',
  Smart: 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10',
  Neutral: 'border-gray-500/50 bg-gray-500/5 hover:bg-gray-500/10',
  Risky: 'border-orange-500/50 bg-orange-500/5 hover:bg-orange-500/10',
  Danger: 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10',
  Costly: 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10',
  Worst: 'border-red-600/50 bg-red-600/5 hover:bg-red-600/10',
}

const LABEL_TEXT: Record<string, string> = {
  Best: 'text-green-400',
  Smart: 'text-blue-400',
  Neutral: 'text-gray-400',
  Risky: 'text-orange-400',
  Danger: 'text-red-400',
  Costly: 'text-yellow-400',
  Worst: 'text-red-500',
}

interface Props {
  choice: GeneratedChoice
  index: number
  onSelect: () => void
  isChosen: boolean
  isDisabled: boolean
}

export function ChoiceCard({ choice, index, onSelect, isChosen, isDisabled }: Props) {
  const borderColor = LABEL_COLORS[choice.label] || LABEL_COLORS.Neutral
  const textColor = LABEL_TEXT[choice.label] || LABEL_TEXT.Neutral

  return (
    <motion.button
      onClick={onSelect}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      className={`
        w-full text-left p-4 rounded-lg border transition-all duration-200
        ${borderColor}
        ${isChosen ? 'ring-2 ring-white/20' : ''}
        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-white font-medium text-sm leading-snug">{choice.title}</p>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{choice.impact}</p>
        </div>
        <span className={`text-xs font-semibold shrink-0 uppercase tracking-wider ${textColor}`}>
          {choice.label}
        </span>
      </div>
      {isChosen && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-gray-300 text-xs mt-3 pt-3 border-t border-white/10 leading-relaxed"
        >
          {choice.lesson}
        </motion.p>
      )}
    </motion.button>
  )
}
