import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json(); // Assuming you get the URL from the request body

    const client = new AssemblyAI({
      apiKey: process.env.CAPTION_API,
    });

    const config = {
      audio_url: audioFileUrl,
    };

    // Run the transcription asynchronously
    const transcript = await client.transcripts.transcribe(config);

    // Wait for the transcript to be completed before responding
    return NextResponse.json({ result: transcript.words });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }); // Return the error message
  }
}
