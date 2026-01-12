import OpenAI from "openai";
import {
  CoreMessage,
  StreamedLoading,
  StreamedMessage,
  IndicatorIconType,
  StreamedDone,
  AIProviders,
  ProviderName,
  Citation,
  StreamedError,
} from "@/types";
import Anthropic from "@anthropic-ai/sdk";

/**
 * This file contains functions for handling streaming responses
 * from various AI providers. It includes functions for processing
 * OpenAI and Anthropic streams, as well as functions for
 * queuing loading indicators, errors, and final messages.
 * It also includes types and interfaces for the parameters used
 * in these functions.
 *
 * @file actions/streaming.ts
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * This interface defines the parameters for the queueAssistantResponse function.
 */
export interface QueueAssistantResponseParams {
  controller: ReadableStreamDefaultController;
  providers: AIProviders;
  providerName: ProviderName;
  messages: CoreMessage[];
  model_name: string;
  systemPrompt: string;
  citations: Citation[];
  error_message: string;
  temperature: number;
}

/**
 * This function handles streaming responses from OpenAI and Fireworks.
 * It takes a controller, providers, provider name, messages,
 * model name, system prompt, citations, and temperature as parameters.
 * It streams the response from the AI provider and enqueues
 * the streamed messages to the controller.
 *
 * @param controller - A ReadableStreamDefaultController to control the stream
 * @param providers - An object containing AI providers (OpenAI, Anthropic, Fireworks)
 * @param providerName - The name of the provider to use (OpenAI, Anthropic, Fireworks)
 * @param messages - An array of messages to send to the AI provider
 * @param model_name - The name of the model to use for the AI provider
 * @param systemPrompt - The system prompt to use for the AI provider
 * @param citations - An array of citations to include in the response
 * @param temperature - The temperature to use for the AI provider
 */
export async function handleOpenAIStream({
  controller,
  providers,
  providerName,
  messages,
  model_name,
  systemPrompt,
  citations,
  temperature,
}: QueueAssistantResponseParams) {
  let client: OpenAI = providers.openai;
  if (providerName === "fireworks") {
    client = providers.fireworks;
    console.log("Streaming Fireworks response...", {
      temperature,
      model_name,
      systemPrompt,
      messages,
    });
  } else {
    console.log("Streaming OpenAI response...", {
      temperature,
      model_name,
      systemPrompt,
      messages,
    });
  }
  const startTime = Date.now();
  const streamedResponse = await client.chat.completions.create({
    model: model_name,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true,
    temperature,
  });
  if (!streamedResponse) {
    throw new Error("No stream response");
  }
  let responseBuffer: string = "";

  for await (const chunk of streamedResponse) {
    responseBuffer += chunk.choices[0]?.delta.content ?? "";
    const streamedMessage: StreamedMessage = {
      type: "message",
      message: {
        role: "assistant",
        content: responseBuffer,
        citations,
      },
    };
    controller.enqueue(
      new TextEncoder().encode(JSON.stringify(streamedMessage) + "\n"),
    );
  }
  const endTime = Date.now();
  const streamDuration = endTime - startTime;
  console.log(`Done streaming OpenAI response in ${streamDuration / 1000}s`);
  const donePayload: StreamedDone = {
    type: "done",
    final_message: responseBuffer,
  };
  controller.enqueue(
    new TextEncoder().encode(JSON.stringify(donePayload) + "\n"),
  );
  controller.close();
}

/**
 * This function handles streaming responses from Anthropic.
 * It takes a controller, providers, messages, model name,
 * system prompt, citations, and temperature as parameters.
 * It streams the response from the Anthropic AI provider
 * and enqueues the streamed messages to the controller.
 *
 * @param controller - A ReadableStreamDefaultController to control the stream
 * @param providers - An object containing AI providers (OpenAI, Anthropic, Fireworks)
 * @param messages - An array of messages to send to the AI provider
 * @param model_name - The name of the model to use for the AI provider
 * @param systemPrompt - The system prompt to use for the AI provider
 * @param citations - An array of citations to include in the response
 * @param temperature - The temperature to use for the AI provider
 */
