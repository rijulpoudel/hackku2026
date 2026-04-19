'use client'
import { useEffect } from 'react'
import { playSfx } from '@/lib/audio'

export function GlobalClickSound() {
  useEffect(() => {
    function handleClick() {
      playSfx('click')
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
