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
        {/* Cinematic Flying Butterfly 1 (The original) */}
        <motion.div
          style={{
            position: 'fixed',
            bottom: '15%',
            left: '12%',
            width: 'clamp(50px, 5vw, 80px)',
            zIndex: 30,
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, 250, 500, 850, 950, 600, 250, 0],
            y: [0, -180, -100, 50, 150, -200, -220, 0],
            rotate: [0, 25, -15, 30, -20, 15, -10, 0],
            rotateY: [0, 0, 0, 0, 180, 180, 180, 0], 
            scale: [1, 1.4, 0.9, 1.2, 1.5, 0.8, 1.3, 1],
            zIndex: [30, 27, 31, 27, 31, 27, 30, 30],
            filter: [
              'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              'drop-shadow(0 15px 20px rgba(0,0,0,0.1))',
              'drop-shadow(0 8px 12px rgba(0,0,0,0.25))',
              'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              'drop-shadow(0 18px 25px rgba(0,0,0,0.1))',
              'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
              'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
              'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            ]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/landing/butter fly.svg"
            alt="Butterfly"
            width={100}
            height={100}
            className="loading-butterfly-img"
          />
        </motion.div>

        {/* Cinematic Flying Butterfly 2 (Top Area) */}
        <motion.div
          style={{
            position: 'fixed',
            top: '20%',
            left: '30%',
            width: 'clamp(40px, 4vw, 60px)',
            zIndex: 31,
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, 300, 100, -200, 0],
            y: [0, -50, 100, 50, 0],
            rotate: [0, -30, 20, -10, 0],
            rotateY: [0, 180, 180, 0, 0],
            scale: [0.8, 1.1, 0.9, 1.2, 0.8],
            zIndex: [31, 26, 31, 26, 31],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Image
            src="/landing/butter fly.svg"
            alt="Butterfly 2"
            width={80}
            height={80}
            className="loading-butterfly-img"
            style={{ opacity: 0.8 }}
          />
        </motion.div>

        {/* Cinematic Flying Butterfly 3 (Right Glide) */}
        <motion.div
          style={{
            position: 'fixed',
            bottom: '25%',
            right: '15%',
            width: 'clamp(45px, 4.5vw, 70px)',
            zIndex: 29,
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, -400, -700, -400, 0],
            y: [0, -200, -50, -250, 0],
            rotate: [0, 30, -20, 10, 0], // Fixed: Removed 180 degree flip
            rotateY: [180, 0, 0, 180, 180],
            scale: [1, 1.3, 0.8, 1.5, 1],
            zIndex: [29, 32, 27, 32, 29],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        >

          <Image
            src="/landing/butter fly.svg"
            alt="Butterfly 3"
            width={90}
            height={90}
            className="loading-butterfly-img"
          />
        </motion.div>


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
                    transform: 'translate(35px, -13px) scale(0.81)', 
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.76)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.81)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(35px, -13px) scale(0.81)'}
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
                    marginBottom: '45px', // Pushed up by 30px (from 15px)
                    zIndex: 10
                  }}>
                    <div style={{ fontSize: 'clamp(1.2rem, 1.8vw, 2rem)', fontWeight: 800, marginBottom: '23px' }}>Credits</div>
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

