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
      const decision: GeneratedDecision = await res.json()
      setCurrentDecision(decision)
      setPhase('decision')

      // Narrate the scene scenario via ElevenLabs (after a short delay so screen renders first)
      setTimeout(() => narrateScene(decision.scenario), 400)
    } catch (err) {
      console.error('Failed to fetch decision:', err)
      setPhase('decision')
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

  const [muted, setMuted] = useState(false)
  const [badgeOpen, setBadgeOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Initialize mute state
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
      <div className="game-page-wrapper">
        <div className="game-frame-board">
          <Image
            src="/your_scence/Frame_board.svg"
            alt=""
            fill
            className="game-frame-img"
            priority
          />

          <div className="game-content-overlay">
            {/* ── 1ST MAIN DIV: Top Status Bar ────────────────── */}
            <div className="game-top-bar">
              <div className="game-top-item">
                <span className="year-age-label" style={{ marginRight: '1rem' }}>
                  Year {playerState.currentYear} · Age {playerState.age}
                </span>
              </div>

              <div className="game-top-item">
                <div className="money-container">
                  <Image
                    src="/option_page/money_holder.svg"
                    alt=""
                    width={220}
                    height={52}
                    className="money-holder-img"
                  />
                  <div className="money-text">
                    <span className="networth-amount">
                      {playerState.netWorth.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="game-top-item">
                <button
                  onClick={handleMuteToggle}
                  className="mute-btn"
                  title={muted ? 'Unmute' : 'Mute'}
                >
                  <Image
                    src={muted ? "/option_page/volumn_mute_tab.svg" : "/option_page/volumn_unmute_tab.svg"}
                    alt={muted ? "Muted" : "Unmuted"}
                    width={45}
                    height={45}
                    className="mute-btn-img"
                  />
                </button>
              </div>
            </div>

            {/* ── 2ND MAIN DIV: Middle Content ────────────────── */}
            <div className="game-middle-content">
              {/* Left Half: Character Info */}
              <div className="game-left-half">
                <div className="character-story-title">Story: {playerState.name}</div>
                <div className="character-image-placeholder">
                  {/* Image placeholder */}
                  needs image
                </div>
              </div>

              {/* Right Half: Navigation, Progress, Decision */}
              <div className="game-right-half">
                <div className="right-half-nav">
                  {/* Progress Indicator (Butterfly) */}
                  <div className="butterfly-progress-container">
                    <motion.div
                      className="butterfly-sprite"
                      initial={{ left: '0%' }}
                      animate={{ left: `${(playerState.currentYear / 12) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                      <Image
                        src="/landing/butter fly.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="loading-butterfly-img"
                      />
                    </motion.div>
                  </div>

                  {/* Financial Badge / Term Pop-up */}
                  <div className="financial-badge-container">
                    <motion.div 
                      className="financial-badge-box"
                      onClick={() => setBadgeOpen(!badgeOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="financial-badge-text">
                        {currentDecision?.financial_term || "Financial Wellness"}
                      </div>
                    </motion.div>
                    <AnimatePresence>
                      {badgeOpen && currentDecision && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="badge-popup"
                        >
                          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{currentDecision.financial_term}</p>
                          <p>{currentDecision.definition}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Home Button */}
                  <button onClick={handleGoHome} className="home-btn">
                    <Image
                      src="/option_page/home_tab.svg"
                      alt="Home"
                      width={42}
                      height={42}
                      className="home-btn-img"
                    />
                  </button>
                </div>

                {/* Decision Area */}
                <div className="decision-area">
                  <AnimatePresence mode="wait">
                    {phase === 'decision' && currentDecision && (
                      <motion.div
                        key={currentDecision.scenario}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                      >
                        <p className="decision-scenario-large">{currentDecision.scenario}</p>
                        <h2 className="decision-question-game">{currentDecision.question}</h2>

                        <div className="options-list">
                          {currentDecision.choices.map((choice, i) => (
                            <button
                              key={i}
                              className="option-button"
                              onClick={() => handleChoice(i)}
                              disabled={chosenIndex !== null}
                            >
                              <Image
                                src="/option_page/option_bar.svg"
                                alt=""
                                width={600}
                                height={60}
                                className="option-bar-img"
                              />
                              <div className="option-text-container">
                                <div className="option-title">{choice.title}</div>
                                <div className="option-impact">{choice.impact}</div>
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
                        className="fact-display"
                        style={{ textAlign: 'center', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                      >
                         <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2E385F' }}>The Result</h3>
                         <div style={{ background: 'rgba(46, 56, 95, 0.05)', padding: '1rem', borderRadius: '1rem' }}>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '0.5rem', fontWeight: 600 }}>{currentDecision.choices[chosenIndex].lesson}</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.4 }}>{currentDecision.fact_after}</p>
                         </div>
                         <button 
                            onClick={handleContinue}
                            className="bg-[#2E385F] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                            style={{ alignSelf: 'center', marginTop: '0.5rem' }}
                         >
                            Next Year →
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {phase === 'loading' && <DecisionLoading age={playerState.age} />}
                </div>
              </div>
            </div>

            {/* ── 3RD MAIN DIV: Bottom Action Bar ────────────────── */}
            <div className="game-bottom-bar">
              <button 
                onClick={handleSave}
                className="save-game-btn"
                disabled={saving || saved}
                title={saved ? 'Game Saved' : saving ? 'Saving...' : 'Save Game'}
                aria-label="Save Game"
              >
                <Image
                  src="/option_page/save_state_bar.svg"
                  alt=""
                  width={280}
                  height={55}
                  className="save-bar-img"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {phase === 'transition' && (
        <YearTransition year={playerState.currentYear} age={playerState.age} />
      )}
    </div>
  )
}
