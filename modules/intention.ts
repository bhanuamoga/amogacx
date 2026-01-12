import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { Chat, Intention, intentionSchema, IntentionType } from "@/types";
import { HISTORY_CONTEXT_LENGTH } from "@/configuration/chat";
import { INTENTION_PROMPT } from "@/configuration/prompts";
import { INTENTION_MODEL } from "@/configuration/models";

/**
 * This file contains the IntentionModule class, which is responsible for
 * detecting the intention of the user based on the most recent messages.
 * It uses the OpenAI API to analyze the messages and determine
 * the intention type. A variety of intention types are supported,
 * and the app will respond accordingly based on the detected intention.
 *
 * @file modules/intention.ts
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * IntentionModule is responsible for detecting intentions
 */
export class IntentionModule {
  static async detectIntention({
    chat,
    openai,
  }: {
    chat: Chat;
    openai: OpenAI;
  }): Promise<Intention> {
    /**
     * Determine the intention of the user based on the most recent messages
     */
    const mostRecentMessages = chat.messages
      .slice(-HISTORY_CONTEXT_LENGTH)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    /**
     * Call the OpenAI API to detect the intention
     */
    const response = await openai.beta.chat.completions.parse({
      model: INTENTION_MODEL,
      messages: [
        { role: "system", content: INTENTION_PROMPT() },
        ...mostRecentMessages,
      ],
      response_format: zodResponseFormat(intentionSchema, "intention"),
    });

    /**
     * Check if the response is valid and contains a parsed intention
     */
    if (!response.choices[0].message.parsed) {
      return { type: "random" as IntentionType };
    }

    return response.choices[0].message.parsed;
  }
}
