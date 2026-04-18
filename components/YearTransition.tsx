'use client'
import { motion } from 'framer-motion'

interface Props {
  year: number
  age: number
}

export function YearTransition({ year, age }: Props) {
  return (
    <div className="year-transition-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="year-transition-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="year-transition-label"
        >
          Year {year} of 12
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="year-transition-age"
        >
          Age {age}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="year-transition-flavor"
        >
          {year === 1 ? 'Your story begins.' : 'Time passes. The choices you made are already compounding.'}
        </motion.p>
      </motion.div>
    </div>
  )
}
