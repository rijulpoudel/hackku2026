import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, voiceId: customVoiceId } = await req.json();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  // Use the player's cloned voice if provided, otherwise fall back to env default
  const voiceId = customVoiceId || process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId || apiKey === "your_elevenlabs_key") {
    return NextResponse.json(
      { error: "ElevenLabs not configured" },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("ElevenLabs error:", err);
      return NextResponse.json({ error: "TTS failed" }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Narration error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
