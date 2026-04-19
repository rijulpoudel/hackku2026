'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LandingScreen } from '@/components/LandingScreen'
import { CharacterSelect } from '@/components/CharacterSelect'
import { Leaderboard } from '@/components/Leaderboard'
import { CreditsModal } from '@/components/CreditsModal'
import { LoadGameModal } from '@/components/LoadGameModal'
import { CharacterType } from '@/types/game'
import { hasSaves } from '@/lib/save-game'
import { playSfx } from '@/lib/audio'

type Phase = 'landing' | 'character' | 'leaderboard' | 'credits' | 'loadgame'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // hasSavedGame = has a mid-game sessionStorage state (Continue button)
      const inProgress = sessionStorage.getItem('launch_current_state')
      setHasSavedGame(!!inProgress)
    }
  }, [])

  function handleCharacterSelect(character: CharacterType, name: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_character', character)
      sessionStorage.setItem('launch_name', name)
      // Clear any previous load-save so we start fresh
      sessionStorage.removeItem('launch_load_save')
      sessionStorage.removeItem('launch_current_state')
    }
    router.push('/game')
  }

  function handleContinue() {
    if (hasSavedGame) {
      // Resume current in-progress session
      router.push('/game')
    } else {
      setPhase('character')
    }
  }

  function handleLoadGame() {
    playSfx('click')
    setPhase('loadgame')
  }

  return (
    <div className="page-wrapper">
      {phase === 'landing' && (
        <LandingScreen
          onStart={() => setPhase('character')}
          onContinue={handleContinue}
          onLeaderboard={() => setPhase('leaderboard')}
          onCredits={() => setPhase('credits')}
          onLoadGame={handleLoadGame}
          hasSavedGame={hasSavedGame}
          hasSaveSlots={hasSaves()}
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
            onLoadGame={handleLoadGame}
            hasSavedGame={hasSavedGame}
            hasSaveSlots={hasSaves()}
          />
          <CreditsModal onClose={() => setPhase('landing')} />
        </>
      )}

      {/* Load game modal */}
      {phase === 'loadgame' && (
        <>
          <LandingScreen
            onStart={() => setPhase('character')}
            onContinue={handleContinue}
            onLeaderboard={() => setPhase('leaderboard')}
            onCredits={() => setPhase('credits')}
            onLoadGame={handleLoadGame}
            hasSavedGame={hasSavedGame}
            hasSaveSlots={hasSaves()}
          />
          <LoadGameModal onClose={() => setPhase('landing')} />
        </>
      )}
    </div>
  )
}
