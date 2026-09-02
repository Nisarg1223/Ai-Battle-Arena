import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";

export const geminiModel = new ChatGoogle({
    model: "gemini-flash-lite-latest",
    apiKey: config.GOOGLE_API_KEY,
    maxRetries: 2,
});

export const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRAL_API_KEY,
    maxRetries: 2,
});

export const cohereModel = new ChatCohere({
    model: 'command-r-08-2024',
    apiKey: config.COHERE_API_KEY,
    maxRetries: 2,
});

export const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.GROQ_API_KEY,
    maxRetries: 2,
});

export const deepseekModel = new ChatOpenAI({
    model: "deepseek/deepseek-chat",
    apiKey: config.OPENROUTER_API_KEY,
    maxTokens: 1000,
    maxRetries: 2,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const claudeModel = new ChatOpenAI({
    model: "anthropic/claude-3-haiku",
    apiKey: config.OPENROUTER_API_KEY,
    maxTokens: 1000,
    maxRetries: 2,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

export const gptModel = config.OPENAI_API_KEY
    ? new ChatOpenAI({
        model: "gpt-4o-mini",
        apiKey: config.OPENAI_API_KEY,
        maxTokens: 1000,
        maxRetries: 2,
    })
    : new ChatOpenAI({
        model: "openai/gpt-4o-mini",
        apiKey: config.OPENROUTER_API_KEY || config.GITHUB_API_KEY,
        maxTokens: 1000,
        maxRetries: 2,
        configuration: {
            baseURL: config.OPENROUTER_API_KEY
                ? "https://openrouter.ai/api/v1"
                : "https://models.inference.ai.azure.com",
        },
    });
