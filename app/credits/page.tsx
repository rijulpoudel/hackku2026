'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '@/lib/audio'

export default function CreditsPage() {
  const router = useRouter()

  function handleGoHome() {
    playSfx('click')
    router.push('/')
  }

  return (
    <div className="page-wrapper relative">
      <main className="landing-main" style={{ zIndex: 10 }}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="landing-content"
            style={{ flexDirection: 'column' }}
          >
            <div
              style={{
                position: 'relative',
                width: '90vw',
                maxWidth: '1300px',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
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
                style={{ bottom: '85%', right: '-8%', width: '18%', zIndex: -1 }}
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
                  maxWidth: '136vh',
                  aspectRatio: '1.6',
                  paddingTop: '50px',
                }}
              >
                <Image
                  src="/your_scence/Frame_board.svg"
                  alt="Board"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />

                {/* Home Button top right - Positioned to align with the board's tabs */}
                <button
                  onClick={handleGoHome}
                  style={{
                    position: 'absolute',
                    top: '11%',
                    right: '6.5%',
                    width: 'clamp(80px, 7vw, 110px)',
                    aspectRatio: '100/45',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    zIndex: 20,
                    transition: 'transform 0.1s',
                    transform: 'translate(35px, -13px) scale(0.81)', // Move 35px right, 13px up, and scale down 9%
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.86)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.91)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.91)'}
                >
                  <Image src="/option_page/home_tab.svg" alt="Home Base" fill style={{ objectFit: 'contain' }} />
                </button>

                {/* Credits Content */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '8% 12% 8% 11%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Text Credits Overlay */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontFamily: `'HYWenHei', system-ui, sans-serif`,
                    color: '#344966',
                    marginBottom: '15px',
                    zIndex: 10
                  }}>
                    <div style={{ fontSize: 'clamp(1.2rem, 1.8vw, 2rem)', fontWeight: 800, marginBottom: '8px' }}>Credits</div>
                    <div style={{ display: 'flex', gap: '110px', fontSize: 'clamp(0.85rem, 1.1vw, 1.2rem)', fontWeight: 600 }}>
                      <div>Name: Mariska</div>
                      <div>Name: Rijul Poudel</div>
                      <div>Name: Shashwat</div>
                    </div>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '65%', transform: 'translateY(25px)' }}>
                    <Image
                      src="/option_page/credit_us.svg"
                      alt="Credits Info"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>


    </div>
  )
}
