'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Props {
  onClose: () => void
}

export function CreditsModal({ onClose }: Props) {
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
              width: '80vw',
              maxWidth: '1200px',
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
              <Image
                src="/landing/butter fly.svg"
                alt="Butterfly"
                width={100}
                height={100}
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
              style={{ bottom: '85%', right: '-8%', width: '18%' }}
            >
              <Image
                src="/landing/CONSETELATION.svg"
                alt="Constellation"
                width={200}
                height={200}
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
                  top: '-8%',
                  left: 0,
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
                  padding: '10% 8% 5% 8%', // Adjusted bottom padding down to give pics.svg more space
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Credits Box anchored top left */}
                <div style={{ alignSelf: 'flex-start', marginBottom: '2vw', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(211, 196, 169, 0.5)', padding: '0.8vw 3vw', borderRadius: '4px' }}>
                  <div style={{ color: '#d3c4a9', letterSpacing: '4px', marginBottom: '0.2vw' }}>
                    <span style={{ fontSize: '0.8em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '1.2em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '0.8em' }}>✦</span>
                  </div>
                  <h2 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1.5rem, 2vw, 2.2rem)', fontWeight: 'bold', color: '#344966', margin: 0 }}>
                    Credits
                  </h2>
                  <div style={{ color: '#d3c4a9', letterSpacing: '4px', marginTop: '0.2vw' }}>
                    <span style={{ fontSize: '0.8em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '1.2em' }}>✦</span> <span>✦</span> <span style={{ fontSize: '0.8em' }}>✦</span>
                  </div>
                </div>

                {/* Names Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', justifyItems: 'center', marginBottom: '1vw' }}>
                  <h3 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1rem, 1.3vw, 1.5rem)', color: '#4a82a6', fontWeight: 'bold' }}>
                    Name: Mariska
                  </h3>
                  <h3 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1rem, 1.3vw, 1.5rem)', color: '#4a82a6', fontWeight: 'bold' }}>
                    Name: Rijul Poudel
                  </h3>
                  <h3 style={{ fontFamily: `'HYWenHei', system-ui, sans-serif`, fontSize: 'clamp(1rem, 1.3vw, 1.5rem)', color: '#4a82a6', fontWeight: 'bold' }}>
                    Name: Shashwat
                  </h3>
                </div>

                {/* Unified Pics SVG Container */}
                <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                  <Image src="/option_page/pics.svg" alt="Team Pictures" fill style={{ objectFit: 'contain', objectPosition: 'top' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
