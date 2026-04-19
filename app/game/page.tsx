'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DecisionScreen } from '@/components/DecisionScreen'
import { YearTransition } from '@/components/YearTransition'
import { DecisionLoading } from '@/components/DecisionLoading'
import { NetWorthBar } from '@/components/NetWorthBar'
import { FactBox } from '@/components/FactBox'
import { SaveButton } from '@/components/SaveButton'
import { PlayerState, GeneratedDecision, CharacterType } from '@/types/game'
import { narrateScene, stopNarration, playChoiceResult, playSfx, startBgMusic } from '@/lib/audio'

type GamePhase = 'transition' | 'loading' | 'decision' | 'fact' | 'complete'

type CharacterConfig = {
  salary: number
  netWorth: number
  savings: number
  loanBalance: number
  monthlyExpenses: number
  isFreelancing: boolean
  isPSLFEligible: boolean
  isPensionEnrolled: boolean
  isGradStudent: boolean
  hasLLC: boolean
}

const CHARACTER_CONFIG: Partial<Record<CharacterType, CharacterConfig>> = {
  maya: {
    salary: 28000,
    netWorth: -34000,
    savings: 0,
    loanBalance: 34000,
    monthlyExpenses: 1800,
    isFreelancing: false,
    isPSLFEligible: false,
    isPensionEnrolled: false,
    isGradStudent: true,
    hasLLC: false,
  },
  alex: {
    salary: 58000,
    netWorth: -29900,
    savings: 2100,
    loanBalance: 32000,
    monthlyExpenses: 2800,
    isFreelancing: false,
    isPSLFEligible: false,
    isPensionEnrolled: false,
    isGradStudent: false,
    hasLLC: false,
  },
  jordan: {
    salary: 0,
    netWorth: -36000,
    savings: 0,
    loanBalance: 36000,
    monthlyExpenses: 2200,
    isFreelancing: true,
    isPSLFEligible: false,
    isPensionEnrolled: false,
    isGradStudent: false,
    hasLLC: false,
  },
  sam: {
    salary: 38000,
    netWorth: -31900,
    savings: 2100,
    loanBalance: 34000,
    monthlyExpenses: 2000,
    isFreelancing: false,
    isPSLFEligible: true,
    isPensionEnrolled: false,
    isGradStudent: false,
    hasLLC: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCustomInitialState(name: string, cfg: any): PlayerState {
  const loanBalance     = cfg?.loanBalance ?? 34000
  const savings         = cfg?.savings ?? 2100
  const creditCardDebt  = cfg?.hasCreditCardDebt ? 3000 : 0
  const salary          = cfg?.salary ?? 45000
  const netWorth        = savings - loanBalance - creditCardDebt
  return {
    userId:              `guest_${Date.now()}`,
    name,
    character:           'custom',
    age:                 22,
    currentYear:         1,
    netWorth,
    annualSalary:        salary,
    savings,
    loanBalance,
    retirement401k:      0,
    creditCardDebt,
    monthlyExpenses:     Math.max(800, Math.round(salary * 0.65 / 12)),
    ownsHome:            false,
    hasEmergencyFund:    savings >= 6000,
    isFreelancing:       cfg?.isFreelancing ?? false,
    hasInvested:         false,
    took401kMatch:       false,
    filedTaxesCorrectly: false,
    hasNegotiatedSalary: false,
    hasChildren:         false,
    hadJobLoss:          false,
    isPSLFEligible:      false,
    isPensionEnrolled:   false,
    isGradStudent:       false,
    hasLLC:              cfg?.isFreelancing ?? false,
    decisions:           [],
  }
}

function buildInitialState(character: CharacterType, name: string): PlayerState {
  const cfg = CHARACTER_CONFIG[character]
  if (!cfg) return buildCustomInitialState(name, null)
  return {
    userId: `guest_${Date.now()}`,
    name,
    character,
    age: 22,
    currentYear: 1,
    netWorth: cfg.netWorth,
    annualSalary: cfg.salary,
    savings: cfg.savings,
    loanBalance: cfg.loanBalance,
    retirement401k: 0,
    creditCardDebt: 0,
    monthlyExpenses: cfg.monthlyExpenses,
    ownsHome: false,
    hasEmergencyFund: false,
    isFreelancing: cfg.isFreelancing,
    hasInvested: false,
    took401kMatch: false,
    filedTaxesCorrectly: false,
    hasNegotiatedSalary: false,
    hasChildren: false,
    hadJobLoss: false,
    isPSLFEligible: cfg.isPSLFEligible,
    isPensionEnrolled: cfg.isPensionEnrolled,
    isGradStudent: cfg.isGradStudent,
    hasLLC: cfg.hasLLC,
    decisions: [],
  }
}

export default function GamePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<GamePhase>('transition')
  const [playerState, setPlayerState] = useState<PlayerState | null>(null)
  const [currentDecision, setCurrentDecision] = useState<GeneratedDecision | null>(null)
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [netWorthDelta, setNetWorthDelta] = useState(0)
  const initialized = useRef(false)

  async function fetchNextDecision(state: PlayerState) {
    // Stop any previous narration before loading the next scene
    stopNarration()
    setPhase('loading')
    try {
      const res = await fetch('/api/generate-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      const data = await res.json()

      // Guard: API returned an error object or a decision missing choices
      if (!res.ok || !data.choices || !Array.isArray(data.choices)) {
        console.error('generate-decision returned invalid response:', data)
        // Retry once automatically before giving up
        const retry = await fetch('/api/generate-decision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        })
        const retryData = await retry.json()
        if (!retryData.choices || !Array.isArray(retryData.choices)) {
          console.error('Retry also failed:', retryData)
          setPhase('loading') // stay on loading — avoid blank crash
          return
        }
        setCurrentDecision(retryData as GeneratedDecision)
        setPhase('decision')
        setTimeout(() => narrateScene(retryData.scenario), 400)
        return
      }

      const decision = data as GeneratedDecision
      setCurrentDecision(decision)
      setPhase('decision')

      // Narrate the scene scenario via ElevenLabs (after a short delay so screen renders first)
      setTimeout(() => narrateScene(decision.scenario), 400)
    } catch (err) {
      console.error('Failed to fetch decision:', err)
      setPhase('loading') // stay on loading rather than crashing
    }
  }

  async function handleChoice(choiceIndex: number) {
    if (!currentDecision || !playerState) return

    // Stop narration when player makes a choice
    stopNarration()

    setChosenIndex(choiceIndex)

    const choice = currentDecision.choices[choiceIndex]
    const delta = choice.net_worth_change
    setNetWorthDelta(delta)

    playChoiceResult(choice.label)

    try {
      const res = await fetch('/api/apply-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerState,
          decision: currentDecision,
          choiceIndex,
          userId: playerState.userId,
          displayName: playerState.name,
        }),
      })
      const { newNetWorth, record } = await res.json()

      const newState: PlayerState = {
        ...playerState,
        netWorth: newNetWorth,
        decisions: [...playerState.decisions, record],
      }

      if (choice.flag_changes) {
        Object.assign(newState, choice.flag_changes)
      }

      if (currentDecision.scenario_type === 'savings' && choice.label === 'Best') {
        newState.hasEmergencyFund = true
        newState.took401kMatch = true
      }

      setPlayerState(newState)
    } catch (err) {
      console.error('Failed to apply choice:', err)
      setPlayerState({ ...playerState, netWorth: playerState.netWorth + delta })
    }

    setPhase('fact')
  }

  async function handleContinue() {
    if (!playerState) return
    const nextYear = playerState.currentYear + 1

    if (nextYear > 12) {
      stopNarration()
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('launch_final_state', JSON.stringify(playerState))
      }
      router.push('/verdict')
      return
    }

    const newState: PlayerState = {
      ...playerState,
      currentYear: nextYear,
      age: playerState.age + 1,
    }
    setPlayerState(newState)
    setCurrentDecision(null)
    setChosenIndex(null)
    setNetWorthDelta(0)
    setPhase('transition')

    // Narrate transition text for years 2+
    if (nextYear > 1) {
      setTimeout(() => narrateScene('Time passes. The choices you made are already compounding.'), 300)
    }
    setTimeout(() => fetchNextDecision(newState), 2000)
  }

  function handleGoHome() {
    playSfx('click')
    stopNarration()
    router.push('/')
  }

  // Stop narration when the game page unmounts (back button, verdict, etc.)
  useEffect(() => {
    return () => {
      stopNarration()
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    startBgMusic()

    let character: CharacterType = 'alex'
    let name = 'Graduate'

    if (typeof window !== 'undefined') {
      // Check if loading a saved game
      const savedStateRaw = sessionStorage.getItem('launch_load_save')
      if (savedStateRaw) {
        try {
          const savedState: PlayerState = JSON.parse(savedStateRaw)
          sessionStorage.removeItem('launch_load_save')
          setPlayerState(savedState)
          setTimeout(() => fetchNextDecision(savedState), 1500)
          return
        } catch {
          // Corrupt save — fall through to fresh start
        }
      }

      // Fresh start
      const storedChar = sessionStorage.getItem('launch_character') as CharacterType
      const storedName = sessionStorage.getItem('launch_name')
      if (storedChar) character = storedChar
      if (storedName) name = storedName

      // Custom character — build from the stored config
      if (character === 'custom') {
        const customRaw = sessionStorage.getItem('launch_custom_config')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customCfg = customRaw ? (JSON.parse(customRaw) as any) : null
        const initialState = buildCustomInitialState(name, customCfg)
        setPlayerState(initialState)
        setTimeout(() => fetchNextDecision(initialState), 2000)
        return
      }
    }

    const initialState = buildInitialState(character, name)
    setPlayerState(initialState)
    setTimeout(() => fetchNextDecision(initialState), 2000)
  }, [])

  // Also save to sessionStorage on every state change so "Continue" always works
  useEffect(() => {
    if (!playerState) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_current_state', JSON.stringify(playerState))
    }
  }, [playerState])

  if (!playerState) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-wrapper relative">
      {/* Back to home button */}
      <button
        onClick={handleGoHome}
        style={{
          position: 'fixed',
          top: '3.5rem',
          left: '1rem',
          zIndex: 50,
          background: 'transparent',
          border: 'none',
          color: '#4b5563',
          fontSize: '0.75rem',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#9ca3af')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
      >
        ← Home
      </button>

      <NetWorthBar
        netWorth={playerState.netWorth}
        year={playerState.currentYear}
        age={playerState.age}
        delta={netWorthDelta}
      />

      {phase === 'transition' && (
        <YearTransition year={playerState.currentYear} age={playerState.age} />
      )}

      {phase === 'loading' && (
        <DecisionLoading age={playerState.age} />
      )}

      {phase === 'decision' && currentDecision && (
        <DecisionScreen
          decision={currentDecision}
          onChoice={handleChoice}
          chosenIndex={chosenIndex}
        />
      )}

      {phase === 'fact' && currentDecision && chosenIndex !== null && (
        <FactBox
          fact={currentDecision.fact_after}
          choice={currentDecision.choices[chosenIndex]}
          onContinue={handleContinue}
          netWorthDelta={netWorthDelta}
        />
      )}

      {/* Save game button — visible during decision and fact phases */}
      {(phase === 'decision' || phase === 'fact') && (
        <SaveButton playerState={playerState} />
      )}
    </div>
  )
}
