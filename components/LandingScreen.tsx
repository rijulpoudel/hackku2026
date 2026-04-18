'use client'
import { motion } from 'framer-motion'

interface Props {
  onStart: () => void
}

export function LandingScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6"
        >
          <span className="text-xs text-amber-400 font-medium tracking-widest uppercase border border-amber-400/30 rounded-full px-4 py-1.5">
            HackKU 2026 · Security Benefit Track
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-7xl font-bold text-white mb-4 tracking-tight"
        >
          LAUNCH
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-xl text-gray-400 mb-4 font-light"
        >
          Life After Graduation
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto"
        >
          You just graduated with $2,100 in savings and $34,000 in student loans.
          Make 12 years of financial decisions. See how they compound.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex justify-center gap-8 mb-10 text-center"
        >
          {[
            { label: 'Starting net worth', value: '-$31,900' },
            { label: 'Years to play', value: '12' },
            { label: 'Decisions', value: '12+' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-white font-semibold text-lg">{stat.value}</p>
              <p className="text-gray-600 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-amber-400 text-black font-semibold px-10 py-3.5 rounded-lg text-sm tracking-wide hover:bg-amber-300 transition-colors"
        >
          Start Your Story
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-gray-600 text-xs mt-4"
        >
          ~15 minutes · No financial knowledge required
        </motion.p>
      </motion.div>
    </div>
  )
}
