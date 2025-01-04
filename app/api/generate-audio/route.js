import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { supabase } from "@/configs/SupaBaseConfig"; // Now you can use 'supabase' for interactions

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();

  // Request setup for TTS
  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  // Perform text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  const filePath = `${id}.mp3`;

  // Ensure audio content is a Buffer (binary format)
  const audioBuffer = response.audioContent;

  if (!audioBuffer) {
    console.error("No audio content received");
    return NextResponse.json(
      { Result: "Error", message: "No audio content received" },
      { status: 400 }
    );
  }

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from("ai-short-video-generator")
    .upload(filePath, audioBuffer,{
      contentType:'audio/mpeg'
    });

  const { data: urlData } = await supabase.storage
    .from("ai-short-video-generator")
    .getPublicUrl(filePath);

  return NextResponse.json({ Result: "Success", downloadUrl: urlData.publicUrl });
  
}
