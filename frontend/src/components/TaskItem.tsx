"use client";

import { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onComplete?: (id: number) => void; // Optional - will be used in Epic 3
}

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <li
      role="listitem"
      className="flex items-center px-4 py-4 border-b border-gray-200
                 hover:bg-gray-50
                 transition-colors duration-150 motion-reduce:transition-none"
    >
      {/* Completion circle - visual only until Story 3.2 adds interactivity */}
      <span
        aria-hidden="true"
        className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0"
      />
      {/* Task title */}
      <span className="text-base text-gray-900 flex-grow truncate">
        {task.title}
      </span>
    </li>
  );
}
