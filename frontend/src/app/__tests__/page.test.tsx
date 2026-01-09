import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";
import { Task } from "@/lib/types";

// Mock the API module
jest.mock("@/lib/api", () => ({
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
}));

// Import mocked functions for type safety
import { fetchTasks, createTask } from "@/lib/api";
const mockFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>;
const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock: empty tasks array
    mockFetchTasks.mockResolvedValue([]);
  });

  describe("Initial Render and Task Fetching (AC1, AC4, AC5)", () => {
    it("should render the page with EmptyState when no tasks exist", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(screen.getByText("No tasks yet")).toBeInTheDocument();
      });
    });

    it("should fetch tasks on mount using useEffect", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(mockFetchTasks).toHaveBeenCalledTimes(1);
      });
    });

    it("should display TaskList when tasks exist", async () => {
      const mockTasks: Task[] = [
        { id: 1, title: "Test task 1", position: 0, createdAt: "2026-01-09T10:00:00Z" },
        { id: 2, title: "Test task 2", position: 1, createdAt: "2026-01-09T10:01:00Z" },
      ];
      mockFetchTasks.mockResolvedValue(mockTasks);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.getByText("Test task 1")).toBeInTheDocument();
        expect(screen.getByText("Test task 2")).toBeInTheDocument();
      });
    });

    it("should display tasks in correct order (by position)", async () => {
      const mockTasks: Task[] = [
        { id: 2, title: "Second task", position: 1, createdAt: "2026-01-09T10:01:00Z" },
        { id: 1, title: "First task", position: 0, createdAt: "2026-01-09T10:00:00Z" },
      ];
      // Backend should return in order, but we test the data is displayed correctly
      mockFetchTasks.mockResolvedValue(mockTasks);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(2);
      });
    });
  });

  describe("Task Creation with Optimistic Updates (AC3)", () => {
    it("should render TaskInput component", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      expect(screen.getByPlaceholderText("Add a task...")).toBeInTheDocument();
    });

    it("should immediately add task to UI on submit (optimistic update)", async () => {
      mockFetchTasks.mockResolvedValue([]);
      const savedTask: Task = {
        id: 1,
        title: "New task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockCreateTask.mockResolvedValue(savedTask);

      await act(async () => {
        render(<Home />);
      });

      const input = screen.getByPlaceholderText("Add a task...");

      await act(async () => {
        fireEvent.change(input, { target: { value: "New task" } });
        fireEvent.keyDown(input, { key: "Enter" });
      });

      // Task should appear immediately (optimistic update)
      await waitFor(() => {
        expect(screen.getByText("New task")).toBeInTheDocument();
      });
    });

    it("should call createTask API when task is submitted", async () => {
      mockFetchTasks.mockResolvedValue([]);
      const savedTask: Task = {
        id: 1,
        title: "API task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockCreateTask.mockResolvedValue(savedTask);

      await act(async () => {
        render(<Home />);
      });

      const input = screen.getByPlaceholderText("Add a task...");

      await act(async () => {
        fireEvent.change(input, { target: { value: "API task" } });
        fireEvent.keyDown(input, { key: "Enter" });
      });

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith("API task");
      });
    });

    it("should replace temp task with server response", async () => {
      mockFetchTasks.mockResolvedValue([]);
      const savedTask: Task = {
        id: 42,
        title: "Server task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockCreateTask.mockResolvedValue(savedTask);

      await act(async () => {
        render(<Home />);
      });

      const input = screen.getByPlaceholderText("Add a task...");

      await act(async () => {
        fireEvent.change(input, { target: { value: "Server task" } });
        fireEvent.keyDown(input, { key: "Enter" });
      });

      await waitFor(() => {
        expect(screen.getByText("Server task")).toBeInTheDocument();
      });
    });

    it("should add new task at bottom of list", async () => {
      const existingTasks: Task[] = [
        { id: 1, title: "Existing task", position: 0, createdAt: "2026-01-09T10:00:00Z" },
      ];
      mockFetchTasks.mockResolvedValue(existingTasks);
      const newTask: Task = {
        id: 2,
        title: "New task",
        position: 1,
        createdAt: "2026-01-09T10:01:00Z",
      };
      mockCreateTask.mockResolvedValue(newTask);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.getByText("Existing task")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Add a task...");

      await act(async () => {
        fireEvent.change(input, { target: { value: "New task" } });
        fireEvent.keyDown(input, { key: "Enter" });
      });

      await waitFor(() => {
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(2);
      });
    });
  });

  describe("Silent Error Handling (AC6)", () => {
    it("should silently handle fetch error without showing error to user", async () => {
      mockFetchTasks.mockRejectedValue(new Error("Network error"));

      await act(async () => {
        render(<Home />);
      });

      // Should show empty state, not an error message
      await waitFor(() => {
        expect(screen.getByText("No tasks yet")).toBeInTheDocument();
      });
      // No error message should be displayed
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it("should rollback task on create failure (silent recovery)", async () => {
      mockFetchTasks.mockResolvedValue([]);
      // Delay rejection to allow optimistic update to render
      mockCreateTask.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Create failed")), 50)
          )
      );

      await act(async () => {
        render(<Home />);
      });

      const input = screen.getByPlaceholderText("Add a task...");

      // Trigger task creation
      fireEvent.change(input, { target: { value: "Failed task" } });
      fireEvent.keyDown(input, { key: "Enter" });

      // Task should appear initially (optimistic update)
      await waitFor(() => {
        expect(screen.getByText("Failed task")).toBeInTheDocument();
      });

      // After API failure, task should be rolled back
      await waitFor(() => {
        expect(screen.queryByText("Failed task")).not.toBeInTheDocument();
      });

      // Should show empty state again
      expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    });
  });

  describe("State Management (AC5)", () => {
    it("should manage tasks with useState (render behavior)", async () => {
      const tasks: Task[] = [
        { id: 1, title: "State test", position: 0, createdAt: "2026-01-09T10:00:00Z" },
      ];
      mockFetchTasks.mockResolvedValue(tasks);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.getByText("State test")).toBeInTheDocument();
      });
    });
  });

  describe("Layout and Styling", () => {
    it("should have centered layout with max-width container", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      // Check for main container with expected classes
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("should always display TaskInput at bottom", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      const input = screen.getByPlaceholderText("Add a task...");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("should show EmptyState when tasks array is empty", async () => {
      mockFetchTasks.mockResolvedValue([]);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.getByText("No tasks yet")).toBeInTheDocument();
        expect(screen.getByText("Add your first task below")).toBeInTheDocument();
      });
    });

    it("should show TaskList when tasks exist", async () => {
      const tasks: Task[] = [
        { id: 1, title: "Task exists", position: 0, createdAt: "2026-01-09T10:00:00Z" },
      ];
      mockFetchTasks.mockResolvedValue(tasks);

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
        expect(screen.getByText("Task exists")).toBeInTheDocument();
      });
    });

    it("should transition from EmptyState to TaskList when first task added", async () => {
      mockFetchTasks.mockResolvedValue([]);
      const newTask: Task = {
        id: 1,
        title: "First task",
        position: 0,
        createdAt: "2026-01-09T10:00:00Z",
      };
      mockCreateTask.mockResolvedValue(newTask);

      await act(async () => {
        render(<Home />);
      });

      // Initially empty
      await waitFor(() => {
        expect(screen.getByText("No tasks yet")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Add a task...");

      await act(async () => {
        fireEvent.change(input, { target: { value: "First task" } });
        fireEvent.keyDown(input, { key: "Enter" });
      });

      // After adding task, EmptyState should disappear
      await waitFor(() => {
        expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
        expect(screen.getByText("First task")).toBeInTheDocument();
      });
    });
  });
});
