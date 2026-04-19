'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayerState, GeneratedDecision, CharacterType } from '@/types/game'
import { narrateScene, stopNarration, playChoiceResult, playSfx, startBgMusic, toggleMute, isMuted } from '@/lib/audio'
import { saveGame } from '@/lib/save-game'
import { YearTransition } from '@/components/YearTransition'
import { DecisionLoading } from '@/components/DecisionLoading'

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

// Scene image mapping fallback logic
const getSceneImage = (char: CharacterType, year: number): string => {
  const Map: Record<CharacterType, Record<number, string>> = {
    maya: {
      1: '1 3.svg', 2: '2 1.svg', 3: '3 1.svg', 4: '4 1.svg', 5: '5 1.svg', 6: '6 1.svg',
      7: '7 1.svg', 8: '8 1.svg', 9: '9 1.svg', 10: '12 1.svg', 11: '12 1.svg', 12: '12 1.svg',
    },
    alex: {
      1: '1.svg', 2: '2.svg', 3: '3.svg', 4: '4.svg', 5: '4.svg', 6: '6 2.svg',
      7: '7 2.svg', 8: '8 2.svg', 9: '9 2.svg', 10: '10 1.svg', 11: '10 1.svg', 12: '10 1.svg',
    },
    jordan: {
      1: '1 5.svg', 2: '2 3.svg', 3: '3 3.svg', 4: '44 1.svg', 5: '5 3.svg', 6: '6 3.svg',
      7: '7 3.svg', 8: '8 3.svg', 9: '9 3.svg', 10: '10 2.svg', 11: '11 1.svg', 12: '12 2.svg',
    },
    sam: {
      1: '1 6.svg', 2: '2 4.svg', 3: '3 4.svg', 4: '44 2.svg', 5: '5 4.svg', 6: '6 4.svg',
      7: '7 4.svg', 8: '8 4.svg', 9: '9 4.svg', 10: '10 3.svg', 11: '10 3.svg', 12: '10 3.svg',
    }
  }

  const charName = char.charAt(0).toUpperCase() + char.slice(1)
  const filename = Map[char]?.[year] || Map[char]?.[1] || '1.svg'
  return `/scenes/${charName}/${filename}`
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
    stopNarration()
    setPhase('loading')
    try {
      const res = await fetch('/api/generate-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      const decision: GeneratedDecision = await res.json()
      setCurrentDecision(decision)
      setPhase('decision')

      setTimeout(() => narrateScene(decision.scenario), 400)
    } catch (err) {
      console.error('Failed to fetch decision:', err)
      setPhase('decision')
    }
  }

  async function handleChoice(choiceIndex: number) {
    if (!currentDecision || !playerState) return

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

    if (nextYear > 1) {
      setTimeout(() => narrateScene('Time passes. The choices you made are already compounding.'), 300)
    }
    setTimeout(() => fetchNextDecision(newState), 2000)
  }

  function handleGoHome() {
    playSfx('click')
    stopNarration()
    // Explicitly flush current state to sessionStorage before navigating so
    // "Continue" on the landing screen always has the latest snapshot.
    if (playerState && typeof window !== 'undefined') {
      sessionStorage.setItem('launch_current_state', JSON.stringify(playerState))
    }
    router.push('/')
  }

  useEffect(() => {
    return () => {
      stopNarration()
    }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    startBgMusic()

    let character: CharacterType = 'alex'
    let name = 'Graduate'

    if (typeof window !== 'undefined') {
      const savedStateRaw = sessionStorage.getItem('launch_load_save')
      if (savedStateRaw) {
        try {
          const savedState: PlayerState = JSON.parse(savedStateRaw)
          sessionStorage.removeItem('launch_load_save')
          setPlayerState(savedState)
          setTimeout(() => fetchNextDecision(savedState), 1500)
          return
        } catch { }
      }

      // Continue — restore in-progress session (set by auto-save or handleGoHome)
      const currentStateRaw = sessionStorage.getItem('launch_current_state')
      if (currentStateRaw) {
        try {
          const currentState: PlayerState = JSON.parse(currentStateRaw)
          setPlayerState(currentState)
          // Shorter delay — player already saw the transition once
          setTimeout(() => fetchNextDecision(currentState), 1200)
          return
        } catch {
          // Corrupt — clear it and fall through to fresh start
          sessionStorage.removeItem('launch_current_state')
        }
      }

      // Fresh start
      const storedChar = sessionStorage.getItem('launch_character') as CharacterType
      const storedName = sessionStorage.getItem('launch_name')
      if (storedChar) character = storedChar
      if (storedName) name = storedName
    }

    const initialState = buildInitialState(character, name)
    setPlayerState(initialState)
    setTimeout(() => fetchNextDecision(initialState), 2000)
  }, [])

  useEffect(() => {
    if (!playerState) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_current_state', JSON.stringify(playerState))
    }
  }, [playerState])

  const [muted, setMuted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMuted(isMuted())
  }, [])

  function handleMuteToggle() {
    const nowMuted = toggleMute()
    setMuted(nowMuted)
  }

  async function handleSave() {
    if (!playerState || saving || saved) return
    setSaving(true)
    playSfx('click')
    saveGame(playerState)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!playerState) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-wrapper relative">
      <main className="landing-main" style={{ zIndex: 10 }}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="landing-content"
            style={{ flexDirection: 'column' }}
          >
            <div
              style={{
                position: 'relative',
                width: '90vw',
                maxWidth: '1300px',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              {/* Animated elements from landing screen context */}

              <motion.div
                className="landing-constellation"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  filter: [
                    'brightness(0.8) drop-shadow(0 0 0px rgba(255,255,255,0))',
                    'brightness(1.5) drop-shadow(0 0 20px rgba(255,255,255,0.9))',
                    'brightness(0.8) drop-shadow(0 0 0px rgba(255,255,255,0))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ bottom: '85%', right: '-8%', width: '18%' }}
              >
                <Image
                  src="/landing/CONSETELATION.svg"
                  alt="Constellation"
                  width={200}
                  height={200}
                  className="landing-responsive-img"
                />
              </motion.div>

              {/* Notebook container - Augmented with 50px top padding as requested */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '136vh',
                  aspectRatio: '1.6',
                  paddingTop: '50px',
                }}
              >
                <Image
                  src="/your_scence/Frame_board.svg"
                  alt="Notebook Board"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />

                {/* Top Controls Area - Anchored above the board, now shifted down 50px */}
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(-3% + 50px)',
                    right: '0.7%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    zIndex: 20,
                    gap: '1vw',
                    width: '100%',
                  }}
                >
                  {/* Butterfly moved to top left of the status bar */}
                  <motion.div
                    animate={{
                      rotate: [0, -3, 0, 3, 0],
                      scaleY: [1, 1.05, 1, 0.95, 1],
                      filter: [
                        'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
                        'brightness(1.3) drop-shadow(0 0 12px rgba(255,255,255,0.6))',
                        'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '-100%', left: '0', width: '8%', pointerEvents: 'none' }}
                  >
                    <Image
                      src="/landing/butter fly.svg"
                      alt="Butterfly"
                      width={60}
                      height={60}
                      className="landing-responsive-img"
                    />
                  </motion.div>

                  {/* Net Worth Display */}
                  <div style={{ position: 'relative', width: 'clamp(180px, 15vw, 220px)', aspectRatio: '220/52' }}>
                    <Image src="/option_page/money_holder.svg" alt="Money" fill style={{ objectFit: 'contain' }} />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: `'HYWenHei', system-ui, sans-serif`,
                        color: 'white',
                        fontSize: 'clamp(1rem, 1.2vw, 1.3rem)',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {playerState.netWorth < 0 ? '-' : ''}${Math.abs(playerState.netWorth).toLocaleString()}
                    </div>
                  </div>

                  {/* Year and Age Badge */}
                  <div
                    style={{
                      position: 'relative',
                      top: '2.8px',
                      left: '9.4px',
                      background: '#f4ede1',
                      border: '1px solid #d3c4a9',
                      borderRadius: '20px',
                      padding: '0.27rem 2.8rem',
                      color: '#344966',
                      fontFamily: `'HYWenHei', system-ui, sans-serif`,
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.9rem, 1vw, 1.1rem)',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05), 0 2px 5px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    Year {playerState.currentYear} · Age {playerState.age}
                    <span style={{ fontSize: '0.8em' }}>▼</span>
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={handleMuteToggle}
                    style={{
                      position: 'relative',
                      width: 'clamp(80px, 7vw, 110px)',
                      aspectRatio: '100/45',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'transform 0.1s',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={muted ? 'Unmute' : 'Mute'}
                  >
                    <Image
                      src={muted ? "/option_page/volumn_mute_tab.svg" : "/option_page/volumn_unmute_tab.svg"}
                      alt="Volume"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </button>
                </div>

                {/* Notebook Content Layout */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '8% 5% 7% 6%',
                    display: 'flex',
                  }}
                >
                  {/* Left Half: Character Info */}
                  <div
                    style={{
                      width: '40%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '2% 2% 0 0%',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: `'HYWenHei', system-ui, sans-serif`,
                        color: '#344966',
                        fontSize: 'clamp(1.5rem, 2vw, 2.2rem)',
                        fontWeight: 'bold',
                        marginBottom: '2%',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      Story: {playerState.name.split(' ')[0]}
                    </h2>

                    {/* Stars decoration */}
                    <div style={{ color: '#d3c4a9', fontSize: '1.2rem', marginBottom: '8%', letterSpacing: '4px' }}>
                      <span style={{ fontSize: '0.8em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '1.3em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '0.8em' }}>✦</span>
                    </div>

                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1.4',
                        marginBottom: '4%',
                        borderRadius: '0px',
                        overflow: 'hidden',
                        transform: 'translateX(-3%)',
                      }}
                    >
                      <Image
                        src={getSceneImage(playerState.character, playerState.currentYear)}
                        alt={`Scene for Year ${playerState.currentYear}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  </div>

                  {/* Right Half: Decision Area */}
                  <div
                    style={{
                      width: '60%',
                      padding: '2% 3vw',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Home Button top right - Shifted down 20px and right 38px */}
                    <button
                      onClick={handleGoHome}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '-38px',
                        width: 'clamp(80px, 7vw, 110px)',
                        aspectRatio: '100/45',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        zIndex: 20,
                        transition: 'transform 0.1s',
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Image src="/option_page/home_tab.svg" alt="Home Base" fill style={{ objectFit: 'contain' }} />
                    </button>

                    <div style={{ paddingRight: '3vw', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <AnimatePresence mode="wait">
                        {phase === 'decision' && currentDecision && (
                          <motion.div
                            key="decision"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1vw', flex: 1 }}
                          >
                            <h3
                              style={{
                                color: '#4a82a6',
                                fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
                                fontWeight: 'bold',
                                fontFamily: `'HYWenHei', system-ui, sans-serif`,
                                textAlign: 'center',
                                minHeight: '2em',
                              }}
                            >
                              {currentDecision.financial_term}
                            </h3>

                            <p
                              style={{
                                color: '#344966',
                                fontSize: 'clamp(0.9rem, 1.1vw, 1.2rem)',
                                fontWeight: 600,
                                fontFamily: `'HYWenHei', system-ui, sans-serif`,
                                lineHeight: 1.4,
                                textAlign: 'center',
                                padding: '0 5%',
                                minHeight: '6em',
                              }}
                            >
                              {currentDecision.scenario} {currentDecision.question}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vw', marginTop: 'auto', marginBottom: '2vw' }}>
                              {currentDecision.choices.map((choice, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleChoice(i)}
                                  disabled={chosenIndex !== null}
                                  style={{
                                    position: 'relative',
                                    width: '102.5%',
                                    left: '-1.25%',
                                    aspectRatio: '615/54.7',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: chosenIndex !== null ? 'default' : 'pointer',
                                    opacity: chosenIndex !== null && chosenIndex !== i ? 0.5 : 1,
                                    transition: 'opacity 0.2s, transform 0.1s',
                                  }}
                                  onMouseDown={(e) => {
                                    if (chosenIndex === null) e.currentTarget.style.transform = 'scale(0.98)'
                                  }}
                                  onMouseUp={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                  }}
                                >
                                  <Image
                                    src="/option_page/option_bar.svg"
                                    alt=""
                                    fill
                                    style={{ objectFit: 'contain' }}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      color: 'white',
                                      fontFamily: `'HYWenHei', system-ui, sans-serif`,
                                      padding: '0 5%',
                                      paddingLeft: '8%',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <div style={{ fontSize: 'clamp(0.57rem, 0.7vw, 0.83rem)', fontWeight: 'bold' }}>
                                      {choice.title}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {phase === 'fact' && currentDecision && chosenIndex !== null && (
                          <motion.div
                            key="fact"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1vw',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <h3 style={{ fontSize: 'clamp(1.2rem, 1.5vw, 1.8rem)', fontWeight: 800, color: '#344966' }}>
                              The Result
                            </h3>
                            <div style={{ background: 'rgba(52, 73, 102, 0.08)', padding: '1.5rem', borderRadius: '1rem', width: '90%' }}>
                              <p style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.2rem)', color: '#344966', lineHeight: 1.5, marginBottom: '0.5rem', fontWeight: 600 }}>
                                {currentDecision.choices[chosenIndex].lesson}
                              </p>
                              <p style={{ fontSize: 'clamp(0.8rem, 0.9vw, 1rem)', color: '#415779', opacity: 0.9, lineHeight: 1.4 }}>
                                {currentDecision.fact_after}
                              </p>
                            </div>
                            <button
                              onClick={handleContinue}
                              style={{
                                background: '#344966',
                                color: 'white',
                                padding: '0.8rem 2.5rem',
                                borderRadius: '999px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '1rem',
                                fontFamily: `'HYWenHei', system-ui, sans-serif`,
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              Next Year →
                            </button>
                          </motion.div>
                        )}

                        {phase === 'loading' && (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DecisionLoading age={playerState.age} />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Save State button anchored at bottom center */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4%',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 20,
                  }}
                >
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    style={{
                      position: 'relative',
                      width: 'clamp(220px, 22vw, 300px)',
                      aspectRatio: '280/55',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'transform 0.1s',
                      transform: saved ? 'scale(0.95)' : 'scale(1)',
                      opacity: saved ? 0.7 : 1,
                    }}
                    title="Save State"
                  >
                    <Image src="/option_page/save_state_bar.svg" alt="Save State" fill style={{ objectFit: 'contain' }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {phase === 'transition' && (
        <YearTransition year={playerState.currentYear} age={playerState.age} />
      )}
    </div>
  )
}
