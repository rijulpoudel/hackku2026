'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { listSaves, deleteSave, SaveSlot, formatSaveDate } from '@/lib/save-game'
import { playSfx } from '@/lib/audio'

interface Props {
  onClose: () => void
}

export function LoadGameModal({ onClose }: Props) {
  const router = useRouter()
  const [saves, setSaves] = useState<SaveSlot[]>([])

  useEffect(() => {
    setSaves(listSaves())
  }, [])

  function handleLoad(slot: SaveSlot) {
    playSfx('click')
    // Store the selected save so game/page.tsx can pick it up
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_load_save', JSON.stringify(slot.playerState))
      sessionStorage.setItem('launch_character', slot.character)
      sessionStorage.setItem('launch_name', slot.characterName)
    }
    router.push('/game')
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    playSfx('click')
    deleteSave(id)
    setSaves(listSaves())
  }

  const fmtNetWorth = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

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
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>
            Load Game
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Select a saved session to continue
          </p>

          {saves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4b5563' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📭</p>
              <p style={{ fontSize: '0.9rem' }}>No saved games yet.</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Use the Save button during gameplay.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {saves.map((slot) => (
                <motion.div
                  key={slot.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleLoad(slot)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* Character emoji */}
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{slot.characterEmoji}</span>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.1rem' }}>
                      {slot.characterName}
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 400, marginLeft: '0.5rem' }}>
                        {slot.characterTitle}
                      </span>
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      Year {slot.year} · Age {slot.age}
                    </p>
                    <p style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: slot.netWorth >= 0 ? '#86efac' : '#f87171',
                      marginTop: '0.15rem',
                    }}>
                      {fmtNetWorth(slot.netWorth)} net worth
                    </p>
                  </div>

                  {/* Timestamp + delete */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', color: '#4b5563' }}>
                      {formatSaveDate(slot.savedAt)}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, slot.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#4b5563',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        padding: '0.1rem 0.3rem',
                      }}
                      title="Delete save"
                    >
                      ✕ delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '0.6rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
