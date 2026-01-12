import { HYDE_MODEL, HYDE_TEMPERATURE } from "@/configuration/models";
import { QUESTION_RESPONSE_TOP_K } from "@/configuration/pinecone";
import {
  HYDE_PROMPT,
  RESPOND_TO_QUESTION_SYSTEM_PROMPT,
} from "@/configuration/prompts";
import {
  Chat,
  Chunk,
  chunkSchema,
  Citation,
  citationSchema,
  CoreMessage,
  DisplayMessage,
  Source,
} from "@/types";
import OpenAI from "openai";

/**
 * This file contains utility functions for chat operations.
 * It includes functions to strip citations from messages,
 * convert messages to core format, add system messages,
 * embed hypothetical data, generate hypothetical data,
 * search for chunks using embeddings, aggregate sources,
 * sort chunks, build context from chunks,
 * get context from sources, and build prompts.
 *
 * @file utilities/chat.ts
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Strips citations from messages - Used to display messages without citations
 * in case the user doesn't want to see them
 *
 * @param messages - Array of messages to strip citations from
 */
export function stripMessagesOfCitations(
  messages: DisplayMessage[],
): DisplayMessage[] {
  return messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/\[\d+\]/g, ""),
  }));
}

/**
 * Converts DisplayMessage to CoreMessage - Used to convert messages
 * to a format that can be sent to the OpenAI API
 *
 * @param messages - Array of messages to convert
 */
export function convertToCoreMessages(
  messages: DisplayMessage[],
): CoreMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Adds a system message to the beginning of the messages array
 *
 * @param messages - Array of messages to add system message to
 * @param systemMessage - System message to add
 */
export function addSystemMessage(
  messages: CoreMessage[],
  systemMessage: string,
): CoreMessage[] {
  return [{ role: "system", content: systemMessage }, ...messages];
}

/**
 * Embeds hypothetical data using OpenAI's embedding API - used to
 * generate embeddings for the hypothetical data
 *
 * @param value - Value to embed
 * @param openai - OpenAI object containing the API key
 */
export async function embedHypotheticalData(
  value: string,
  openai: OpenAI,
): Promise<{ embedding: number[] }> {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: value,
    });

    return { embedding: embedding.data[0].embedding };
  } catch (error) {
    throw new Error("Error embedding hypothetical data");
  }
}

/**
 * Generates hypothetical data using OpenAI's chat API - used to
 * generate hypothetical data for the user
 *
 * @param chat - Chat object containing the messages
 * @param openai - OpenAI object containing the API key
 */
export async function generateHypotheticalData(
  chat: Chat,
  openai: OpenAI,
): Promise<string> {
  try {
    console.log(
      "Generating hypothetical data...",
      HYDE_MODEL,
      HYDE_TEMPERATURE,
      HYDE_PROMPT(chat),
    );
    const response = await openai.chat.completions.create({
      model: HYDE_MODEL,
      temperature: HYDE_TEMPERATURE,
      messages: await convertToCoreMessages([
        {
          role: "system",
          content: HYDE_PROMPT(chat),
          citations: [],
        },
      ]),
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error generating hypothetical data:", error);
    throw new Error("Error generating hypothetical data");
  }
}

/**
 * Searches for chunks using the embedding generated from the hypothetical data
 * using Pinecone's query API - used to search for chunks in the Pinecone index
 *
 * @param embedding - Embedding to search for
 * @param pineconeIndex - Pinecone index object containing the API key
 */
export async function searchForChunksUsingEmbedding(
  embedding: number[],
  pineconeIndex: any,
): Promise<Chunk[]> {
  try {
    const { matches } = await pineconeIndex.query({
      vector: embedding,
      topK: QUESTION_RESPONSE_TOP_K,
      includeMetadata: true,
    });

    return matches.map((match: any) =>
      chunkSchema.parse({
        text: match.metadata?.text ?? "",
        pre_context: match.metadata?.pre_context ?? "",
        post_context: match.metadata?.post_context ?? "",
        source_url: match.metadata?.source_url ?? "",
        source_description: match.metadata?.source_description ?? "",
        order: match.metadata?.order ?? 0,
      }),
    );
  } catch (error) {
    throw new Error(
      "Error searching for chunks using embedding. Double check Pinecone index name and API key.",
    );
  }
}

/**
 * Aggregates sources from chunks - used to group chunks by source
 *
 * @param chunks - Array of chunks to aggregate
 */
export function aggregateSources(chunks: Chunk[]): Source[] {
  const sourceMap = new Map<string, Source>();

  chunks.forEach((chunk) => {
    if (!sourceMap.has(chunk.source_url)) {
      sourceMap.set(chunk.source_url, {
        chunks: [],
        source_url: chunk.source_url,
        source_description: chunk.source_description,
      });
    }
    sourceMap.get(chunk.source_url)!.chunks.push(chunk);
  });

  return Array.from(sourceMap.values());
}

/**
 * Sorts chunks in source by order - used to sort chunks in a source
 *
 * @param source - Source to sort chunks in
 */
export function sortChunksInSourceByOrder(source: Source): Source {
  source.chunks.sort((a, b) => a.order - b.order);
  return source;
}

/**
 * Gets sources from chunks - used to get sources from chunks
 *
 * @param chunks - Array of chunks to get sources from
 */
export function getSourcesFromChunks(chunks: Chunk[]): Source[] {
  const sources = aggregateSources(chunks);
  return sources.map((source) => sortChunksInSourceByOrder(source));
}

/**
 * Builds context from ordered chunks - used to build context from chunks
 *
 * @param chunks - Array of chunks to build context from
 * @param citationNumber - Citation number to use in the context
 */
export function buildContextFromOrderedChunks(
  chunks: Chunk[],
  citationNumber: number,
): string {
  let context = "";
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    context += chunk.pre_context;
    context += " " + chunk.text + ` [${citationNumber}] `;
    if (
      i === chunks.length - 1 ||
      chunk.post_context !== chunks[i + 1].pre_context
    ) {
      context += chunk.post_context;
    }
    if (i < chunks.length - 1) {
      context += "\n\n";
    }
  }
  return context.trim();
}

/**
 * Gets context from source - used to get context from a source
 *
 * @param source - Source to get context from
 * @param citationNumber - Citation number to use in the context
 */
export function getContextFromSource(
  source: Source,
  citationNumber: number,
): string {
  return `
    <excerpt>
    Source Description: ${source.source_description}
    Source Citation: [${citationNumber}]
    Excerpt from Source [${citationNumber}]:
    ${buildContextFromOrderedChunks(source.chunks, citationNumber)}
    </excerpt>
  `;
}

/**
 * Gets context from sources - used to get context from sources
 *
 * @param sources - Array of sources to get context from
 */
export function getContextFromSources(sources: Source[]): string {
  return sources
    .map((source, index) => getContextFromSource(source, index + 1))
    .join("\n\n\n");
}

/**
 * Builds prompt from context - used to build prompt from context
 *
 * @param context - Context to build prompt from
 */
export function buildPromptFromContext(context: string): string {
  return RESPOND_TO_QUESTION_SYSTEM_PROMPT(context);
}

/**
 * Gets citations from chunks - used to get citations from chunks
 *
 * @param chunks - Array of chunks to get citations from
 */
export function getCitationsFromChunks(chunks: Chunk[]): Citation[] {
  return chunks.map((chunk) =>
    citationSchema.parse({
      source_url: chunk.source_url,
      source_description: chunk.source_description,
    }),
  );
}
