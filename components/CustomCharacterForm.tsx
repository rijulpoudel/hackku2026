'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CustomConfig {
  name: string
  career: string
  salary: number
  loanBalance: number
  savings: number
  isFreelancing: boolean
  hasChildren: boolean
  ownsHome: boolean
  isPSLFEligible: boolean
}

interface Props {
  onComplete: (config: CustomConfig) => void
  onBack: () => void
}

const CAREERS = [
  { id: 'tech',        label: 'Tech',         emoji: '💻', salaryHint: 55000 },
  { id: 'finance',     label: 'Finance',      emoji: '📈', salaryHint: 62000 },
  { id: 'teaching',    label: 'Teaching',     emoji: '📚', salaryHint: 38000 },
  { id: 'healthcare',  label: 'Healthcare',   emoji: '🏥', salaryHint: 52000 },
  { id: 'creative',    label: 'Creative',     emoji: '🎨', salaryHint: 34000 },
  { id: 'government',  label: 'Government',   emoji: '🏛️', salaryHint: 45000 },
  { id: 'nonprofit',   label: 'Nonprofit',    emoji: '🌿', salaryHint: 36000 },
  { id: 'trade',       label: 'Trade',        emoji: '🔧', salaryHint: 48000 },
]

const PSLF_CAREERS = new Set(['teaching', 'government', 'nonprofit', 'healthcare'])

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export function CustomCharacterForm({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [career, setCareer] = useState('')
  const [salary, setSalary] = useState(45000)
  const [loanBalance, setLoanBalance] = useState(30000)
  const [savings, setSavings] = useState(2000)
  const [isFreelancing, setIsFreelancing] = useState(false)
  const [hasChildren, setHasChildren] = useState(false)
  const [ownsHome, setOwnsHome] = useState(false)

  const netWorth = savings - loanBalance
  const isPSLF = PSLF_CAREERS.has(career)

  function pickCareer(id: string) {
    setCareer(id)
    const hint = CAREERS.find(c => c.id === id)?.salaryHint ?? 45000
    setSalary(hint)
    setIsFreelancing(id === 'creative')
  }

  function handleDone() {
    onComplete({
      name: name.trim() || 'Graduate',
      career,
      salary: isFreelancing ? 0 : salary,
      loanBalance,
      savings,
      isFreelancing,
      hasChildren,
      ownsHome,
      isPSLFEligible: isPSLF,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        style={{
          background: 'linear-gradient(145deg, #1e2a3a, #162032)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '1.5rem',
          padding: '2rem 2.2rem',
          width: '100%',
          maxWidth: 520,
          color: 'white',
          fontFamily: `'HYWenHei', system-ui, sans-serif`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
          <div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.2rem' }}>
              Custom Character · Step {step} of 3
            </p>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {step === 1 && 'Who are you?'}
              {step === 2 && 'Your finances'}
              {step === 3 && 'Your situation'}
            </h2>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: s === step ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: s === step ? '#4f7fff' : s < step ? '#22c55e' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* ── Step 1: Name + Career ── */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <label style={labelStyle}>Your name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name…"
                maxLength={24}
                style={inputStyle}
              />

              <label style={{ ...labelStyle, marginTop: '1.1rem' }}>Your career path</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                marginTop: '0.4rem',
              }}>
                {CAREERS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => pickCareer(c.id)}
                    style={{
                      background: career === c.id ? 'rgba(79,127,255,0.3)' : 'rgba(255,255,255,0.05)',
                      border: career === c.id ? '1.5px solid #4f7fff' : '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.7rem',
                      padding: '0.6rem 0.3rem',
                      cursor: 'pointer',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.15s',
                      fontFamily: `'HYWenHei', system-ui, sans-serif`,
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{c.emoji}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, opacity: 0.9 }}>{c.label}</span>
                  </button>
                ))}
              </div>

              {career && (
                <p style={{ fontSize: '0.68rem', opacity: 0.55, marginTop: '0.6rem' }}>
                  Typical starting salary: {fmt(CAREERS.find(c => c.id === career)?.salaryHint ?? 45000)}/yr
                </p>
              )}

              <div style={navRow}>
                <button onClick={onBack} style={ghostBtn}>← Back</button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!career || !name.trim()}
                  style={primaryBtn(!career || !name.trim())}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Sliders ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SliderField
                label="Annual salary"
                value={salary}
                min={0}
                max={150000}
                step={1000}
                format={fmt}
                onChange={setSalary}
                hint={isFreelancing ? 'Set to $0 if just starting out' : undefined}
              />
              <SliderField
                label="Student loan balance"
                value={loanBalance}
                min={0}
                max={120000}
                step={500}
                format={fmt}
                onChange={setLoanBalance}
              />
              <SliderField
                label="Savings (liquid)"
                value={savings}
                min={0}
                max={30000}
                step={100}
                format={fmt}
                onChange={setSavings}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
                padding: '0.7rem 0.9rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.6rem',
              }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Starting net worth</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: netWorth >= 0 ? '#22c55e' : '#f87171' }}>
                  {fmt(netWorth)}
                </span>
              </div>

              <div style={navRow}>
                <button onClick={() => setStep(1)} style={ghostBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={primaryBtn(false)}>Next →</button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Flags + confirm ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p style={{ fontSize: '0.72rem', opacity: 0.6, marginBottom: '0.9rem', lineHeight: 1.5 }}>
                These affect the scenarios Gemini generates for you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <CheckOption
                  checked={isFreelancing}
                  onChange={setIsFreelancing}
                  label="I'm freelancing / self-employed"
                  detail="Unlocks tax, health-insurance, and irregular-income scenarios"
                />
                <CheckOption
                  checked={hasChildren}
                  onChange={setHasChildren}
                  label="I have children"
                  detail="Adds childcare, 529 plan, and family financial scenarios"
                />
                <CheckOption
                  checked={ownsHome}
                  onChange={setOwnsHome}
                  label="I own a home"
                  detail="Enables mortgage, property tax, and home-equity scenarios"
                />
                {isPSLF && (
                  <div style={{
                    padding: '0.55rem 0.8rem',
                    background: 'rgba(79,127,255,0.12)',
                    border: '1px solid rgba(79,127,255,0.3)',
                    borderRadius: '0.6rem',
                    fontSize: '0.68rem',
                    opacity: 0.85,
                  }}>
                    ✓ Your career qualifies for <strong>Public Service Loan Forgiveness (PSLF)</strong> — you'll see scenarios about it.
                  </div>
                )}
              </div>

              {/* Final preview */}
              <div style={{
                marginTop: '1.1rem',
                padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.8rem',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                opacity: 0.8,
              }}>
                <strong>{name}</strong> · {CAREERS.find(c => c.id === career)?.emoji} {career}
                <br />
                Salary: {isFreelancing ? 'Freelancing (building)' : fmt(salary) + '/yr'}
                &nbsp;·&nbsp; Loans: {fmt(loanBalance)}
                &nbsp;·&nbsp; Net worth: <span style={{ color: netWorth >= 0 ? '#22c55e' : '#f87171' }}>{fmt(netWorth)}</span>
              </div>

              <div style={navRow}>
                <button onClick={() => setStep(2)} style={ghostBtn}>← Back</button>
                <button onClick={handleDone} style={primaryBtn(false)}>
                  Start My Story →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderField({
  label, value, min, max, step, format, onChange, hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (n: number) => string
  onChange: (n: number) => void
  hint?: string
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>{label}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#4f7fff' }}
      />
      {hint && <p style={{ fontSize: '0.62rem', opacity: 0.5, marginTop: '0.15rem' }}>{hint}</p>}
    </div>
  )
}

function CheckOption({
  checked, onChange, label, detail,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  detail: string
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.7rem',
        background: checked ? 'rgba(79,127,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: checked ? '1.5px solid rgba(79,127,255,0.4)' : '1.5px solid rgba(255,255,255,0.08)',
        borderRadius: '0.7rem',
        padding: '0.65rem 0.8rem',
        cursor: 'pointer',
        textAlign: 'left',
        color: 'white',
        fontFamily: `'HYWenHei', system-ui, sans-serif`,
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: checked ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
        background: checked ? '#4f7fff' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
      }}>
        {checked && <span style={{ fontSize: '0.7rem', color: 'white' }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '0.62rem', opacity: 0.55, marginTop: '0.15rem' }}>{detail}</div>
      </div>
    </button>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  opacity: 0.6,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '0.6rem',
  padding: '0.6rem 0.8rem',
  color: 'white',
  fontSize: '0.88rem',
  fontFamily: `'HYWenHei', system-ui, sans-serif`,
  outline: 'none',
  boxSizing: 'border-box',
}

const navRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1.4rem',
}

const ghostBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '0.55rem',
  color: 'rgba(255,255,255,0.6)',
  padding: '0.55rem 1rem',
  fontSize: '0.78rem',
  cursor: 'pointer',
  fontFamily: `'HYWenHei', system-ui, sans-serif`,
}

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? '#374151' : '#4f7fff',
    border: 'none',
    borderRadius: '0.55rem',
    color: 'white',
    padding: '0.55rem 1.3rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: `'HYWenHei', system-ui, sans-serif`,
    opacity: disabled ? 0.6 : 1,
    transition: 'background 0.15s',
  }
}
