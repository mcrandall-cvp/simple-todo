"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface TaskInputProps {
  onSubmit: (title: string) => void;
}

export default function TaskInput({ onSubmit }: TaskInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        onSubmit(trimmedValue);
        setValue("");
        // Focus maintained automatically since we didn't blur
      }
    } else if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      name="task-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Add a task..."
      aria-label="Add a task"
      className="w-full h-12 px-4 text-base border border-gray-200 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}
