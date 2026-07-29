import {ChatGoogle} from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";

export const geminiModel = new ChatGoogle({
    model:"gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
});

export const mistralModel = new ChatMistralAI({
    model:"mistral-large-latest",
    apiKey: config.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
    model: 'command-r-08-2024',
    apiKey: config.COHERE_API_KEY,
});

export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-specdec",
    apiKey: config.GROQ_API_KEY,
});

export const deepseekModel = new ChatOpenAI({
    model: "deepseek/deepseek-chat",
    apiKey: config.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const claudeModel = new ChatOpenAI({
    model: "anthropic/claude-3-haiku",
    apiKey: config.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const gptModel = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.GITHUB_API_KEY,
    configuration: {
        baseURL: "https://models.inference.ai.azure.com",
    },
});



