import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-short-video-generator_owner:oMzGdY4pSt3N@ep-cool-dew-a5t7l5b2.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require',
  },
});