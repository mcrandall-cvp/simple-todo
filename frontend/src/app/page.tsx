"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { fetchTasks, createTask } from "@/lib/api";
import TaskList from "@/components/TaskList";
import TaskInput from "@/components/TaskInput";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks on mount
  useEffect(() => {
    let isMounted = true;
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        if (isMounted) {
          setTasks(data);
        }
      } catch {
        // Silent error handling - log to console only
        if (isMounted) {
          console.error("Failed to fetch tasks");
        }
      }
    };
    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle adding a new task with optimistic update
  const handleAddTask = async (title: string) => {
    // Optimistic update - create temporary task
    const tempTask: Task = {
      id: -Math.random(), // Negative random ID to avoid collisions
      title,
      position: tasks.length,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, tempTask]);

    try {
      // Persist to backend
      const savedTask = await createTask(title);
      // Replace temp task with real one from server
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? savedTask : t))
      );
    } catch {
      // Rollback on failure - silent recovery
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
      console.error("Failed to create task");
    }
  };

  return (
    <main className="min-h-screen bg-white" data-testid="main-container">
      <div className="w-full max-w-[512px] mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Content area - grows to push input to bottom */}
        <div className="flex-grow" data-testid="content-area">
          {tasks.length === 0 ? <EmptyState /> : <TaskList tasks={tasks} />}
        </div>
        {/* Input always at bottom */}
        <TaskInput onSubmit={handleAddTask} />
      </div>
    </main>
  );
}
