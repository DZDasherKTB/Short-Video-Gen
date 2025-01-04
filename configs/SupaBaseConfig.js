import { createClient } from "@supabase/supabase-js";

// Configuration
const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  bucketName: "ai-short-video-generator", // Add your bucket name here
};

// Initialize Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
