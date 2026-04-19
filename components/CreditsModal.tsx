'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onClose: () => void
}

const CREDITS = [
  { role: 'Frontend', name: 'Rijul Poudel' },
  { role: 'Backend & AI', name: 'Mariska Rai' },
  { role: 'Design & Assets', name: 'Shashwat Ghimire' },
]

export function CreditsModal({ onClose }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="credits-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="credits-modal"
        >
          <h2 className="credits-title">Credits</h2>
          <p className="credits-subtitle">HackKU 2026 · Security Benefit Track</p>

          <div className="credits-divider" />

          <div className="credits-list">
            {CREDITS.map((c) => (
              <div key={c.role} className="credits-row">
                <span className="credits-role">{c.role}</span>
                <span className="credits-name">{c.name}</span>
              </div>
            ))}
          </div>

          <div className="credits-divider" />

          <div className="credits-tech">
            <p className="credits-tech-label">Built with</p>
            <p className="credits-tech-stack">Next.js · Gemini AI · MongoDB · ElevenLabs · Pollinations.ai</p>
          </div>

          <button onClick={onClose} className="credits-close-btn">
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
