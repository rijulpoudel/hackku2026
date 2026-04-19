'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { LandingScreen } from '@/components/LandingScreen'
import { CharacterSelect } from '@/components/CharacterSelect'
import { Leaderboard } from '@/components/Leaderboard'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CharacterType } from '@/types/game'

type Phase = 'loading' | 'landing' | 'character' | 'leaderboard'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('loading')
  const router = useRouter()

  useEffect(() => {
    // Artificial delay to let heavy SVGs mount
    const timer = setTimeout(() => {
      setPhase('landing')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  function handleCharacterSelect(character: CharacterType, name: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_character', character)
      sessionStorage.setItem('launch_name', name)
    }
    router.push('/game')
  }

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#3D70B2' }}>
      <AnimatePresence mode="wait">
        {phase === 'loading' && <LoadingScreen key="loading" />}
        {phase === 'landing' && (
          <motion.div
            key="landing"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <LandingScreen onStart={() => setPhase('character')} />
          </motion.div>
        )}
      </AnimatePresence>
      {phase === 'character' && (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
      {phase === 'leaderboard' && (
        <div className="leaderboard-phase">
          <button
            onClick={() => setPhase('landing')}
            className="leaderboard-back-btn"
          >
            ← Back
          </button>
          <Leaderboard />
        </div>
      )}

      {/* Leaderboard toggle */}
      {phase === 'landing' && (
        <button
          onClick={() => setPhase('leaderboard')}
          className="leaderboard-toggle-btn"
        >
          View Leaderboard
        </button>
      )}
    </div>
  )
}
