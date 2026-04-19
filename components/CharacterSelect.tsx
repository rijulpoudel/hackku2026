'use client'
import { motion } from 'framer-motion'
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
        <Image 
          src="/your_scence/Frame_board.svg" 
          alt="" 
          width={1200} 
          height={800} 
          className="frame-board-img"
        />

        <div className="character-content-overlay">
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
                <p className="description-text" style={{ whiteSpace: 'pre-line' }}>{hoveredChar.description}</p>
              </div>
            </div>
          </div>

          <div className="character-right-section">
            {CHARACTERS.map((char, i) => (
              <motion.button
                key={char.type}
                className={`character-plate-button plate-${i}`}
                onMouseEnter={() => setHoveredChar(char)}
                onClick={() => handleSelect(char.type)}
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
