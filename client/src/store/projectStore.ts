import { create } from 'zustand';
import { projectsApi } from '../services/api';

interface Project {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  members?: Array<{
    userId: string;
    role: 'owner' | 'admin' | 'member';
  }>;
  labels?: Array<{
    name: string;
  }>;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  getProjects: () => Promise<void>;
  getProject: (id: string) => Promise<void>;
  createProject: (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectMember: (projectId: string, data: { userId: string; role: 'owner' | 'admin' | 'member' }) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  getProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectsApi.getProjects();
      set({ projects: response.data.projects || [] });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects' });
    } finally {
      set({ isLoading: false });
    }
  },

  getProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectsApi.getProject(id);
      set({ selectedProject: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch project' });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (project) => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectsApi.createProject(project);
      set((state) => ({ projects: [...state.projects, response.data] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create project' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (id, project) => {
    try {
      set({ isLoading: true, error: null });
      const response = await projectsApi.updateProject(id, project);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? response.data : p)),
        selectedProject: state.selectedProject?._id === id ? response.data : state.selectedProject,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update project' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await projectsApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        selectedProject: state.selectedProject?._id === id ? null : state.selectedProject,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete project' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProjectMember: async (projectId, data) => {
    try {
      set({ isLoading: true, error: null });
      await projectsApi.updateProjectMember(projectId, data);
      await useProjectStore.getState().getProject(projectId);
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update project member' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 