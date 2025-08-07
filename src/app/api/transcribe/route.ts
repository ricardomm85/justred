import { SpeechClient } from '@google-cloud/speech';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { audioData } = await request.json();

  try {
    const client = new SpeechClient({
      keyFilename: 'google-credentials.json',
    });

    const config = {
      encoding: 'WEBM_OPUS',
      languageCode: 'es-ES',
    };
    const audio = {
      content: audioData,
    };
    const requestPayload = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(requestPayload);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}