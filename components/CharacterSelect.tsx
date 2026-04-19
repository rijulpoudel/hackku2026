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
  portrait: string
  salary: string
  netWorth: string
  description: string
}> = [
  {
    type: 'maya',
    name: 'Maya Chen',
    title: 'Corporate Employee',
    portrait: '/your_scence/Grad student.svg',
    salary: '$52,000/year Software company, Austin TX',
    netWorth: '-$34,000',
    description: 'Stable salary. 401k with match. Health insurance. The classic path.',
  },
  {
    type: 'alex',
    name: 'Alex Rivera',
    title: 'Freelance Creative',
    portrait: '/your_scence/Corporate employee.svg',
    salary: '$0 (building)',
    netWorth: '-$29,900',
    description: 'Building a client base from scratch. Taxes, health insurance, retirement — all yours. High freedom, high responsibility. The feast-or-famine cycle starts now.',
  },
  {
    type: 'jordan',
    name: 'Jordan Kim',
    title: 'PhD Student',
    portrait: '/your_scence/Freelance.svg',
    salary: '$28,000/yr stipend',
    netWorth: '-$36,000',
    description: 'Free tuition. Health insurance. Loans deferred — but accruing interest every month. Smart, disciplined, and completely unprepared for real-world money.',
  },
  {
    type: 'sam',
    name: 'Sam Patel',
    title: 'Public School Teacher',
    portrait: '/your_scence/Side hustler.svg',
    salary: '$38,000/yr',
    netWorth: '-$31,900',
    description: 'Low income on paper. PSLF-eligible from day one. Pension. If played right, quietly the most financially secure path of the four. Knowing the right programs changes everything.',
  },
]

interface Props {
  onSelect: (character: CharacterType, name: string) => void
  onBack?: () => void
}

export function CharacterSelect({ onSelect, onBack }: Props) {
  const [hoveredChar, setHoveredChar] = useState(CHARACTERS[0])

  return (
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
              width: '85vw',
              maxWidth: '1300px',
              marginTop: '100px',
            }}
          >
            {/* Animated elements from landing screen context */}
            <motion.div
              className="landing-butterfly"
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
              style={{ bottom: '90%', left: '-5%', width: '10%' }}
            >
              <Image src="/landing/butter fly.svg" alt="Butterfly" width={100} height={100} className="landing-responsive-img" />
            </motion.div>

            {/* Notebook container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1.6',
              }}
            >
              <Image
                src="/your_scence/Frame_board.svg"
                alt="Notebook Board"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />

              {/* Home button top right */}
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    position: 'absolute',
                    top: '1%',
                    right: '3%',
                    width: 'clamp(80px, 7vw, 110px)',
                    aspectRatio: '100/45',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    zIndex: 30,
                    transition: 'transform 0.1s',
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Image src="/option_page/home_tab.svg" alt="Home Base" fill style={{ objectFit: 'contain' }} />
                </button>
              )}

              {/* Watermark "Your Future" */}
              <div style={{ position: 'absolute', bottom: '15%', right: '15%', zIndex: 10, opacity: 0.15, pointerEvents: 'none', right: '35%' }}>
                <span style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(4rem, 6vw, 7rem)', fontWeight: 'bold', color: '#8b806b' }}>Your Future</span>
              </div>

              {/* Notebook Content Layout */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '7% 6% 8% 6%',
                  display: 'flex',
                  zIndex: 20,
                }}
              >
                {/* Left Half: Titles and Descriptions */}
                <div
                  style={{
                    width: '35%',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: '2vw',
                    paddingTop: '2%',
                  }}
                >
                  {/* Title Box */}
                  <div style={{ alignSelf: 'flex-start', marginBottom: '2vw', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(211, 196, 169, 0.5)', padding: '0.8vw 2vw', borderRadius: '4px' }}>
                    <div style={{ color: '#d3c4a9', letterSpacing: '4px', marginBottom: '0.2vw' }}>
                      <span style={{ fontSize: '0.8em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '1.2em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '0.8em' }}>✦</span>
                    </div>
                    <h2 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1.2rem, 1.8vw, 2.2rem)', fontWeight: 'bold', color: '#344966', margin: 0 }}>
                      Pick your Story
                    </h2>
                    <div style={{ color: '#d3c4a9', letterSpacing: '4px', marginTop: '0.2vw' }}>
                      <span style={{ fontSize: '0.8em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '1.2em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '0.8em' }}>✦</span>
                    </div>
                  </div>

                  {/* Character Description Box */}
                  <div
                    style={{
                      background: 'rgba(244, 237, 225, 0.6)',
                      borderRadius: '16px',
                      padding: '2vw',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={hoveredChar.type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1.4rem, 2vw, 2rem)', color: '#344966', fontWeight: 'bold', marginBottom: '0.5vw' }}>
                          {hoveredChar.name.split(' ')[0]}
                        </h3>
                        <p style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, color: '#4a82a6', fontSize: 'clamp(0.9rem, 1vw, 1.2rem)', fontWeight: 'bold', marginBottom: '1vw' }}>
                          {hoveredChar.title}
                        </p>
                        <p style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, color: '#344966', fontSize: 'clamp(0.8rem, 0.9vw, 1.1rem)', lineHeight: 1.6, fontWeight: 500 }}>
                          {hoveredChar.salary} {hoveredChar.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Half: Character Cards stepped diagonally */}
                <div
                  style={{
                    width: '65%',
                    position: 'relative',
                    display: 'flex',
                  }}
                >
                  {CHARACTERS.map((char, index) => {
                    const topOffset = `${10 + index * 15}%`;
                    const leftOffset = `${index * 22}%`;

                    return (
                      <motion.button
                        key={char.type}
                        onMouseEnter={() => { setHoveredChar(char); playSfx('hover') }}
                        onClick={() => onSelect(char.type, char.name)}
                        whileHover={{ scale: 1.05, zIndex: 30 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          position: 'absolute',
                          top: topOffset,
                          left: leftOffset,
                          width: 'clamp(120px, 14vw, 180px)',
                          aspectRatio: '0.55',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          zIndex: hoveredChar.type === char.type ? 20 : 10,
                          filter: hoveredChar.type === char.type ? 'none' : 'brightness(0.8) contrast(0.9)',
                          transition: 'filter 0.3s',
                        }}
                      >
                        <Image src={char.portrait} alt={char.name} fill style={{ objectFit: 'contain' }} />
                      </motion.button>
                    )
                  })}

                  {/* Little butterfly decorating one of the cards */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      x: [0, 5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '45%', right: '15%', width: 'clamp(30px, 4vw, 50px)', zIndex: 25, pointerEvents: 'none' }}
                  >
                    <Image src="/landing/butter fly.svg" alt="" width={50} height={50} />
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
