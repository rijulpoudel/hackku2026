'use client'
import { motion } from 'framer-motion'

interface Props {
  year: number
  age: number
}

export function YearTransition({ year, age }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3"
        >
          Year {year} of 12
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-6xl font-light text-white mb-2"
        >
          Age {age}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-sm"
        >
          {year === 1 ? 'Your story begins.' : 'Time passes. The choices you made are already compounding.'}
        </motion.p>
      </motion.div>
    </div>
  )
}
