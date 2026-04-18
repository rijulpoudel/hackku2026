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
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-amber-400/20 border-t-amber-400 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-500 text-sm">{message}</p>
      </motion.div>
    </div>
  )
}
