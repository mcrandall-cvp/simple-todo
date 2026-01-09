"use client";

import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: number) => void; // Optional - will be used in Epic 3
}

export default function TaskList({ tasks, onComplete }: TaskListProps) {
  return (
    <ul
      role="list"
      aria-label="Task list"
      className="w-full max-w-[512px] mx-auto bg-white flex flex-col gap-2"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
        />
      ))}
    </ul>
  );
}
