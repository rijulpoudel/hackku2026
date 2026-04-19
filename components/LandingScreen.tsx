'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  onStart: () => void
  onContinue: () => void
  onLeaderboard: () => void
  onCredits: () => void
  hasSavedGame: boolean
}

export function LandingScreen({ onStart, onContinue, onLeaderboard, onCredits, hasSavedGame }: Props) {
  return (
    <main className="landing-main">
      <div className="landing-bg-layer" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="landing-content"
      >
        <div className="landing-book-wrapper">
          <div className="landing-funtext">
            <Image src="/landing/funtextbg.svg" alt="Fun Text" width={600} height={120} className="landing-responsive-img" />
          </div>
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
            {/* Play — start new game */}
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

            {/* Continue — resume saved game */}
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

            {/* Scene — show leaderboard */}
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

            {/* Load Scenes — also show leaderboard */}
            <motion.button
              type="button"
              aria-label="Load Scenes"
              onClick={onLeaderboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-disabled"
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
