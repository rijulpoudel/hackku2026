'use client'
import { motion } from 'framer-motion'

interface Props {
  age: number
}

const LOADING_MESSAGES = [
  'Calculating your options...',
  'Considering your situation...',
  'Life is happening...',
  'Weighing the trade-offs...',
  'Your next decision awaits...',
]

export function DecisionLoading({ age }: Props) {
  const message = LOADING_MESSAGES[age % LOADING_MESSAGES.length]

  return (
    <div className="decision-loading-wrapper">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="decision-loading-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="decision-loading-spinner"
        />
        <p className="decision-loading-text">{message}</p>
      </motion.div>
    </div>
  )
}
