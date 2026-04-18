'use client'
import { motion } from 'framer-motion'
import { GeneratedDecision } from '@/types/game'
import { ChoiceCard } from './ChoiceCard'
import { useState } from 'react'

interface Props {
  decision: GeneratedDecision
  onChoice: (index: number) => void
  chosenIndex: number | null
}

export function DecisionScreen({ decision, onChoice, chosenIndex }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full-bleed image with overlay */}
      <div className="absolute inset-0 z-0">
        {decision.image_url && (
          <motion.img
            src={decision.image_url}
            alt="Decision scene"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: imgLoaded ? 0.35 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/40 to-[#1a1a1a]/95" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-24 pb-8 max-w-2xl mx-auto w-full">
        {/* Financial term badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block self-start mb-4"
        >
          <span className="text-xs font-medium tracking-widest text-amber-400 uppercase border border-amber-400/30 rounded px-3 py-1">
            {decision.financial_term}
          </span>
        </motion.div>

        {/* Definition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed"
        >
          {decision.definition}
        </motion.p>

        {/* Scenario */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-light leading-snug mb-3 text-white"
        >
          {decision.scenario}
        </motion.p>

        {/* Question */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-lg font-medium text-gray-200 mb-8"
        >
          {decision.question}
        </motion.h2>

        {/* Choices */}
        <div className="flex flex-col gap-3 mt-auto">
          {decision.choices.map((choice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.1 }}
            >
              <ChoiceCard
                choice={choice}
                index={i}
                onSelect={() => chosenIndex === null && onChoice(i)}
                isChosen={chosenIndex === i}
                isDisabled={chosenIndex !== null && chosenIndex !== i}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
