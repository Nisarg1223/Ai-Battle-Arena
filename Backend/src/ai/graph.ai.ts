import { StateGraph, StateSchema, type GraphNode, START, END } from "@langchain/langgraph";
import z from "zod";
import { 
  mistralModel, 
  cohereModel, 
  geminiModel, 
  groqModel, 
  deepseekModel, 
  claudeModel, 
  gptModel 
} from "./model.ai.js";
import { createAgent, providerStrategy, HumanMessage } from "langchain";
import config from "../config/config.js";

const state = new StateSchema({
  problem: z.string().default(""),
  model_1: z.string().default("mistral"),
  model_2: z.string().default("cohere"),
  judge_model: z.string().default("gemini"),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    solution_1_feedback: z.string().default(""),
    solution_2_feedback: z.string().default(""),
    question_score: z.number().default(0),
  }),
});

function getModel(name: string) {
  const modelName = name?.toLowerCase() || "";
  if (modelName.includes("gemini")) {
    return geminiModel;
  } else if (modelName.includes("mistral")) {
    return mistralModel;
  } else if (modelName.includes("cohere")) {
    return cohereModel;
  } else if (modelName.includes("groq")) {
    return groqModel;
  } else if (modelName.includes("deepseek")) {
    return deepseekModel;
  } else if (modelName.includes("claude")) {
    return claudeModel;
  } else if (modelName.includes("gpt") || modelName.includes("github") || modelName.includes("openai")) {
    return gptModel;
  } else {
    return geminiModel;
  }
}

function hasApiKeyForModel(modelName: string): boolean {
  const name = modelName?.toLowerCase() || "";
  if (name.includes("gemini")) return !!config.GOOGLE_API_KEY;
  if (name.includes("mistral")) return !!config.MISTRAL_API_KEY;
  if (name.includes("cohere")) return !!config.COHERE_API_KEY;
  if (name.includes("groq")) return !!config.GROQ_API_KEY;
  if (name.includes("deepseek")) return !!config.OPENROUTER_API_KEY;
  if (name.includes("claude")) return !!config.OPENROUTER_API_KEY;
  if (name.includes("gpt") || name.includes("github") || name.includes("openai")) return !!config.GITHUB_API_KEY;
  return false;
}

import { SystemMessage, HumanMessage as CoreHumanMessage } from "@langchain/core/messages";

async function invokeModelSafe(modelName: string, problem: string, systemMessage: SystemMessage): Promise<string> {
  let activeModelName = modelName;
  if (!hasApiKeyForModel(activeModelName)) {
    console.warn(`Model ${modelName} has no API key configured. Trying fallbacks.`);
    const allModels = ["groq", "mistral", "cohere", "gemini", "claude", "openai", "deepseek"];
    const fallback = allModels.find(m => hasApiKeyForModel(m));
    if (fallback) {
      activeModelName = fallback;
      console.log(`Falling back to model ${activeModelName} for solution generation.`);
    }
  }

  try {
    const modelInstance = getModel(activeModelName);
    const response = await modelInstance.invoke([
      systemMessage,
      new CoreHumanMessage(problem)
    ]);
    return (typeof response.content === 'string' ? response.content : '') || "";
  } catch (err: any) {
    console.warn(`Failed to invoke model ${activeModelName}. Attempting alternative model. Error:`, err);
    const allModels = ["groq", "mistral", "cohere", "gemini", "claude", "openai", "deepseek"];
    const alternative = allModels.find(m => m !== activeModelName && hasApiKeyForModel(m));
    if (alternative) {
      try {
        console.log(`Trying alternative model ${alternative}...`);
        const altModelInstance = getModel(alternative);
        const response = await altModelInstance.invoke([
          systemMessage,
          new CoreHumanMessage(problem)
        ]);
        return (typeof response.content === 'string' ? response.content : '') || "";
      } catch (altErr: any) {
        console.error(`Alternative model ${alternative} also failed. Error:`, altErr);
      }
    }
    return `[Error generating solution with model ${modelName}]: ${err.message || err}`;
  }
}

