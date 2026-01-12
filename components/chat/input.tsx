"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

/**
 * ChatInputProps - Props for the ChatInput component
 */
interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
}

export default function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
}: ChatInputProps) {
  /** ✅ FIX: prevent hydration mismatch */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Sync voice transcript → input
  useEffect(() => {
    if (listening) {
      handleInputChange({
        target: { value: transcript },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [transcript, listening, handleInputChange]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition || isLoading) return;

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    }
  };

  /** 🚫 IMPORTANT: stop SSR rendering */
  if (!mounted) return null;

  return (
    <div className="z-10 fixed bottom-0 left-0 right-0 flex flex-col items-center bg-gradient-to-t from-background via-background/90 to-transparent pb-5 pt-3 text-base">
      <div className="w-full max-w-4xl px-4 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              SpeechRecognition.stopListening();
              handleSubmit(e);
            }}
            className="flex w-full items-center gap-2 rounded-2xl border bg-background/80 p-2 shadow-lg backdrop-blur transition focus-within:ring-2 focus-within:ring-ring/60"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      {...field}
                      onChange={handleInputChange}
                      value={input}
                      className="border-none bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Ask a question, paste text, or request a plan..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 🎤 Voice Assistant Button */}
            <Button
              type="button"
              onClick={toggleListening}
              variant="ghost"
              disabled={!browserSupportsSpeechRecognition || isLoading}
              className={`h-10 w-10 rounded-xl p-0 transition ${
                listening ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {listening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>

            {/* ⬆️ Send Button */}
            <Button
              type="submit"
              className="h-10 w-10 rounded-xl p-0 text-primary-foreground shadow transition hover:shadow-md"
              disabled={input.trim() === "" || isLoading}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
