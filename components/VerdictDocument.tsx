'use client'
import { motion } from 'framer-motion'
import { PlayerState } from '@/types/game'

interface Props {
  verdict: string
  playerState: PlayerState
  onRestart: () => void
}

export function VerdictDocument({ verdict, playerState, onRestart }: Props) {
  const isPositive = playerState.netWorth > 0

  return (
    <div className="verdict-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="verdict-container"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="verdict-header"
        >
          <p className="verdict-subtitle">12 Years Later</p>
          <h1 className="verdict-title">Your Verdict</h1>
          <div className={`verdict-networth ${isPositive ? 'verdict-networth--positive' : 'verdict-networth--negative'}`}>
            {playerState.netWorth.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
          </div>
          <p className="verdict-networth-label">Final Net Worth</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="verdict-stats-grid"
        >
          {[
            {
              label: '401k Balance',
              value: playerState.retirement401k.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }),
            },
            {
              label: 'Loans Remaining',
              value: playerState.loanBalance.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }),
            },
            {
              label: 'Decisions Made',
              value: playerState.decisions.length.toString(),
            },
          ].map((stat) => (
            <div key={stat.label} className="verdict-stat-card">
              <p className="verdict-stat-value">{stat.value}</p>
              <p className="verdict-stat-label">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Verdict text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="verdict-text"
        >
          {verdict.split('\n\n').map((para, i) => (
            <p key={i} className="verdict-paragraph">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="verdict-actions"
        >
          <button
            onClick={onRestart}
            className="verdict-btn-secondary"
          >
            Play Again
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'LAUNCH — My Financial Verdict',
                  text: `I finished LAUNCH with a net worth of ${playerState.netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}. Can you do better?`,
                })
              }
            }}
            className="verdict-btn-primary"
          >
            Share Result
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
