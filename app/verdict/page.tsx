'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { VerdictDocument } from '@/components/VerdictDocument'
import { PlayerState } from '@/types/game'

export default function VerdictPage() {
  const router = useRouter()
  const [verdict, setVerdict] = useState<string | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    let state: PlayerState | null = null
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('launch_final_state')
      if (raw) {
        try {
          state = JSON.parse(raw)
        } catch {}
      }
    }

    if (!state) {
      router.push('/')
      return
    }

    setPlayerState(state)

    fetch('/api/generate-verdict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerState: state,
        userId: state.userId,
        displayName: state.name,
      }),
    })
      .then((r) => r.json())
      .then(({ verdict }) => {
        setVerdict(verdict)
        setLoading(false)
      })
      .catch(() => {
        setVerdict(
          `${state!.name}, you made it through 12 years. Your financial journey had its ups and downs, but every decision was a lesson. The habits you build in your 20s and early 30s compound for decades. Start investing today, eliminate high-interest debt, and automate your savings. Your future self will thank you.`,
        )
        setLoading(false)
      })
  }, [router])

  if (loading || !playerState) {
    return (
      <div className="page-loading-verdict">
        <div className="spinner--large" />
        <p className="decision-loading-text">Generating your financial verdict...</p>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <VerdictDocument
        verdict={verdict!}
        playerState={playerState}
        onRestart={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.clear()
          }
          router.push('/')
        }}
      />
    </div>
  )
}
