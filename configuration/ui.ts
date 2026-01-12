import { AI_NAME, OWNER_NAME } from "@/configuration/identity";

/**
 * This file allows users to configure the UI settings for the AI.
 * It includes settings for the chat header, message placeholder,
 * footer message, clear button text, page title, and page description.
 *
 * @file configuration/ui.ts
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

export const CHAT_HEADER: string = `[CHAT HEADER]`;
export const MESSAGE_PLACEHOLDER: string = `[MESSAGE PLACEHOLDER]`;
export const FOOTER_MESSAGE: string = `[FOOTER MESSAGE]`; // not applicable
export const CLEAR_BUTTON_TEXT: string = `Clear Conversation`;
export const PAGE_TITLE: string = `[PAGE TITLE]`; // this is the tab title on the browser
export const PAGE_DESCRIPTION: string = `Chat with ${AI_NAME}, ${OWNER_NAME}'s AI assistant.`;

export const EMPTY_CITATION_MESSAGE: string = "Unspecified source";
