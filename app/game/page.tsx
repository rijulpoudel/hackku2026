'use client'
import { useState, useEffect, useRef } from 'react'
import { DecisionScreen } from '@/components/DecisionScreen'
import { YearTransition } from '@/components/YearTransition'
import { DecisionLoading } from '@/components/DecisionLoading'
import { NetWorthBar } from '@/components/NetWorthBar'
import { FactBox } from '@/components/FactBox'
import { PlayerState, GeneratedDecision, CharacterType } from '@/types/game'
import { playAudio } from '@/lib/audio'
import { useRouter } from 'next/navigation'

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

const CHARACTER_CONFIG: Record<CharacterType, CharacterConfig> = {
  maya: {
    salary: 28000,
    netWorth: -34000,
    savings: 0,
    loanBalance: 34000,
    monthlyExpenses: 1800,
    isFreelancing: false,
    isPSLFEligible: false, // changes if she takes university job
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
    isPSLFEligible: true, // teacher at public school = PSLF eligible day one
    isPensionEnrolled: false, // they choose in scene 3
    isGradStudent: false,
    hasLLC: false,
  },
}

function buildInitialState(character: CharacterType, name: string): PlayerState {
  const cfg = CHARACTER_CONFIG[character]
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
    setPhase('loading')
    try {
      const res = await fetch('/api/generate-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      const decision = await res.json()
      setCurrentDecision(decision)
      setPhase('decision')

      // Play narrator after decision screen appears
      if (state.currentYear <= 3) {
        setTimeout(() => playAudio(`narrator-year${state.currentYear}`), 300)
      }
    } catch (err) {
      console.error('Failed to fetch decision:', err)
      setPhase('decision')
    }
  }

  async function handleChoice(choiceIndex: number) {
    if (!currentDecision || !playerState) return
    setChosenIndex(choiceIndex)

    const choice = currentDecision.choices[choiceIndex]
    const delta = choice.net_worth_change
    setNetWorthDelta(delta)

    if (['Best', 'Smart'].includes(choice.label)) playAudio('choice-correct')
    else if (choice.label === 'Neutral') playAudio('choice-neutral')
    else playAudio('choice-bad')

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

      // Apply flag changes if any
      if (choice.flag_changes) {
        Object.assign(newState, choice.flag_changes)
      }

      // Update specific financial fields based on scenario
      if (currentDecision.scenario_type === 'savings' && choice.label === 'Best') {
        newState.hasEmergencyFund = true
        newState.took401kMatch = true
      }

      setPlayerState(newState)
    } catch (err) {
      console.error('Failed to apply choice:', err)
      // Still update local state
      const newState = {
        ...playerState,
        netWorth: playerState.netWorth + delta,
      }
      setPlayerState(newState)
    }

    setPhase('fact')
  }

  async function handleContinue() {
    if (!playerState) return
    const nextYear = playerState.currentYear + 1

    if (nextYear > 12) {
      // Save final state and go to verdict
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
    // Play transition narration for years 2+ (year 1 has its own narrator)
    if (nextYear > 1) {
      setTimeout(() => playAudio('narrator-transition'), 300)
    }
    setTimeout(() => fetchNextDecision(newState), 2000)
  }

  // Initialize on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let character: CharacterType = 'alex'
    let name = 'Graduate'

    if (typeof window !== 'undefined') {
      const storedChar = sessionStorage.getItem('launch_character') as CharacterType
      const storedName = sessionStorage.getItem('launch_name')
      if (storedChar) character = storedChar
      if (storedName) name = storedName
    }

    const initialState = buildInitialState(character, name)
    setPlayerState(initialState)

    setTimeout(() => fetchNextDecision(initialState), 2000)
  }, [])

  if (!playerState) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-wrapper relative">
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
    </div>
  )
}
