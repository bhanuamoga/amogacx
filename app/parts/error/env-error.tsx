"use client";

/**
 * This file contains the EnvError component, which is used to display
 * environment errors in the application. The component is styled
 * using Tailwind CSS and provides a user-friendly interface
 * for error handling.
 *
 * @file app/parts/error/env-error.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * EnvError - Error component for displaying environment errors
 *
 * @param message - The error message to display
 */
export function EnvError({ message }: { message: string }) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-red-700">
      <div className="w-full max-w-2xl border-[1px] border-red-900 p-4">
        <h1 className="text-2xl font-bold text-white">Error</h1>
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
}
