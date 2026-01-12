"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreVertical,
  EraserIcon,
  Bell,
  Moon,
  Sun,
  User,
  MessageSquare,
  History,
  List,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { CHAT_HEADER } from "@/configuration/ui";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * AI Logo
 */
export const AILogo = () => (
  <motion.span
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="text-3xl"
  >
    🤖
  </motion.span>
);

/**
 * ChatHeader
 */
export default function ChatHeader({
  clearMessages,
}: {
  clearMessages: () => void;
}) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-0 z-10 w-full border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <AILogo />
          <div>
            <p className="text-lg font-semibold leading-tight">
              {CHAT_HEADER}
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              More Orders.. More Profits — Your own growth AI.
            </p>
          </div>
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-1">

          {/* Theme toggle icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Three dots menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-56">

              {/* New Chat */}
              <DropdownMenuItem
                onClick={clearMessages}
                className="flex items-center gap-2 font-medium"
              >
                <Sparkles className="h-4 w-4" />
                New Chat
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat History
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Prompt History
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Prompts List
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                Theme
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
