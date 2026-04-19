'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { CharacterType } from '@/types/game'

const CHARACTERS: Array<{
  type: CharacterType
  title: string
  plateImg: string
  description: string
}> = [
  {
    type: 'freelancer',
    title: 'Freelancer',
    plateImg: '/your_scence/Freelance.svg',
    description: '• Variable income\n• No benefits\n• Full control\n• Self-employment taxes',
  },
  {
    type: 'student',
    title: 'Grad Student',
    plateImg: '/your_scence/Grad student.svg',
    description: '• Low income now\n• High potential later\n• Unique tax situation',
  },
  {
    type: 'side-hustler',
    title: 'Side Hustler',
    plateImg: '/your_scence/Side hustler.svg',
    description: '• Two income streams\n• Complex taxes\n• High upside\n• High stress',
  },
  {
    type: 'employee',
    title: 'Corporate Employee',
    plateImg: '/your_scence/Corporate employee.svg',
    description: '• Stable salary\n• 401k with match\n• Health insurance\n• The classic path',
  },
]

interface Props {
  onSelect: (character: CharacterType, name: string) => void
}

export function CharacterSelect({ onSelect }: Props) {
  const [hoveredChar, setHoveredChar] = useState(CHARACTERS[0])

  const handleSelect = (type: CharacterType) => {
    const names: Record<CharacterType, string> = {
      employee: 'Alex',
      freelancer: 'Jordan',
      student: 'Casey',
      'side-hustler': 'Morgan',
    }
    onSelect(type, names[type])
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="character-select-wrapper"
    >
      <div className="character-frame-board">
        {/* Main Background Board */}
        <Image 
          src="/your_scence/Frame_board.svg" 
          alt="Selection Board" 
          width={1400} 
          height={900} 
          className="frame-board-img"
          priority
        />

        <div className="character-content-overlay">
          {/* Left Side: Portfolio / Story Details */}
          <div className="character-left-section">
            <div className="character-title-container">
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
                    'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))'
                  ]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <Image 
                  src="/landing/butter fly.svg" 
                  alt="" 
                  width={40} 
                  height={40} 
                  className="butterfly-mini"
                />
              </motion.div>
              <h2 className="character-pick-title">Pick your story</h2>
            </div>
            
            <div className="character-description-container">
              <Image 
                src="/your_scence/Description box.svg" 
                alt="Description Backdrop" 
                width={350} 
                height={270} 
                className="description-box-img"
              />
              <div className="description-text-overlay">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={hoveredChar.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="description-text"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {hoveredChar.description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Character Plates */}
          <div className="character-right-section">
            {CHARACTERS.map((char, i) => (
              <motion.button
                key={char.type}
                className={`character-plate-button plate-${i}`}
                onMouseEnter={() => setHoveredChar(char)}
                onClick={() => handleSelect(char.type)}
                whileHover={{ scale: 1.08, x: -15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image 
                  src={char.plateImg} 
                  alt={char.title} 
                  width={310} 
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
