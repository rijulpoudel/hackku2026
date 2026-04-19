'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayerState } from '@/types/game'
import { saveGame } from '@/lib/save-game'
import { playSfx } from '@/lib/audio'

interface Props {
  playerState: PlayerState
}

export function SaveButton({ playerState }: Props) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving || saved) return
    setSaving(true)
    playSfx('click')
    saveGame(playerState)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <motion.button
      onClick={handleSave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 1.2rem',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(26,26,26,0.85)',
        backdropFilter: 'blur(8px)',
        color: saved ? '#86efac' : '#9ca3af',
        fontSize: '0.75rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'color 0.2s',
        letterSpacing: '0.04em',
      }}
    >
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.span
            key="saved"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            ✓ Game Saved
          </motion.span>
        ) : (
          <motion.span
            key="save"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {saving ? 'Saving…' : '💾 Save Game'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
