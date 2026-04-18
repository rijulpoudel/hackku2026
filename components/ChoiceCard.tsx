'use client'
import { motion } from 'framer-motion'
import { GeneratedChoice } from '@/types/game'

const LABEL_COLORS: Record<string, string> = {
  Best: 'choice-card--best',
  Smart: 'choice-card--smart',
  Neutral: 'choice-card--neutral',
  Risky: 'choice-card--risky',
  Danger: 'choice-card--danger',
  Costly: 'choice-card--costly',
  Worst: 'choice-card--worst',
}

const LABEL_TEXT: Record<string, string> = {
  Best: 'choice-label--best',
  Smart: 'choice-label--smart',
  Neutral: 'choice-label--neutral',
  Risky: 'choice-label--risky',
  Danger: 'choice-label--danger',
  Costly: 'choice-label--costly',
  Worst: 'choice-label--worst',
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
        choice-card
        ${borderColor}
        ${isChosen ? 'choice-card--chosen' : ''}
        ${isDisabled ? 'choice-card--disabled' : 'choice-card--enabled'}
      `}
    >
      <div className="choice-card-layout">
        <div className="choice-card-body">
          <p className="choice-card-title">{choice.title}</p>
          <p className="choice-card-impact">{choice.impact}</p>
        </div>
        <span className={`choice-card-label ${textColor}`}>
          {choice.label}
        </span>
      </div>
      {isChosen && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="choice-card-lesson"
        >
          {choice.lesson}
        </motion.p>
      )}
    </motion.button>
  )
}
