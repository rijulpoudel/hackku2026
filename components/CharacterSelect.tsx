'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { CharacterType } from '@/types/game'

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
    description: 'Free tuition. Health insurance. Loans deferred — but accruing interest every month. Smart, disciplined, and completely unprepared for real-world money. The academic path has hidden costs AND hidden benefits.',
  },
  {
    type: 'alex',
    name: 'Alex Rivera',
    title: 'Corporate Tech',
    plateImg: '/your_scence/Corporate employee.svg',
    salary: '$58,000/yr',
    netWorth: '-$29,900',
    description: 'Stable salary. 401k with 5% match. Full benefits. On paper: the dream. High enough income to build real wealth early — or make expensive lifestyle mistakes that compound for decades.',
  },
  {
    type: 'jordan',
    name: 'Jordan Kim',
    title: 'Freelance Creative',
    plateImg: '/your_scence/Freelance.svg',
    salary: '$0 (building)',
    netWorth: '-$36,000',
    description: 'Building a client base from scratch. No employer to catch anything. Taxes, health insurance, retirement — all yours. High freedom, high responsibility. The feast-or-famine cycle starts now.',
  },
  {
    type: 'sam',
    name: 'Sam Patel',
    title: 'Public School Teacher',
    plateImg: '/your_scence/Side hustler.svg',
    salary: '$38,000/yr',
    netWorth: '-$31,900',
    description: 'Low income on paper. PSLF-eligible from day one. Pension. Low cost of living. If played right, quietly the most financially secure path of the four. Knowing the right programs changes everything.',
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
          alt=""
          width={1200}
          height={800}
          className="frame-board-img"
        />

        <div className="character-content-overlay">
          {/* Left: title + description box */}
          <div className="character-left-section">
            <h2 className="character-pick-title">Pick your story</h2>

            <div className="character-description-container">
              <Image
                src="/your_scence/Description box.svg"
                alt=""
                width={400}
                height={300}
                className="description-box-img"
              />
              <div className="description-text-overlay">
                <p style={{ fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.8rem', textAlign: 'center' }}>
                  {hoveredChar.name}
                  <span style={{ fontWeight: 400, marginLeft: '0.3rem', fontSize: '0.68rem', opacity: 0.7 }}>
                    · {hoveredChar.title}
                  </span>
                </p>
                <p style={{ fontSize: '0.65rem', marginBottom: '0.35rem', opacity: 0.75, textAlign: 'center' }}>
                  {hoveredChar.salary} · {hoveredChar.netWorth} net worth
                </p>
                <p className="description-text" style={{ fontSize: '0.63rem' }}>{hoveredChar.description}</p>
              </div>
            </div>
          </div>

          {/* Right: character plates */}
          <div className="character-right-section">
            {CHARACTERS.map((char, i) => (
              <motion.button
                key={char.type}
                className={`character-plate-button plate-${i}`}
                onMouseEnter={() => setHoveredChar(char)}
                onClick={() => onSelect(char.type, char.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={char.plateImg}
                  alt={char.title}
                  width={320}
                  height={100}
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
