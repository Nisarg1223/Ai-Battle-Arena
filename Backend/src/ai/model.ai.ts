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
    model:"mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
    model:'command-a-03-2025',
    apiKey: config.COHERE_API_KEY,
});

export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY,
});

export const deepseekModel = new ChatOpenAI({
    modelName: "deepseek/deepseek-chat",
    apiKey: config.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const claudeModel = new ChatOpenAI({
    modelName: "anthropic/claude-3-haiku",
    apiKey: config.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const gptModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    apiKey: config.GITHUB_API_KEY,
    configuration: {
        baseURL: "https://models.inference.ai.azure.com",
    },
});


