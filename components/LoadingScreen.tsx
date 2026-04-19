'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let start = 0
    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 5) + 2 // Increase by 2-6% each tick
      if (start >= 100) {
        start = 100
        clearInterval(interval)
      }
      setProgress(start)
    }, 45) // Completes in roughly 1200ms
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="page-loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-slider-container">
        <div className="loading-number">LOADING {progress}%</div>

        <div className="loading-bar-track">
          <motion.div
            className="loading-bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
          <motion.div
            className="loading-butterfly-slider"
            animate={{ left: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          >
            <Image
              src="/landing/butter fly.svg"
              alt="Loading Indicator"
              width={70}
              height={70}
              className="loading-butterfly-img"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
