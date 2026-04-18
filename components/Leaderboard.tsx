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
      <div className="leaderboard-loading">
        Loading leaderboard...
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="leaderboard-empty">
        No completed games yet. Be the first!
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <h3 className="leaderboard-title">Top Graduates</h3>
      <div className="leaderboard-list">
        {entries.map((entry, i) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="leaderboard-row"
          >
            <div className="leaderboard-row-left">
              <span className="leaderboard-rank">
                {i + 1}
              </span>
              <span className="leaderboard-emoji">
                {CHARACTER_EMOJI[entry.character] || '🎓'}
              </span>
              <span className="leaderboard-name">{entry.displayName}</span>
            </div>
            <span
              className={`leaderboard-worth ${
                entry.finalNetWorth >= 0 ? 'leaderboard-worth--positive' : 'leaderboard-worth--negative'
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
