import Replicate from "replicate";
import { NextResponse } from "next/server";
import { supabase } from "@/configs/SupaBaseConfig"; // Ensure 'supabase' is properly configured

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN, // Ensure your token is in .env
    });

    const input = {
      prompt: prompt,
      width: 1024,
      height: 768,
      num_outputs: 1,
    };

    // Call Replicate API to generate the image
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0]; // The first element in the array is the image URL

      // Fetch the image from the URL
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Convert the blob directly into a buffer without the intermediate Base64 conversion
      const imageBuffer = await blobToBuffer(imageBlob);

      const filePath = Date.now() + ".png";

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("ai-short-video-generator")
        .upload(filePath, imageBuffer, {
          contentType: "image/png", // Ensure content type is set
          upsert: true, // To overwrite the file if it already exists
        });

      // Get the public URL of the uploaded file
      const { data: urlData } = await supabase.storage
        .from("ai-short-video-generator")
        .getPublicUrl(filePath);
        console.log("Public URL:", urlData.publicUrl);
      // Fix the URL if necessary
      return NextResponse.json({
        result: urlData.publicUrl, // Public URL of the uploaded image
      });
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Error in generating image:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to convert a blob to a buffer
async function blobToBuffer(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
