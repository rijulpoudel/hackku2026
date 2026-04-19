'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '@/lib/audio'

export interface CustomConfig {
  name: string
  career: string
  careerLabel: string
  salary: number
  loanBalance: number
  savings: number
  isFreelancing: boolean
  hasCreditCardDebt: boolean
}

interface Props {
  onComplete: (config: CustomConfig) => void
  onBack: () => void
}

const CAREERS = [
  { id: 'tech',         label: 'Tech Worker',        emoji: '💻', hint: '$55k–$120k' },
  { id: 'healthcare',   label: 'Healthcare',          emoji: '🏥', hint: '$40k–$75k'  },
  { id: 'education',    label: 'Teacher',             emoji: '📚', hint: '$30k–$55k'  },
  { id: 'finance',      label: 'Finance / Banking',   emoji: '📈', hint: '$55k–$100k' },
  { id: 'creative',     label: 'Creative / Artist',   emoji: '🎨', hint: '$0k–$45k'   },
  { id: 'trade',        label: 'Skilled Trade',       emoji: '🔧', hint: '$40k–$70k'  },
  { id: 'entrepreneur', label: 'Entrepreneur',        emoji: '🚀', hint: '$0k – ?'    },
  { id: 'other',        label: 'Something Else',      emoji: '✨', hint: ''            },
]

const STEP_TITLES = ['Who are you?', 'Your starting numbers', 'Your situation']

export function CustomCharacterForm({ onComplete, onBack }: Props) {
  const [step, setStep]                   = useState(1)
  const [name, setName]                   = useState('')
  const [career, setCareer]               = useState('')
  const [salary, setSalary]               = useState(45000)
  const [loanBalance, setLoanBalance]     = useState(34000)
  const [savings, setSavings]             = useState(2100)
  const [isFreelancing, setIsFreelancing] = useState(false)
  const [hasCCDebt, setHasCCDebt]         = useState(false)

  const netWorth = savings - loanBalance - (hasCCDebt ? 3000 : 0)
  const canNext1 = career !== ''

  function next() { playSfx('click'); setStep(s => s + 1) }
  function back() {
    playSfx('click')
    if (step === 1) onBack()
    else setStep(s => s - 1)
  }

  function start() {
    playSfx('click')
    const careerObj = CAREERS.find(c => c.id === career)
    onComplete({
      name:          name.trim() || 'Graduate',
      career,
      careerLabel:   careerObj?.label ?? career,
      salary,
      loanBalance,
      savings,
      isFreelancing,
      hasCreditCardDebt: hasCCDebt,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="custom-form-wrapper"
    >
      {/* Step dots */}
      <div className="custom-form-steps">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`custom-form-dot ${s === step ? 'active' : s < step ? 'done' : ''}`}
          />
        ))}
      </div>

      <p className="custom-form-subtitle">Step {step} of 3 — {STEP_TITLES[step - 1]}</p>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Name + Career ─────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="custom-form-step"
          >
            <h2 className="custom-form-heading">What's your name?</h2>
            <p className="custom-form-body">
              Your story starts here. We'll use Gemini AI to build 12 years of decisions around you.
            </p>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your first name"
              maxLength={30}
              className="custom-form-input"
            />

            <h3 className="custom-form-label">What do you do?</h3>
            <div className="custom-career-grid">
              {CAREERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { playSfx('hover'); setCareer(c.id) }}
                  className={`custom-career-btn ${career === c.id ? 'selected' : ''}`}
                >
                  <span className="career-emoji">{c.emoji}</span>
                  <span className="career-name">{c.label}</span>
                  {c.hint && <span className="career-hint">{c.hint}</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Numbers ───────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="custom-form-step"
          >
            <h2 className="custom-form-heading">Your starting numbers</h2>
            <p className="custom-form-body">
              Be honest — the more accurate this is, the more your scenarios will hit home.
            </p>

            <SliderField
              label="Annual salary"
              value={salary}
              min={0}
              max={150000}
              step={1000}
              format={v => v === 0 ? '$0 (building from scratch)' : `$${v.toLocaleString()}/yr`}
              onChange={setSalary}
            />
            <SliderField
              label="Student loan balance"
              value={loanBalance}
              min={0}
              max={120000}
              step={500}
              format={v => v === 0 ? 'No loans' : `-$${v.toLocaleString()}`}
              onChange={setLoanBalance}
            />
            <SliderField
              label="Current savings"
              value={savings}
              min={0}
              max={25000}
              step={100}
              format={v => `$${v.toLocaleString()}`}
              onChange={setSavings}
            />
          </motion.div>
        )}

        {/* ── Step 3: Situation + Confirm ───────────────────────── */}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="custom-form-step"
          >
            <h2 className="custom-form-heading">Your situation</h2>
            <p className="custom-form-body">Check everything that applies right now.</p>

            <div className="custom-checks">
              <CheckOption
                checked={isFreelancing}
                onChange={setIsFreelancing}
                label="I'm freelancing or self-employed"
                sublabel="No employer benefits, irregular income"
              />
              <CheckOption
                checked={hasCCDebt}
                onChange={setHasCCDebt}
                label="I have credit card debt"
                sublabel="Carrying a balance at 20%+ interest"
              />
            </div>

            <div className="custom-net-worth-preview">
              <p className="custom-preview-label">YOUR STARTING NET WORTH</p>
              <p className={`custom-preview-value ${netWorth < 0 ? 'negative' : 'positive'}`}>
                {netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
              </p>
              <p className="custom-preview-breakdown">
                ${savings.toLocaleString()} savings
                {loanBalance > 0 ? ` − $${loanBalance.toLocaleString()} loans` : ''}
                {hasCCDebt ? ' − $3,000 credit card' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="custom-form-nav">
        <button onClick={back} className="custom-btn-back">← Back</button>

        {step < 3 ? (
          <button
            onClick={next}
            disabled={step === 1 && !canNext1}
            className={`custom-btn-next ${step === 1 && !canNext1 ? 'disabled' : ''}`}
          >
            Next →
          </button>
        ) : (
          <button onClick={start} className="custom-btn-start">
            Start My Story →
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SliderField({
  label, value, min, max, step, format, onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <div className="slider-field">
      <div className="slider-field-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input"
      />
    </div>
  )
}

function CheckOption({
  checked, onChange, label, sublabel,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  sublabel: string
}) {
  return (
    <button
      onClick={() => { playSfx('hover'); onChange(!checked) }}
      className={`check-option ${checked ? 'checked' : ''}`}
    >
      <div className={`check-box ${checked ? 'checked' : ''}`}>
        {checked && '✓'}
      </div>
      <div className="check-text">
        <span className="check-label">{label}</span>
        <span className="check-sublabel">{sublabel}</span>
      </div>
    </button>
  )
}
