import dotenv from 'dotenv';

dotenv.config();

const config = {
   GOOGLE_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
   MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
   COHERE_API_KEY: process.env.COHERE_API_KEY || '',
   GROQ_API_KEY: process.env.GROQ_API_KEY || '',
   OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
   GITHUB_API_KEY: process.env.GITHUB_API_KEY || '',
   MONGO_URI: process.env.MONGO_URI || '',
};

export default config;