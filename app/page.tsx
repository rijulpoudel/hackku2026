'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { LandingScreen } from '@/components/LandingScreen'
import { CharacterSelect } from '@/components/CharacterSelect'
import { Leaderboard } from '@/components/Leaderboard'
import { CreditsModal } from '@/components/CreditsModal'
import { LoadGameModal } from '@/components/LoadGameModal'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CharacterType } from '@/types/game'
import { hasSaves } from '@/lib/save-game'
import { playSfx } from '@/lib/audio'

type Phase = 'loading' | 'landing' | 'character' | 'leaderboard' | 'credits' | 'loadgame'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for an in-progress session
    if (typeof window !== 'undefined') {
      const inProgress = sessionStorage.getItem('launch_current_state')
      setHasSavedGame(!!inProgress)
    }

    // Show loading screen for ~2s then reveal landing
    const timer = setTimeout(() => setPhase('landing'), 2000)
    return () => clearTimeout(timer)
  }, [])

  function handleCharacterSelect(character: CharacterType, name: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_character', character)
      sessionStorage.setItem('launch_name', name)
      sessionStorage.removeItem('launch_load_save')
      sessionStorage.removeItem('launch_current_state')
    }
    router.push('/game')
  }

  function handleContinue() {
    if (hasSavedGame) {
      router.push('/game')
    } else {
      setPhase('character')
    }
  }

  function handleLoadGame() {
    playSfx('click')
    setPhase('loadgame')
  }

  function handleStart() {
    // Don't clear launch_current_state here — only clear it when a character is
    // actually selected (handleCharacterSelect). This lets the player change their
    // mind and hit Continue to go back to the old game.
    setPhase('character')
  }

  // Shared landing props
  const landingProps = {
    onStart: handleStart,
    onContinue: handleContinue,
    onLeaderboard: () => setPhase('leaderboard'),
    onCredits: () => setPhase('credits'),
    onLoadGame: handleLoadGame,
    hasSavedGame,
    hasSaveSlots: hasSaves(),
  }

  return (
    <div className="page-wrapper">
      <AnimatePresence mode="wait">
        {/* ── Initial loading screen ───────────────────── */}
        {phase === 'loading' && <LoadingScreen key="loading" />}

        {/* ── Landing ──────────────────────────────────── */}
        {phase === 'landing' && (
          <motion.div
            key="landing"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <LandingScreen {...landingProps} />
          </motion.div>
        )}

        {/* ── Character select ──────────────────────────── */}
        {phase === 'character' && (
          <CharacterSelect key="character" onSelect={handleCharacterSelect} />
        )}

        {/* ── Leaderboard ───────────────────────────────── */}
        {phase === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="leaderboard-phase"
          >
            <button onClick={() => setPhase('landing')} className="leaderboard-back-btn">
              ← Back
            </button>
            <Leaderboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Credits modal — overlays landing ────────────── */}
      {phase === 'credits' && (
        <>
          <LandingScreen {...landingProps} />
          <CreditsModal onClose={() => setPhase('landing')} />
        </>
      )}

      {/* ── Load game modal — overlays landing ──────────── */}
      {phase === 'loadgame' && (
        <>
          <LandingScreen {...landingProps} />
          <LoadGameModal onClose={() => setPhase('landing')} />
        </>
      )}

      {/* Leaderboard toggle shortcut (visible on landing) */}
      {phase === 'landing' && (
        <button onClick={() => setPhase('leaderboard')} className="leaderboard-toggle-btn">
          View Leaderboard
        </button>
      )}
    </div>
  )
}
