import { fetchTasks, createTask } from "../api";
import { Task } from "../types";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("API Client", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("fetchTasks", () => {
    it("should call GET /tasks endpoint", async () => {
      const mockTasks: Task[] = [
        { id: 1, title: "Test task", position: 0, createdAt: "2026-01-09T10:00:00Z" },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      });

      const result = await fetchTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "GET",
        })
      );
      expect(result).toEqual(mockTasks);
    });

    it("should return empty array when no tasks exist", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await fetchTasks();

      expect(result).toEqual([]);
    });

    it("should throw error on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchTasks()).rejects.toThrow();
    });

    it("should retry on failure up to 3 times", async () => {
      // Fail twice, succeed on third attempt
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const result = await fetchTasks();

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual([]);
    });

    it("should throw after 3 failed retries", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(fetchTasks()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("createTask", () => {
    it("should call POST /tasks endpoint with title", async () => {
      const mockTask: Task = {
        id: 1,
        title: "New task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await createTask("New task");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New task" }),
        })
      );
      expect(result).toEqual(mockTask);
    });

    it("should return created task with server-assigned fields", async () => {
      const mockTask: Task = {
        id: 42,
        title: "My task",
        position: 5,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTask),
      });

      const result = await createTask("My task");

      expect(result.id).toBe(42);
      expect(result.position).toBe(5);
      expect(result.createdAt).toBe("2026-01-09T10:00:00Z");
    });

    it("should throw error on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(createTask("Bad task")).rejects.toThrow();
    });

    it("should retry on failure up to 3 times", async () => {
      const mockTask: Task = {
        id: 1,
        title: "Retry task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      // Fail twice, succeed on third attempt
      mockFetch
        .mockRejectedValueOnce(new Error("Network error"))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTask),
        });

      const result = await createTask("Retry task");

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockTask);
    });

    it("should throw after 3 failed retries", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(createTask("Fail task")).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("API_BASE configuration", () => {
    it("should use NEXT_PUBLIC_API_URL when set", async () => {
      // Set environment variable and reset modules to pick up change
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = "http://test-api.com";

      jest.resetModules();
      mockFetch.mockClear();

      const { fetchTasks: fetchTasksWithEnv } = await import("../api");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchTasksWithEnv();

      // Should call with the custom API URL
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.com/tasks",
        expect.objectContaining({ method: "GET" })
      );

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
      jest.resetModules();
    });
  });
});
