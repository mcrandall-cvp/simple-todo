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
      tabIndex={0}
      className="flex items-center px-4 py-4 border-b border-gray-200
                 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                 transition-colors duration-150 motion-reduce:transition-none"
    >
      {/* Completion circle - visual only for now */}
      <span
        className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0"
        aria-hidden="true"
      />
      {/* Task title */}
      <span className="text-base text-gray-900 flex-grow">{task.title}</span>
    </li>
  );
}
