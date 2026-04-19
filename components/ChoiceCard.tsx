'use client'
import { motion } from 'framer-motion'
import { GeneratedChoice } from '@/types/game'
import { playSfx } from '@/lib/audio'

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
  /** Whether any choice has been made yet — reveals labels after selection */
  anyChosen: boolean
}

export function ChoiceCard({ choice, index, onSelect, isChosen, isDisabled, anyChosen }: Props) {
  const borderColor = anyChosen ? (LABEL_COLORS[choice.label] || LABEL_COLORS.Neutral) : ''
  const textColor = LABEL_TEXT[choice.label] || LABEL_TEXT.Neutral

  function handleClick() {
    if (!isDisabled) {
      playSfx('click')
      onSelect()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
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

        {/* Label only appears after a choice has been made */}
        {anyChosen && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`choice-card-label ${textColor}`}
          >
            {choice.label}
          </motion.span>
        )}
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
