'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  onStart: () => void
}

export function LandingScreen({ onStart }: Props) {
  return (
    <main className="landing-main">
      <div className="landing-bg-layer">
        <Image
          src="/landing/backg.svg"
          alt=""
          fill
          priority
          className="landing-bg-img"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="landing-content"
      >
        <div className="landing-book-wrapper">
          <Image
            src="/landing/book.svg"
            alt="LAUNCH main menu book"
            width={860}
            height={610}
            priority
            className="landing-responsive-img"
          />

          <div className="landing-envelope">
            <Image
              src="/landing/envelope.svg"
              alt="Envelope"
              width={180}
              height={120}
              className="landing-responsive-img"
            />
          </div>

          <div className="landing-buttons-group">
            <button
              type="button"
              aria-label="Load scenes"
              className="landing-btn-disabled"
            >
              <Image
                src="/landing/loadscenes.svg"
                alt="Load Scenes"
                width={230}
                height={72}
                className="landing-responsive-img"
              />
            </button>

            <motion.button
              type="button"
              aria-label="Play"
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="landing-btn-play"
            >
              <Image
                src="/landing/play.svg"
                alt="Play"
                width={230}
                height={72}
                className="landing-responsive-img"
              />
            </motion.button>

            <button
              type="button"
              aria-label="Characters"
              className="landing-btn-disabled"
            >
              <Image
                src="/landing/characters.svg"
                alt="Characters"
                width={230}
                height={72}
                className="landing-responsive-img"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {[
        { top: '2%', left: '-3%', size: '17vw', delay: 0 },
        { top: '6%', left: '34%', size: '5vw', delay: 0.5 },
        { top: '11%', right: '18%', size: '4vw', delay: 1.2 },
        { top: '16%', left: '21%', size: '3.5vw', delay: 0.8 },
        { top: '18%', right: '4%', size: '3vw', delay: 1.6 },
      ].map((star, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.6, 1] }}
          transition={{
            duration: 4,
            delay: star.delay,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="landing-star"
          style={{ top: star.top, left: star.left, right: star.right, width: star.size }}
        >
          <Image
            src="/landing/constellation-alt.svg"
            alt=""
            width={200}
            height={200}
            className="landing-responsive-img"
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="landing-lantern-left"
      >
        <Image
          src="/landing/lantern-left.svg"
          alt=""
          width={240}
          height={500}
          className="landing-responsive-img"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="landing-lantern-right"
      >
        <Image
          src="/landing/lantern-right.svg"
          alt=""
          width={240}
          height={500}
          className="landing-responsive-img"
        />
      </motion.div>
    </main>
  )
}
