'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LandingScreen } from '@/components/LandingScreen'
import { CharacterSelect } from '@/components/CharacterSelect'
import { Leaderboard } from '@/components/Leaderboard'
import { CharacterType } from '@/types/game'

type Phase = 'landing' | 'character' | 'leaderboard'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing')
  const router = useRouter()

  function handleCharacterSelect(character: CharacterType, name: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_character', character)
      sessionStorage.setItem('launch_name', name)
    }
    router.push('/game')
  }

  return (
    <div className="page-wrapper">
      {phase === 'landing' && (
        <LandingScreen onStart={() => setPhase('character')} />
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
