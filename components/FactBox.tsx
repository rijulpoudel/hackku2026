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
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Net worth change */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-4xl font-bold mb-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
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
          className="text-white text-xl font-light leading-relaxed mb-6"
        >
          {choice.lesson}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
          className="h-px bg-white/10 mb-6 origin-left"
        />

        {/* Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs text-amber-400 uppercase tracking-widest font-medium mb-2">Did you know?</p>
          <p className="text-gray-300 text-sm leading-relaxed">{fact}</p>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Continue to next year →
        </motion.button>
      </motion.div>
    </div>
  )
}
