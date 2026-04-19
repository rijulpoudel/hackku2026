'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CharacterType, PlayerState } from '@/types/game'
import { getAllScenesForCharacter, SceneEntry } from '@/lib/character-decisions'

const CHARACTER_EMOJI: Record<CharacterType, string> = {
  maya: '🔬',
  alex: '💼',
  jordan: '🎨',
  sam: '📚',
  custom: '✨',
}

const CHARACTER_NAMES: Record<CharacterType, string> = {
  maya: 'Maya Chen — PhD Student',
  alex: 'Alex Rivera — Corporate Tech',
  jordan: 'Jordan Kim — Freelance Creative',
  sam: 'Sam Patel — Public Teacher',
  custom: 'Your Custom Story',
}

interface Props {
  onClose: () => void
}

export function ScenesModal({ onClose }: Props) {
  const [character, setCharacter] = useState<CharacterType | null>(null)
  const [currentYear, setCurrentYear] = useState(0)
  const [scenes, setScenes] = useState<SceneEntry[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Read the in-progress game state
    const raw = sessionStorage.getItem('launch_current_state')
    if (raw) {
      try {
        const state: PlayerState = JSON.parse(raw)
        setCharacter(state.character)
        setCurrentYear(state.currentYear)
        setScenes(getAllScenesForCharacter(state.character))
        return
      } catch { /* fall through */ }
    }
    // No active game — default to alex so the modal isn't empty
    const storedChar = sessionStorage.getItem('launch_character') as CharacterType
    const char = storedChar ?? 'alex'
    setCharacter(char)
    setCurrentYear(0)
    setScenes(getAllScenesForCharacter(char))
  }, [])

  // A scene is unlocked if the player has already completed it (year < currentYear)
  // or currently on it (year === currentYear, partially shown)
  const isUnlocked = (year: number) => year < currentYear
  const isCurrent = (year: number) => year === currentYear

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#12121e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Header */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.2rem' }}>
              {character ? CHARACTER_EMOJI[character] : '📖'} Scene Journal
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {character ? CHARACTER_NAMES[character] : 'Start a game to track your scenes'}
            </p>
            {currentYear === 0 && (
              <p style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '0.5rem' }}>
                Play the game to unlock scenes as you progress through each year.
              </p>
            )}
          </div>

          {/* Scene list */}
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {scenes.map((scene) => {
              const unlocked = isUnlocked(scene.year)
              const current = isCurrent(scene.year)
              const isOpen = expanded === scene.year

              return (
                <motion.div
                  key={scene.year}
                  initial={false}
                  style={{
                    border: `1px solid ${current ? 'rgba(245,158,11,0.4)' : unlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                    borderRadius: '0.6rem',
                    overflow: 'hidden',
                    background: current
                      ? 'rgba(245,158,11,0.06)'
                      : unlocked
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.2)',
                    opacity: unlocked || current ? 1 : 0.45,
                  }}
                >
                  {/* Row header — always visible */}
                  <button
                    onClick={() => {
                      if (unlocked) setExpanded(isOpen ? null : scene.year)
                    }}
                    disabled={!unlocked}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: unlocked ? 'pointer' : 'default',
                      textAlign: 'left',
                    }}
                  >
                    {/* Year badge */}
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: current ? '#f59e0b' : unlocked ? '#9ca3af' : '#4b5563',
                      minWidth: '3rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      Yr {scene.year}
                      <br />
                      <span style={{ fontWeight: 400 }}>Age {scene.age}</span>
                    </span>

                    {/* Title */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {unlocked ? (
                        <>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.1rem' }}>
                            {scene.financial_term}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {scene.scenario}
                          </p>
                        </>
                      ) : current ? (
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>
                          ▶ Currently Playing
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                          🔒 Locked — reach Year {scene.year} to unlock
                        </p>
                      )}
                    </div>

                    {/* Expand indicator */}
                    {unlocked && (
                      <span style={{ color: '#4b5563', fontSize: '0.7rem' }}>
                        {isOpen ? '▲' : '▼'}
                      </span>
                    )}
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && unlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '0 0.85rem 0.85rem',
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <p style={{ fontSize: '0.78rem', color: '#d1d5db', margin: '0.6rem 0 0.3rem', fontStyle: 'italic' }}>
                            "{scene.scenario}"
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>
                            {scene.question}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.55rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#6b7280',
              fontSize: '0.82rem',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
