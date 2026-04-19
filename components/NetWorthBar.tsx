'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toggleMute, isMuted } from '@/lib/audio'

interface Props {
  netWorth: number
  year: number
  age: number
  delta: number
}

export function NetWorthBar({ netWorth, year, age, delta }: Props) {
  const [showDelta, setShowDelta] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (delta !== 0) {
      setShowDelta(true)
      const timer = setTimeout(() => setShowDelta(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [netWorth, delta])

  function handleMuteToggle() {
    const nowMuted = toggleMute()
    setMuted(nowMuted)
  }

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

      {/* Mute toggle */}
      <button
        onClick={handleMuteToggle}
        title={muted ? 'Unmute' : 'Mute'}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          color: muted ? '#4b5563' : '#9ca3af',
          padding: '0.25rem 0.4rem',
          borderRadius: '0.375rem',
          transition: 'color 0.2s',
          lineHeight: 1,
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

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
