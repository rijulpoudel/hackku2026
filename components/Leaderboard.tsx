'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  _id: string
  displayName: string
  character: string
  finalNetWorth: number
  completedAt: string
  decisionCount: number
}

const CHARACTER_EMOJI: Record<string, string> = {
  employee: '💼',
  freelancer: '🎨',
  student: '📚',
  'side-hustler': '🚀',
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center text-gray-600 text-sm py-8">
        Loading leaderboard...
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-600 text-sm py-8">
        No completed games yet. Be the first!
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-white font-medium text-center mb-4">Top Graduates</h3>
      <div className="flex flex-col gap-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg border border-white/8 bg-white/3"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-xs font-mono w-4">
                {i + 1}
              </span>
              <span className="text-base">
                {CHARACTER_EMOJI[entry.character] || '🎓'}
              </span>
              <span className="text-white text-sm">{entry.displayName}</span>
            </div>
            <span
              className={`text-sm font-semibold tabular-nums ${
                entry.finalNetWorth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {entry.finalNetWorth.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
