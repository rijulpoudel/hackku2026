'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SCRIPT = `"My name is [your name] and this is my story. I graduated last spring with thirty-four thousand dollars in student loans and exactly two thousand one hundred dollars in savings. Every financial decision I make from here compounds — some in my favor, some against me. The choices are never obvious. The best option rarely feels like the best option in the moment. Over the next twelve years I'll learn what money actually is, how it moves, and how to make it work for me instead of against me. This is life after graduation."`

interface Props {
  characterName: string
  onCloned: (voiceId: string) => void
  onSkip: () => void
}

type RecorderState = 'idle' | 'recording' | 'processing' | 'done' | 'error'

export function VoiceRecorder({ characterName, onCloned, onSkip }: Props) {
  const [state, setState] = useState<RecorderState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      stopTimer()
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start(250)
      setState('recording')
      setSeconds(0)

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setErrorMsg('Microphone access denied. Please allow mic access in your browser.')
      setState('error')
    }
  }

  async function stopAndClone() {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    stopTimer()
    streamRef.current?.getTracks().forEach((t) => t.stop())

    // Wait for the recorder to finish flushing its last chunk
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    setState('processing')

    const mimeType = recorder.mimeType || 'audio/webm'
    const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm'
    const blob = new Blob(chunksRef.current, { type: mimeType })

    console.log('[VoiceRecorder] blob:', blob.size, 'bytes,', mimeType, `(${ext})`)

    if (blob.size < 5000) {
      setErrorMsg('Recording was too short or empty — please try again and speak for at least 15 seconds.')
      setState('error')
      return
    }

    const form = new FormData()
    form.append('name', `${characterName.replace(/\s+/g, '_')}_${Date.now()}`)
    form.append('file', blob, `voice_sample.${ext}`)

    try {
      const res = await fetch('/api/clone-voice', { method: 'POST', body: form })
      const data = await res.json()

      console.log('[VoiceRecorder] API response:', res.status, data)

      if (!res.ok || !data.voice_id) {
        throw new Error(data.error || 'Voice cloning failed — check server logs')
      }

      sessionStorage.setItem('launch_custom_voice_id', data.voice_id)
      setState('done')
      setTimeout(() => onCloned(data.voice_id), 900)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Voice cloning failed. Try again or skip.'
      console.error('[VoiceRecorder] clone error:', msg)
      setErrorMsg(msg)
      setState('error')
    }
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '1.25rem',
        padding: '1.6rem 1.8rem',
        maxWidth: 340,
        width: '100%',
        color: 'white',
        fontFamily: `'HYWenHei', system-ui, sans-serif`,
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
        🎙 Narrate With Your Voice
      </h3>
      <p style={{ fontSize: '0.7rem', opacity: 0.65, lineHeight: 1.55, marginBottom: '1.1rem' }}>
        Record 30–60 seconds of yourself speaking naturally. ElevenLabs will clone your voice to narrate your entire story.
      </p>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
          >
            <p style={{ fontSize: '0.68rem', opacity: 0.6, margin: 0 }}>
              Read this script aloud when recording:
            </p>

            {/* Script box */}
            <div style={{
              position: 'relative',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0.6rem',
              padding: '0.75rem 0.85rem',
            }}>
              <p style={{
                fontSize: '0.68rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.85)',
                margin: 0,
                fontStyle: 'italic',
              }}>
                {SCRIPT}
              </p>
              <CopyButton text={SCRIPT} />
            </div>

            <p style={{ fontSize: '0.62rem', opacity: 0.45, margin: 0 }}>
              Replace [your name] with your actual name. Speak naturally — don't slow down.
            </p>

            <div style={{ display: 'flex', gap: '0.55rem' }}>
              <button onClick={startRecording} style={btn('#4f7fff')}>
                ● Start Recording
              </button>
              <button onClick={onSkip} style={btn('transparent', '1px solid rgba(255,255,255,0.18)')}>
                Skip
              </button>
            </div>
          </motion.div>
        )}

        {state === 'recording' && (
          <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <motion.div
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}
              />
              <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(seconds)}
              </span>
            </div>

            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${Math.min((seconds / 60) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
                style={{ height: '100%', background: seconds >= 30 ? '#22c55e' : '#4f7fff', borderRadius: 999 }}
              />
            </div>

            <p style={{ fontSize: '0.68rem', opacity: 0.6 }}>
              {seconds < 15
                ? `Keep talking — ${15 - seconds}s minimum remaining`
                : seconds < 30
                ? `Good — ${30 - seconds}s more for best quality`
                : "Excellent! Stop whenever you're ready."}
            </p>

            <button
              onClick={stopAndClone}
              disabled={seconds < 15}
              style={btn(seconds >= 15 ? '#22c55e' : '#374151')}
            >
              {seconds < 15 ? `Recording… (${15 - seconds}s)` : '■ Stop & Clone My Voice'}
            </button>
          </motion.div>
        )}

        {state === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '0.4rem 0' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 34,
                height: 34,
                border: '3px solid rgba(255,255,255,0.15)',
                borderTopColor: '#4f7fff',
                borderRadius: '50%',
                margin: '0 auto 0.85rem',
              }}
            />
            <p style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 600 }}>Cloning your voice…</p>
            <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.3rem' }}>Usually 5–20 seconds</p>
          </motion.div>
        )}

        {state === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>✅</div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>Voice cloned!</p>
            <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.3rem' }}>Your story will now be narrated in your voice.</p>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
          >
            <p style={{ fontSize: '0.75rem', color: '#f87171', lineHeight: 1.4 }}>{errorMsg}</p>
            <div style={{ display: 'flex', gap: '0.55rem' }}>
              <button onClick={() => { setState('idle'); setErrorMsg('') }} style={btn('#4f7fff')}>
                Try Again
              </button>
              <button onClick={onSkip} style={btn('transparent', '1px solid rgba(255,255,255,0.18)')}>
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copy}
      title="Copy script"
      style={{
        position: 'absolute',
        top: '0.4rem',
        right: '0.4rem',
        background: copied ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '0.35rem',
        color: copied ? '#86efac' : 'rgba(255,255,255,0.55)',
        fontSize: '0.6rem',
        padding: '0.2rem 0.45rem',
        cursor: 'pointer',
        fontFamily: `'HYWenHei', system-ui, sans-serif`,
        transition: 'all 0.2s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function btn(bg: string, border?: string): React.CSSProperties {
  return {
    background: bg,
    border: border ?? 'none',
    borderRadius: '0.55rem',
    color: 'white',
    padding: '0.55rem 1rem',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: bg === '#374151' ? 'not-allowed' : 'pointer',
    fontFamily: `'HYWenHei', system-ui, sans-serif`,
    transition: 'opacity 0.15s',
    flexShrink: 0,
  }
}
