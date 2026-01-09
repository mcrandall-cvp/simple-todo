import { Task } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://backend:3001";

/**
 * Retry wrapper for API calls - implements silent retry pattern
 * Retries up to 3 times with exponential backoff
 * On final failure, throws error (caller handles rollback)
 */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: Error = new Error("Retry failed");
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < attempts - 1) {
        // Exponential backoff: 1s, 2s, 3s
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Fetch all tasks from the API
 * Returns tasks ordered by position ascending
 */
export async function fetchTasks(): Promise<Task[]> {
  return withRetry(async () => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Create a new task
 * Returns the created task with server-assigned id, position, and createdAt
 */
export async function createTask(title: string): Promise<Task> {
  return withRetry(async () => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status}`);
    }
    return response.json();
  });
}
