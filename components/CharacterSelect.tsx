'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { CharacterType } from '@/types/game'
import { playSfx } from '@/lib/audio'

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
                onClick={() => onSelect(char.type, char.name)}
                whileHover={{ scale: 1.08, x: -15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={char.plateImg}
                  alt={char.title}
                  width={130}
                  height={42}
                  className="plate-img"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
