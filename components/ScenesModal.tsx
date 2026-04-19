'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { listSaves, SaveSlot } from '@/lib/save-game'
import { playSfx } from '@/lib/audio'
import { CharacterType } from '@/types/game'

interface Props {
  onClose: () => void
}

const CHARACTERS: CharacterType[] = ['maya', 'alex', 'jordan', 'sam']

const CHAR_IMAGES: Record<CharacterType, string> = {
  maya: '/your_scence/maya.svg',
  alex: '/your_scence/alex.svg',
  jordan: '/your_scence/jordan.svg',
  sam: '/your_scence/sam.svg',
}

export function ScenesModal({ onClose }: Props) {
  const router = useRouter()
  const [saves, setSaves] = useState<SaveSlot[]>([])

  useEffect(() => {
    setSaves(listSaves())
  }, [])

  function handleLoad(slot: SaveSlot) {
    playSfx('click')
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('launch_load_save', JSON.stringify(slot.playerState))
      sessionStorage.setItem('launch_character', slot.character)
      sessionStorage.setItem('launch_name', slot.characterName)
    }
    router.push('/game')
  }

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
              width: '70vw',
              maxWidth: '1400px',
              marginTop: '120px',
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
              style={{ bottom: '90%', left: '-10%', width: '15%' }}
            >
              <Image
                src="/landing/butter fly.svg"
                alt="Butterfly"
                width={150}
                height={150}
                className="landing-responsive-img"
              />
            </motion.div>

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
              style={{ bottom: '85%', right: '-12%', width: '25%' }}
            >
              <Image
                src="/landing/CONSETELATION.svg"
                alt="Constellation"
                width={250}
                height={250}
                className="landing-responsive-img"
              />
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

              {/* Back to landing overlay button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '-5%',
                  right: '0%',
                  zIndex: 30,
                  background: 'rgba(53, 67, 102, 0.8)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: `'HYWenHei', system-ui, sans-serif`,
                }}
              >
                ← Back to main menu
              </button>

              {/* Notebook Content Layout */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '7% 6% 8% 6%',
                  display: 'flex',
                }}
              >
                {/* Left Panel */}
                <div
                  style={{
                    width: '32%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingTop: '6%',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: `'HYWenHei', system-ui, sans-serif`,
                      color: '#344966',
                      fontSize: 'clamp(1rem, 1.8vw, 1.8rem)',
                      fontWeight: 400,
                      marginBottom: '40%',
                    }}
                  >
                    Your Scenes
                  </h2>
                  <div style={{ padding: '0 10%', marginTop: '5%' }}>
                    <p
                      style={{
                        fontFamily: `'HYWenHei', system-ui, sans-serif`,
                        color: '#415779',
                        fontSize: 'clamp(0.9rem, 1.4vw, 1.3rem)',
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      These are all the scenes you have tried for each character.
                      Take a look and start from where you last were!
                    </p>
                  </div>
                </div>

                {/* Right Panel - Saves List (2x2 Grid) */}
                <div
                  style={{
                    width: '68%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2vw',
                    paddingLeft: '5vw',
                    paddingRight: '3vw',
                    paddingBottom: '2rem',
                    paddingTop: '2%',
                    justifyItems: 'center',
                    alignItems: 'center',
                  }}
                >
                  {CHARACTERS.map((char) => {
                    const latestSave = saves.find((s) => s.character === char)
                    const isLocked = !latestSave
                    const charImage = CHAR_IMAGES[char]

                    return (
                      <motion.div
                        key={char}
                        whileHover={!isLocked ? { scale: 1.05 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        onClick={() => {
                          if (!isLocked && latestSave) handleLoad(latestSave)
                        }}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: isLocked ? 'default' : 'pointer',
                        }}
                      >
                        {/* Frame Container */}
                        <div
                          style={{
                            position: 'relative',
                            width: 'clamp(120px, 11vw, 180px)',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            src={charImage}
                            alt={char}
                            fill
                            style={{ objectFit: 'contain' }}
                          />

                          {isLocked && (
                            <Image
                              src="/your_scence/locked.svg"
                              alt="Locked"
                              fill
                              style={{ objectFit: 'contain', zIndex: 10 }}
                            />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
