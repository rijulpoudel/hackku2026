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
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1a1a1a]/90 backdrop-blur border-b border-white/5">
      <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
        Year {year} · Age {age}
      </span>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showDelta && delta !== 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}
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
          className={`text-lg font-semibold tabular-nums ${isNegative ? 'text-red-400' : 'text-white'}`}
        >
          {netWorth.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </motion.span>

        <span className="text-xs text-gray-500">net worth</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-white/5 w-full">
        <motion.div
          className="h-full bg-amber-400/60"
          animate={{ width: `${(year / 12) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