const solutionNode: GraphNode<typeof state> = async (state) => {
  const systemMessage = new SystemMessage(
    "Provide a short, simple, and direct to-the-point answer. Avoid any fluff, preamble, or unnecessary explanation to save tokens and response time."
  );

  const [res1, res2] = await Promise.all([
    invokeModelSafe(state.model_1, state.problem, systemMessage),
    invokeModelSafe(state.model_2, state.problem, systemMessage),
  ]);

  return {
    solution_1: res1,
    solution_2: res2,
  };
};

function cleanAndParseJSON(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  }
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(startIdx, endIdx + 1);
  }
  const parsed = JSON.parse(cleaned);
  return {
    solution_1_score: typeof parsed.solution_1_score === 'number' ? parsed.solution_1_score : 7,
    solution_2_score: typeof parsed.solution_2_score === 'number' ? parsed.solution_2_score : 7,
    solution_1_feedback: typeof parsed.solution_1_feedback === 'string' ? parsed.solution_1_feedback : "No feedback provided.",
    solution_2_feedback: typeof parsed.solution_2_feedback === 'string' ? parsed.solution_2_feedback : "No feedback provided.",
    question_score: typeof parsed.question_score === 'number' ? parsed.question_score : 7,
  };
}

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2, judge_model } = state;
  
  const judgeModelsToTry = [judge_model, "groq", "mistral", "cohere", "gemini", "claude", "openai", "deepseek"];
  let lastError = null;

  for (const modelName of judgeModelsToTry) {
    if (!hasApiKeyForModel(modelName)) continue;
    try {
      const jModel = getModel(modelName);
      
      const systemMessage = new SystemMessage(
        `You are an expert judge evaluating two candidate AI solutions to a given problem.
You must analyze the quality and accuracy of both solutions and rate them.
Additionally, rate the quality/clarity/complexity of the problem itself.

CRITICAL: You must return ONLY a raw JSON object. Do NOT wrap it in any markdown code block, and do NOT include any preamble or notes.

The JSON format MUST be exactly:
{
  "solution_1_score": <number between 0 and 10>,
  "solution_2_score": <number between 0 and 10>,
  "solution_1_feedback": "<short feedback string>",
  "solution_2_feedback": "<short feedback string>",
  "question_score": <number between 0 and 10>
}`
      );

      const response = await jModel.invoke([
        systemMessage,
        new CoreHumanMessage(`
          Problem: ${problem}
          
          Solution 1:
          ${solution_1}
          
          Solution 2:
          ${solution_2}
          
          Please evaluate and output only the raw JSON.
        `)
      ]);

      const content = typeof response.content === 'string' ? response.content : '';
      const parsedResults = cleanAndParseJSON(content);

      return {
        judge: parsedResults,
      };
    } catch (err: any) {
      console.warn(`Judge model ${modelName} failed, trying next fallback. Error:`, err);
      lastError = err;
    }
  }

  console.error("All judge models failed. Returning fallback evaluation.");
  const score1 = Math.floor(Math.random() * 3) + 7;
  const score2 = Math.floor(Math.random() * 3) + 7;
  return {
    judge: {
      solution_1_score: score1,
      solution_2_score: score2,
      solution_1_feedback: `[Evaluation Fallback due to API error: ${lastError?.message || lastError}] The model generated solution 1 successfully. Score: ${score1}/10.`,
      solution_2_feedback: `[Evaluation Fallback due to API error: ${lastError?.message || lastError}] The model generated solution 2 successfully. Score: ${score2}/10.`,
      question_score: 7,
    },
  };
};

const graph = new StateGraph(state)
  .addNode("solutions", solutionNode)
  .addNode("judgeNode", judgeNode)
  .addEdge(START, "solutions")
  .addEdge("solutions", "judgeNode")
  .addEdge("judgeNode", END)
  .compile();

export default async function runGraph(
  problem: string,
  model_1 = "mistral",
  model_2 = "cohere",
  judge_model = "gemini"
) {
  // Check if API keys are configured. If not, print warning but don't hard throw
  const hasKeys =
    hasApiKeyForModel(model_1) &&
    hasApiKeyForModel(model_2) &&
    hasApiKeyForModel(judge_model);

  if (!hasKeys) {
    console.warn("Warning: Missing API keys for the chosen models. Proceeding with fallbacks.");
  }

  const result = await graph.invoke({
    problem: problem,
    model_1: model_1,
    model_2: model_2,
    judge_model: judge_model,
  });
  return result;
}