'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  netWorth: number
  year: number
  age: number
  delta: number
}

export function NetWorthBar({ netWorth, year, age, delta }: Props) {
  const [showDelta, setShowDelta] = useState(false)

  useEffect(() => {
    if (delta !== 0) {
      setShowDelta(true)
      const timer = setTimeout(() => setShowDelta(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [netWorth, delta])

  const isNegative = netWorth < 0

  return (
    <div className="networth-bar">
      <span className="networth-year-label">
        Year {year} · Age {age}
      </span>

      <div className="networth-values">
        <AnimatePresence>
          {showDelta && delta !== 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`networth-delta ${delta > 0 ? 'networth-delta--positive' : 'networth-delta--negative'}`}
            >
              {delta > 0 ? '+' : ''}
              {delta.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          key={netWorth}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.4 }}
          className={`networth-amount ${isNegative ? 'networth-amount--negative' : 'networth-amount--positive'}`}
        >
          {netWorth.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </motion.span>

        <span className="networth-suffix">net worth</span>
      </div>

      {/* Progress bar */}
      <div className="networth-progress-track">
        <motion.div
          className="networth-progress-fill"
          animate={{ width: `${(year / 12) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
