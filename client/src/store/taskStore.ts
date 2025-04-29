import { create } from 'zustand';
import { tasksApi } from '../services/api';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed' | 'archived';
  project?: {
    _id: string;
    name: string;
    color: string;
  };
  order: number;
  createdBy: {
    _id: string;
    username: string;
    profile: {
      preferences: {
        notifications: {
          email: boolean;
          push: boolean;
        };
        theme: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  getTasks: (filters?: { project?: string; status?: string; priority?: string; dueDate?: string; search?: string; page?: number; limit?: number }) => Promise<void>;
  getTask: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'createdBy' | 'order'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  getTasks: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.getTasks(filters);
      set({ tasks: response.data.tasks || [] });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  getTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.getTask(id);
      set({ selectedTask: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch task' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.createTask(task);
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create task' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, task) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.updateTask(id, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? response.data : t)),
        selectedTask: state.selectedTask?._id === id ? response.data : state.selectedTask,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update task' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await tasksApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        selectedTask: state.selectedTask?._id === id ? null : state.selectedTask,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete task' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 