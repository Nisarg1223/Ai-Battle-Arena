import {ChatGoogle} from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";

export const geminiModel = new ChatGoogle({
    model:"gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
    maxRetries: 0,
});

export const mistralModel = new ChatMistralAI({
    model:"mistral-large-latest",
    apiKey: config.MISTRAL_API_KEY,
    maxRetries: 0,
});

export const cohereModel = new ChatCohere({
    model: 'command-r-08-2024',
    apiKey: config.COHERE_API_KEY,
    maxRetries: 0,
});

export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY,
    maxRetries: 0,
});

export const deepseekModel = new ChatOpenAI({
    model: "deepseek/deepseek-r1",
    apiKey: config.OPENROUTER_API_KEY,
    maxRetries: 0,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const claudeModel = new ChatOpenAI({
    model: "anthropic/claude-3-haiku",
    apiKey: config.OPENROUTER_API_KEY,
    maxRetries: 0,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const gptModel = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.GITHUB_API_KEY,
    maxRetries: 0,
    configuration: {
        baseURL: "https://models.inference.ai.azure.com",
    },
});



