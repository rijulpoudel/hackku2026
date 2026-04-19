'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LandingScreen } from '@/components/LandingScreen'
import { CharacterSelect } from '@/components/CharacterSelect'
import { Leaderboard } from '@/components/Leaderboard'
import { CreditsModal } from '@/components/CreditsModal'
import { CharacterType } from '@/types/game'

type Phase = 'landing' | 'character' | 'leaderboard' | 'credits'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const router = useRouter()

  // Check for a saved game in sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('launch_character')
      setHasSavedGame(!!saved)
    }
  }, [])

  function handleCharacterSelect(character: CharacterType, name: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_character', character)
      sessionStorage.setItem('launch_name', name)
    }
    router.push('/game')
  }

  function handleContinue() {
    if (hasSavedGame) {
      // Resume existing game
      router.push('/game')
    } else {
      // No saved game — start fresh
      setPhase('character')
    }
  }

  return (
    <div className="page-wrapper">
      {phase === 'landing' && (
        <LandingScreen
          onStart={() => setPhase('character')}
          onContinue={handleContinue}
          onLeaderboard={() => setPhase('leaderboard')}
          onCredits={() => setPhase('credits')}
          hasSavedGame={hasSavedGame}
        />
      )}

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

      {/* Credits modal — rendered on top of landing */}
      {phase === 'credits' && (
        <>
          <LandingScreen
            onStart={() => setPhase('character')}
            onContinue={handleContinue}
            onLeaderboard={() => setPhase('leaderboard')}
            onCredits={() => setPhase('credits')}
            hasSavedGame={hasSavedGame}
          />
          <CreditsModal onClose={() => setPhase('landing')} />
        </>
      )}
    </div>
  )
}
