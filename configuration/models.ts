import { ProviderName } from "@/types";

/**
 * Model configuration
 *
 * All models here are OpenRouter-compatible.
 * OpenAI has been replaced at the transport layer.
 * Features like HYDE, RAG, and intention detection remain intact.
 */

// =====================================================
// Intention Detection
// (classification → small, fast OpenRouter model)
// =====================================================
export const INTENTION_MODEL = "qwen/qwen-2.5-7b-instruct";
export const INTENTION_TEMPERATURE = 0.2;

// =====================================================
// Random Response
// =====================================================
export const RANDOM_RESPONSE_PROVIDER: ProviderName = "openai";
export const RANDOM_RESPONSE_MODEL =
  "qwen/qwen-2.5-72b-instruct";
export const RANDOM_RESPONSE_TEMPERATURE = 0.7;

// =====================================================
// Hostile Response (lower temperature = calmer)
// =====================================================
export const HOSTILE_RESPONSE_PROVIDER: ProviderName = "openai";
export const HOSTILE_RESPONSE_MODEL =
  "qwen/qwen-2.5-72b-instruct";
export const HOSTILE_RESPONSE_TEMPERATURE = 0.4;

// =====================================================
// Question Answering (RAG main model)
// =====================================================
export const QUESTION_RESPONSE_PROVIDER: ProviderName = "openai";
export const QUESTION_RESPONSE_MODEL =
  "qwen/qwen-2.5-72b-instruct";
export const QUESTION_RESPONSE_TEMPERATURE = 0.7;

// =====================================================
// HYDE (query expansion for Pinecone)
// Must be a CHAT model on OpenRouter
// =====================================================
export const HYDE_MODEL =
  "qwen/qwen-2.5-7b-instruct";
export const HYDE_TEMPERATURE = 0.3;