export async function handleAnthropicStream({
  controller,
  providers,
  messages,
  model_name,
  systemPrompt,
  citations,
  temperature,
}: QueueAssistantResponseParams) {
  let anthropicClient: Anthropic = providers.anthropic;
  let anthropicMessages: Anthropic.Messages.MessageParam[] = messages.map(
    (msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }),
  );
  let responseBuffer: string = "";
  console.log("Streaming Anthropic response...", {
    temperature,
    model_name,
    systemPrompt,
    messages,
  });
  await anthropicClient.messages
    .stream({
      messages: anthropicMessages,
      model: model_name,
      system: systemPrompt,
      max_tokens: 4096,
      temperature,
    })
    .on("text", (textDelta) => {
      responseBuffer += textDelta;
      const streamedMessage: StreamedMessage = {
        type: "message",
        message: {
          role: "assistant",
          content: responseBuffer,
          citations,
        },
      };
      controller.enqueue(
        new TextEncoder().encode(JSON.stringify(streamedMessage) + "\n"),
      );
    })
    .on("end", () => {
      const donePayload: StreamedDone = {
        type: "done",
        final_message: responseBuffer,
      };
      controller.enqueue(
        new TextEncoder().encode(JSON.stringify(donePayload) + "\n"),
      );
      controller.close();
    });
}

/**
 * This function queues the assistant response based on the provider name.
 * It takes a controller, providers, provider name, messages,
 * model name, system prompt, citations, and temperature as parameters.
 * It calls the appropriate function to handle the streaming response
 * based on the provider name (OpenAI or Anthropic).
 *
 * @param controller - A ReadableStreamDefaultController to control the stream
 * @param providers - An object containing AI providers (OpenAI, Anthropic, Fireworks)
 * @param providerName - The name of the provider to use (OpenAI, Anthropic, Fireworks)
 * @param messages - An array of messages to send to the AI provider
 * @param model_name - The name of the model to use for the AI provider
 * @param systemPrompt - The system prompt to use for the AI provider
 * @param citations - An array of citations to include in the response
 * @param temperature - The temperature to use for the AI provider
 */
export async function queueAssistantResponse({
  controller,
  providers,
  providerName,
  messages,
  model_name,
  systemPrompt,
  citations,
  error_message,
  temperature,
}: QueueAssistantResponseParams) {
  if (providerName === "openai" || providerName === "fireworks") {
    console.log(providerName);
    await handleOpenAIStream({
      controller,
      providers,
      providerName,
      messages,
      model_name,
      systemPrompt,
      citations,
      error_message,
      temperature,
    });
  } else if (providerName === "anthropic") {
    await handleAnthropicStream({
      controller,
      providers,
      providerName,
      messages,
      model_name,
      systemPrompt,
      citations,
      error_message,
      temperature,
    });
  }
}

/**
 * This interface defines the parameters for the queueIndicator function.
 */
export interface QueueLoadingParams {
  controller: ReadableStreamDefaultController;
  status: string;
  icon: IndicatorIconType;
}

/**
 * This function queues a loading indicator message.
 * It takes a controller, status, and icon as parameters.
 * It creates a loading payload and enqueues it to the controller.
 *
 * @param controller - A ReadableStreamDefaultController to control the stream
 * @param status - The status message to display
 * @param icon - The icon type to display
 */
export async function queueIndicator({
  controller,
  status,
  icon,
}: QueueLoadingParams) {
  const loadingPayload: StreamedLoading = {
    type: "loading",
    indicator: {
      status: status,
      icon: icon,
    },
  };
  controller.enqueue(
    new TextEncoder().encode(JSON.stringify(loadingPayload) + "\n"),
  );
}

/**
 * This interface defines the parameters for the queueError function.
 */
export interface QueueErrorParams {
  controller: ReadableStreamDefaultController;
  error_message: string;
}

/**
 * This function queues an error message.
 * It takes a controller and error message as parameters.
 * It creates an error payload and enqueues it to the controller.
 *
 * @param controller - A ReadableStreamDefaultController to control the stream
 * @param error_message - The error message to display
 */
export async function queueError({
  controller,
  error_message,
}: QueueErrorParams) {
  const errorPayload: StreamedError = {
    type: "error",
    indicator: {
      status: error_message,
      icon: "error",
    },
  };
  controller.enqueue(
    new TextEncoder().encode(JSON.stringify(errorPayload) + "\n"),
  );
  controller.close();
}
