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
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {phase === 'landing' && (
        <LandingScreen onStart={() => setPhase('character')} />
      )}
      {phase === 'character' && (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
      {phase === 'leaderboard' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
          <button
            onClick={() => setPhase('landing')}
            className="mb-8 text-gray-500 text-sm hover:text-white transition-colors"
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
          className="fixed bottom-6 right-6 text-gray-600 text-xs hover:text-gray-400 transition-colors"
        >
          View Leaderboard
        </button>
      )}
    </div>
  )
}
