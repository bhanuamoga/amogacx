"use client";

import { useState, useEffect } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  Sparkles,
  MessageSquareText,
  Search,
  PenLine,
  Wand2,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { DisplayMessage } from "@/types";
import { Formatting } from "./formatting";
import Loading from "./loading";
import { LoadingIndicator } from "@/types";
import { AI_NAME } from "@/configuration/identity";
import { Bot } from 'lucide-react';
const EMPTY_STATE_CARDS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Ask anything",
    description: "Get your growth questions answered.",
    icon: PenLine,
  },
  {
    title: "Research faster",
    description: "How can i Help you ?",
    icon: Search,
  },
  {
    title: "Analytic AI",
    description: "Ask and get instant insights and action items.",
    icon: Wand2,
  },
  {
    title: "AI Coach",
    description: "Get you custom AI coach program.",
    icon: MessageSquareText,
  },
];

/**
 * This file contains the ChatMessages component which is used to display
 * the chat messages. It includes user messages, assistant messages,
 * and a loading indicator. It also includes a copy button for the assistant's
 * messages and an empty state when there are no messages yet.
 *
 * @file components/chat/messages.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * CopyButton component that allows users to copy the message content
 * to the clipboard. It shows a check icon when the message is copied.
 *
 * @param text - The text to be copied
 */
function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* optional fallback */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy message"
      className={`p-1 rounded-full hover:bg-muted/40 focus:outline-none transition ${className}`}
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-500" />
      ) : (
        <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

/**
 * AILogo component that displays the AI logo.
 */
function AILogo() {
  return (
  <motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
  className="relative flex h-9 w-9 items-center justify-center
             overflow-hidden rounded-full
             border border-border/60
             bg-background/80
             shadow-sm"
>
  <Bot
    className="h-5 w-5 text-primary"
    strokeWidth={1.8}
  />
</motion.div>
  );
}

/**
 * EmptyMessages component that displays a message when there are no chat messages yet.
 */
function EmptyMessages() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 items-center justify-center px-3 py-10"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border bg-card/70 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_0%,_rgba(14,165,233,0.18)_0%,_rgba(14,165,233,0)_60%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold">Welcome  Grow store community, Achieve AI Use success.</p>
              <p className="text-sm text-muted-foreground">
                Share a goal, paste content, or ask for a plan. I will guide you
                from start to finish.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {EMPTY_STATE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group rounded-2xl border bg-background/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-background/90"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{card.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
         
        </div>
      </div>
    </motion.div>
  );
}

/**
 * UserMessage component that displays the user's message.
 *
 * @param message - The message object containing the content and role
 */
import { User } from "lucide-react";

function UserMessage({ message }: { message: DisplayMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex items-end justify-end gap-2 py-2"
    >
      {/* User icon (LEFT of text) */}
      <div
        className="flex h-8 w-8 items-center justify-center
                   rounded-full
                   border border-border/60
                   bg-background/80
                   shadow-sm"
      >
        <User className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* User text */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="px-1 py-1
                   text-sm sm:text-base
                   text-foreground
                   whitespace-pre-wrap"
      >
        <span className="whitespace-pre-wrap">{message.content}</span>
      </motion.div>
    </motion.div>
  );
}


/**
 * AssistantMessage component that displays the assistant's message.
 *
 * @param message - The message object containing the content and role
 */
function AssistantMessage({ message }: { message: DisplayMessage }) {
  const isShort = message.content.length < 120; // 👈 threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-1 py-2"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <AILogo />
        <span className="text-xs text-muted-foreground">Assistant</span>
      </div>

      {/* Message */}
      <div
        className={
          isShort
            ? // 🔹 SHORT MESSAGE (no ugly bubble)
              "px-3 text-sm sm:text-base leading-relaxed text-foreground"
            : // 🔸 LONG MESSAGE (soft bubble)
              "rounded-2xl bg-muted/60 px-4 py-3 text-sm sm:text-base leading-relaxed"
        }
      >
        <div
          className="
            prose prose-sm sm:prose-base
            dark:prose-invert
            max-w-none
            prose-pre:bg-background
            prose-pre:rounded-lg
            prose-pre:p-3
            prose-pre:overflow-x-auto
          "
        >
          <Formatting message={message} />
        </div>
      </div>

      {/* Action icons BELOW message (clean & modern) */}
      <div className="flex items-center gap-3 px-3 pt-3 text-muted-foreground">
        <button
          onClick={() => navigator.clipboard.writeText(message.content)}
          className="hover:text-foreground transition"
          aria-label="Copy"
        >
          <Copy className="h-4 w-4" />
        </button>

        <button className="hover:text-foreground transition" aria-label="Like">
          <ThumbsUp className="h-4 w-4" />
        </button>

        <button
          className="hover:text-foreground transition"
          aria-label="Dislike"
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}


/**
 * ChatMessages component that displays the chat messages.
 * It includes user messages, assistant messages, and a loading indicator.
 *
 * @param messages - The array of chat messages
 * @param indicatorState - The current state of the loading indicators
 */
export default function ChatMessages({
  messages,
  indicatorState,
}: {
  messages: DisplayMessage[];
  indicatorState: LoadingIndicator[];
}) {
  const showLoading =
    indicatorState.length > 0 &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 gap-4 px-2 sm:px-4"
    >
      <div className="h-[84px]" />
      {messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {m.role === "user" ? (
              <UserMessage message={m} />
            ) : (
              <AssistantMessage message={m} />
            )}
          </motion.div>
        ))
      )}
      {showLoading && (
        <div className="flex items-start gap-3 py-2">
          <div className="mt-1 w-9 flex items-end">
            <AILogo />
          </div>
          <Loading indicatorState={indicatorState} />
        </div>
      )}
      <div className="h-[160px]" />
    </motion.div>
  );
}
