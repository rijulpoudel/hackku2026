import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey || apiKey === 'your_elevenlabs_key') {
    return NextResponse.json({ error: 'ElevenLabs not configured' }, { status: 503 })
  }

  try {
    const formData = await req.formData()
    const name = (formData.get('name') as string) || 'Player Voice'
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // ElevenLabs Instant Voice Cloning — POST /v1/voices/add
    const elForm = new FormData()
    elForm.append('name', name)
    elForm.append('description', 'Cloned from LAUNCH game player recording')
    elForm.append('files', file, file.name)

    const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
      body: elForm,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('ElevenLabs voice cloning error:', err)
      return NextResponse.json(
        { error: 'Voice cloning failed', detail: err },
        { status: 502 },
      )
    }

    const data = await res.json()
    // ElevenLabs returns { voice_id: string, name: string }
    return NextResponse.json({ voice_id: data.voice_id })
  } catch (err) {
    console.error('Clone-voice route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
