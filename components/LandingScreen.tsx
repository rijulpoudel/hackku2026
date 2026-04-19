'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  onStart: () => void
  onContinue: () => void
  onLeaderboard: () => void
  onCredits: () => void
  onLoadGame: () => void
  hasSavedGame: boolean
  hasSaveSlots: boolean
}

export function LandingScreen({ onStart, onContinue, onLeaderboard, onCredits, onLoadGame, hasSavedGame, hasSaveSlots }: Props) {
  return (
    <main className="landing-main">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="landing-content"
      >
        <div className="landing-book-wrapper">
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
          >
            <Image src="/landing/butter fly.svg" alt="Butterfly" width={150} height={150} className="landing-responsive-img" />
          </motion.div>

          <div className="landing-funtext">
            <Image src="/landing/funtextbg.svg" alt="Fun Text" width={600} height={120} className="landing-responsive-img" />
          </div>

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
          >
            <Image src="/landing/CONSETELATION.svg" alt="Constellation" width={250} height={250} className="landing-responsive-img" />
          </motion.div>

          <Image
            src="/landing/book.svg"
            alt="LAUNCH main menu book"
            width={299}
            height={157}
            priority
            className="landing-responsive-img"
          />

          <div className="landing-book-text-left">
            <h1 className="landing-book-heading">Life After Graduation</h1>
            <p className="landing-book-body">
              You just graduated with $2,100 in savings and $34,000 in student loans. Make 12 years of financial decisions. See how they compound.
            </p>
            <div className="landing-book-stats">
              <div className="stat-item">
                <span className="stat-value">-$31,900</span>
                <span className="stat-label">Starting net worth</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Years to play</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">12+</span>
                <span className="stat-label">Decisions</span>
              </div>
            </div>
          </div>

          <div className="landing-buttons-group">
            {/* Play — new game */}
            <motion.button
              type="button"
              aria-label="Play"
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-play"
            >
              <Image src="/landing/play.svg" alt="Play" width={230} height={72} className="landing-responsive-img" />
            </motion.button>

            {/* Continue — resume in-progress session */}
            <motion.button
              type="button"
              aria-label="Continue"
              onClick={onContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-disabled"
              style={{ opacity: hasSavedGame ? 1 : 0.5 }}
            >
              <Image src="/landing/continue.svg" alt="Continue" width={230} height={72} className="landing-responsive-img" />
            </motion.button>

            {/* Scene — leaderboard */}
            <motion.button
              type="button"
              aria-label="Scene"
              onClick={onLeaderboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-disabled"
            >
              <Image src="/landing/scene.svg" alt="Scene" width={230} height={72} className="landing-responsive-img" />
            </motion.button>

            {/* Load Scenes — saved games modal */}
            <motion.button
              type="button"
              aria-label="Load Scenes"
              onClick={onLoadGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-disabled"
              style={{ opacity: hasSaveSlots ? 1 : 0.5 }}
            >
              <Image src="/landing/loadscenes.svg" alt="Load Scenes" width={230} height={72} className="landing-responsive-img" />
            </motion.button>

            {/* Credits */}
            <motion.button
              type="button"
              aria-label="Credits"
              onClick={onCredits}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-disabled"
            >
              <Image src="/landing/credits.svg" alt="Credits" width={230} height={72} className="landing-responsive-img" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
