import { SpeechClient } from '@google-cloud/speech';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { audioData } = await request.json();

  try {
    const client = new SpeechClient({
      keyFilename: 'google-credentials.json',
    });

    const requestPayload = {
      audio: {
        content: audioData,
      },
      config: {
        encoding: 'WEBM_OPUS' as const,
        languageCode: 'es-ES',
      },
    };

    const result = await client.recognize(requestPayload);
    const response = result[0];

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}