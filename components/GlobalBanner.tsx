'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function GlobalBanner() {
  return (
    <>
      <div className="global-banner">
        <Image 
          src="/landing/banner.svg" 
          alt="Banner" 
          width={800} 
          height={150} 
          className="global-banner-img" 
        />
        <div className="global-banner-text">Where Every Choice Grows Your Fortune.</div>
      </div>

      <motion.div
        animate={{ filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="global-lantern-right"
      >
        <Image
          src="/landing/lantern-right.svg"
          alt=""
          width={240}
          height={500}
          className="global-responsive-img"
          style={{ height: 'auto' }}
        />
      </motion.div>

      <motion.div
        animate={{ skewX: [0, -2, 0, 2, 0], scaleY: [1, 1.02, 1, 0.98, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="global-bush"
      >
        <Image src="/landing/bush.svg" alt="" width={500} height={400} className="global-responsive-img" style={{ height: 'auto' }} loading="eager" priority />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 2, 0, -2, 0], scaleY: [1, 1.03, 1, 0.97, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="global-flowero"
      >
        <Image src="/landing/flowero.svg" alt="" width={300} height={350} className="global-responsive-img" style={{ height: 'auto' }} />
      </motion.div>
      <motion.div
        animate={{ rotate: [0, -3, 0, 3, 0], scaleY: [1, 1.04, 1, 0.98, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="global-flowert"
      >
        <Image src="/landing/flowert.svg" alt="" width={300} height={350} className="global-responsive-img" style={{ height: 'auto' }} />
      </motion.div>
    </>
  )
}
