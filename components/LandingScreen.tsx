'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Props {
  onStart: () => void
}

export function LandingScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

      {/* Background SVG — full screen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing/backg.svg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Constellation overlay — centered, subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <Image
          src="/landing/constellation.svg"
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Left lantern */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-0 bottom-0 z-20 pointer-events-none"
        style={{ width: 'clamp(140px, 18vw, 260px)', height: 'auto' }}
      >
        <Image
          src="/landing/lantern-left.svg"
          alt=""
          width={260}
          height={520}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Right lantern */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute right-0 bottom-0 z-20 pointer-events-none"
        style={{ width: 'clamp(140px, 18vw, 260px)', height: 'auto' }}
      >
        <Image
          src="/landing/lantern-right.svg"
          alt=""
          width={260}
          height={520}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Content — above all layers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-30 max-w-xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-block mb-6"
        >
          <span className="text-xs text-amber-400 font-medium tracking-widest uppercase border border-amber-400/30 rounded-full px-4 py-1.5 bg-black/30 backdrop-blur-sm">
            HackKU 2026 · Security Benefit Track
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
        >
          LAUNCH
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-amber-200/90 mb-4 font-light drop-shadow"
        >
          Life After Graduation
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-300/80 text-sm leading-relaxed mb-10 max-w-sm mx-auto drop-shadow"
        >
          You just graduated with $2,100 in savings and $34,000 in student loans.
          Make 12 years of financial decisions. See how they compound.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-8 mb-10 text-center"
        >
          {[
            { label: 'Starting net worth', value: '-$31,900' },
            { label: 'Years to play', value: '12' },
            { label: 'Decisions', value: '12+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-white font-semibold text-lg drop-shadow">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-amber-400 text-black font-semibold px-10 py-3.5 rounded-lg text-sm tracking-wide hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
        >
          Start Your Story
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          className="text-gray-500 text-xs mt-4"
        >
          ~15 minutes · No financial knowledge required
        </motion.p>
      </motion.div>
    </div>
  )
}
