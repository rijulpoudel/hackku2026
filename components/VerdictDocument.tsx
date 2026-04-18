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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <p className="text-amber-400 text-xs font-medium tracking-widest uppercase mb-3">12 Years Later</p>
          <h1 className="text-5xl font-bold text-white mb-3">Your Verdict</h1>
          <div className={`text-4xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {playerState.netWorth.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
          </div>
          <p className="text-gray-500 text-sm mt-1">Final Net Worth</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-4 mb-8"
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
            <div key={stat.label} className="text-center p-4 rounded-lg border border-white/10 bg-white/3">
              <p className="text-white font-semibold text-lg">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Verdict text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert max-w-none mb-8 p-6 rounded-xl border border-white/10 bg-white/3"
        >
          {verdict.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-300 text-sm leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex gap-3"
        >
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
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
            className="flex-1 py-3 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
          >
            Share Result
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
