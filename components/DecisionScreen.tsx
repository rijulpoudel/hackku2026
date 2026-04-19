'use client'
import { motion } from 'framer-motion'
import { GeneratedDecision } from '@/types/game'
import { ChoiceCard } from './ChoiceCard'

interface Props {
  decision: GeneratedDecision
  onChoice: (index: number) => void
  chosenIndex: number | null
}

export function DecisionScreen({ decision, onChoice, chosenIndex }: Props) {
  return (
    <div className="decision-screen">
      {/* Solid dark background — no AI-generated images */}
      <div className="decision-bg">
        <div className="decision-bg-overlay" />
      </div>

      <div className="decision-content">
        {/* Financial term badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="decision-term-badge"
        >
          <span className="decision-term-text">
            {decision.financial_term}
          </span>
        </motion.div>

        {/* Definition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="decision-definition"
        >
          {decision.definition}
        </motion.p>

        {/* Scenario */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="decision-scenario"
        >
          {decision.scenario}
        </motion.p>

        {/* Question */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="decision-question"
        >
          {decision.question}
        </motion.h2>

        {/* Choices */}
        <div className="decision-choices">
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
                anyChosen={chosenIndex !== null}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
