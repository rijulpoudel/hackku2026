'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { CharacterType } from '@/types/game'
import { playSfx } from '@/lib/audio'
import { VoiceRecorder } from '@/components/VoiceRecorder'

const CHARACTERS: Array<{
  type: CharacterType
  name: string
  title: string
  plateImg: string
  salary: string
  netWorth: string
  description: string
}> = [
  {
    type: 'maya',
    name: 'Maya Chen',
    title: 'PhD Student',
    plateImg: '/your_scence/Grad student.svg',
    salary: '$28,000/yr stipend',
    netWorth: '-$34,000',
    description: 'Free tuition. Health insurance. Loans deferred — but accruing interest every month. Smart, disciplined, and completely unprepared for real-world money.',
  },
  {
    type: 'alex',
    name: 'Alex Rivera',
    title: 'Corporate Tech',
    plateImg: '/your_scence/Corporate employee.svg',
    salary: '$58,000/yr',
    netWorth: '-$29,900',
    description: 'Stable salary. 401k with 5% match. Full benefits. High enough income to build real wealth early — or make expensive lifestyle mistakes that compound for decades.',
  },
  {
    type: 'jordan',
    name: 'Jordan Kim',
    title: 'Freelance Creative',
    plateImg: '/your_scence/Freelance.svg',
    salary: '$0 (building)',
    netWorth: '-$36,000',
    description: 'Building a client base from scratch. Taxes, health insurance, retirement — all yours. High freedom, high responsibility. The feast-or-famine cycle starts now.',
  },
  {
    type: 'sam',
    name: 'Sam Patel',
    title: 'Public School Teacher',
    plateImg: '/your_scence/Side hustler.svg',
    salary: '$38,000/yr',
    netWorth: '-$31,900',
    description: 'Low income on paper. PSLF-eligible from day one. Pension. If played right, quietly the most financially secure path of the four. Knowing the right programs changes everything.',
  },
]

interface Props {
  onSelect: (character: CharacterType, name: string) => void
}

export function CharacterSelect({ onSelect }: Props) {
  const [hoveredChar, setHoveredChar] = useState(CHARACTERS[0])
  // After picking a character, show the voice step before starting
  const [pendingChar, setPendingChar] = useState<typeof CHARACTERS[0] | null>(null)

  function handleCharClick(char: typeof CHARACTERS[0]) {
    playSfx('click')
    setPendingChar(char)
  }

  function confirmAndStart(char: typeof CHARACTERS[0]) {
    // Clear any stale voice ID from a previous session
    sessionStorage.removeItem('launch_custom_voice_id')
    onSelect(char.type, char.name)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="character-select-wrapper"
    >
      <div className="character-frame-board">
        <Image
          src="/your_scence/Frame_board.svg"
          alt="Selection Board"
          width={1400}
          height={900}
          className="frame-board-img"
          priority
        />

        <div className="character-content-overlay">
          {/* Left: title + description box */}
          <div className="character-left-section">
            <div className="character-title-container">
              {/* Animated butterfly near the title */}
              <motion.div
                className="title-butterfly"
                animate={{
                  x: [0, 15, 0, -15, 0],
                  y: [0, -15, -30, -15, 0],
                  rotate: [0, 10, 0, -10, 0],
                  scaleY: [1, 0.7, 1, 0.7, 1],
                  filter: [
                    'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
                    'brightness(1.4) drop-shadow(0 0 15px rgba(255,255,255,0.7))',
                    'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Image
                  src="/landing/butter fly.svg"
                  alt=""
                  width={40}
                  height={40}
                />
              </motion.div>
              <h2 className="character-pick-title">Pick your story</h2>
            </div>

            <div className="character-description-container">
              <Image
                src="/your_scence/Description box.svg"
                alt=""
                width={350}
                height={270}
                className="description-box-img"
              />
              <div className="description-text-overlay">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredChar.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    className="description-text"
                  >
                    <p style={{ fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.82rem' }}>
                      {hoveredChar.name}
                      <span style={{ fontWeight: 400, marginLeft: '0.3rem', fontSize: '0.7rem', opacity: 0.7 }}>
                        · {hoveredChar.title}
                      </span>
                    </p>
                    <p style={{ fontSize: '0.68rem', marginBottom: '0.3rem', opacity: 0.75 }}>
                      {hoveredChar.salary} · {hoveredChar.netWorth} net worth
                    </p>
                    <p style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>{hoveredChar.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: character plates */}
          <div className="character-right-section">
            {CHARACTERS.map((char, i) => (
              <motion.button
                key={char.type}
                className={`character-plate-button plate-${i}`}
                onMouseEnter={() => { setHoveredChar(char); playSfx('hover') }}
                onClick={() => handleCharClick(char)}
                whileHover={{ scale: 1.08, x: -15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={char.plateImg}
                  alt={char.title}
                  width={150}
                  height={48}
                  style={{ height: 'auto' }}
                  className="plate-img"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice step — slides up over the board after picking a character */}
      <AnimatePresence>
        {pendingChar && (
          <motion.div
            key="voice-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                maxWidth: 380,
                width: '90%',
              }}
            >
              {/* Character confirmation header */}
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '1rem',
                padding: '1rem 1.5rem',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: `'HYWenHei', system-ui, sans-serif`,
              }}>
                <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.2rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Your story begins
                </p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{pendingChar.name}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{pendingChar.title} · {pendingChar.netWorth}</p>
              </div>

              {/* Voice recorder */}
              <VoiceRecorder
                characterName={pendingChar.name}
                onCloned={() => confirmAndStart(pendingChar)}
                onSkip={() => confirmAndStart(pendingChar)}
              />

              {/* Back link */}
              <button
                onClick={() => setPendingChar(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontFamily: `'HYWenHei', system-ui, sans-serif`,
                  textDecoration: 'underline',
                }}
              >
                ← Change character
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
