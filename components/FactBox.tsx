'use client'
import { motion } from 'framer-motion'
import { GeneratedChoice } from '@/types/game'

interface Props {
  fact: string
  choice: GeneratedChoice
  onContinue: () => void
  netWorthDelta: number
}

export function FactBox({ fact, choice, onContinue, netWorthDelta }: Props) {
  const isPositive = netWorthDelta >= 0

  return (
    <div className="factbox-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="factbox-container"
      >
        {/* Net worth change */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`factbox-delta ${isPositive ? 'factbox-delta--positive' : 'factbox-delta--negative'}`}
        >
          {isPositive ? '+' : ''}
          {netWorthDelta.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </motion.div>

        {/* Lesson from the choice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="factbox-lesson"
        >
          {choice.lesson}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
          className="factbox-divider"
        />

        {/* Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="factbox-fact-section"
        >
          <p className="factbox-fact-label">Did you know?</p>
          <p className="factbox-fact-text">{fact}</p>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="factbox-continue-btn"
        >
          Continue to next year →
        </motion.button>
      </motion.div>
    </div>
  )
}
