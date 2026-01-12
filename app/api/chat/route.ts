import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { AIProviders, Chat, Intention } from "@/types";
import { IntentionModule } from "@/modules/intention";
import { ResponseModule } from "@/modules/response";
import { PINECONE_INDEX_NAME } from "@/configuration/pinecone";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Main API route for handling chat interactions
 *
 * OpenAI has been replaced with OpenRouter
 * ALL other features remain unchanged
 */

// ==========================
// Config
// ==========================
export const maxDuration = 60;

// ==========================
// Env
// ==========================
const pineconeApiKey = process.env.PINECONE_API_KEY;
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const fireworksApiKey = process.env.FIREWORKS_API_KEY;

// ==========================
// Validation
// ==========================
if (!pineconeApiKey) {
  throw new Error("PINECONE_API_KEY is not set");
}
if (!openrouterApiKey) {
  throw new Error("OPENROUTER_API_KEY is not set");
}

// ==========================
// Pinecone
// ==========================
const pineconeClient = new Pinecone({
  apiKey: pineconeApiKey,
});
const pineconeIndex = pineconeClient.Index(PINECONE_INDEX_NAME);

// ==========================
// Providers
// ==========================

// 🔁 REPLACEMENT: OpenAI → OpenRouter
const openrouterClient = new OpenAI({
  apiKey: openrouterApiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Chat App",
  },
});

// Anthropic (unchanged)
const anthropicClient = new Anthropic({
  apiKey: anthropicApiKey,
});

// Fireworks (unchanged)
const fireworksClient = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: fireworksApiKey,
});

// ==========================
// Provider registry
// ==========================
const providers: AIProviders = {
  openai: openrouterClient, // ✅ now OpenRouter
  anthropic: anthropicClient,
  fireworks: fireworksClient,
};

// ==========================
// Intention Detection
// ==========================
async function determineIntention(chat: Chat): Promise<Intention> {
  return IntentionModule.detectIntention({
    chat,
    openai: providers.openai, // ✅ uses OpenRouter now
  });
}

// ==========================
// API Route
// ==========================
export async function POST(req: Request) {
  const { chat } = await req.json();

  const intention: Intention = await determineIntention(chat);
  
  if (intention.type === "structured_question") {
  return ResponseModule.respondToStructuredQuestion(
    chat,
    providers,
    pineconeIndex
  );
}
  if (intention.type === "question") {
    return ResponseModule.respondToQuestion(
      chat,
      providers,
      pineconeIndex
    );
  }

  if (intention.type === "hostile_message") {
    return ResponseModule.respondToHostileMessage(
      chat,
      providers
    );
  }

  return ResponseModule.respondToRandomMessage(
    chat,
    providers
  );
}
