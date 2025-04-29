import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useForm } from 'react-hook-form';

interface ProjectForm {
  name: string;
  description?: string;
  color?: string;
  labels?: Array<{
    name: string;
  }>;
  settings?: {
    defaultView?: 'list' | 'board' | 'calendar' | 'timeline';
    taskOrder?: 'manual' | 'dueDate' | 'priority' | 'createdAt';
  };
}

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { selectedProject, getProject, updateProject, deleteProject, isLoading, error: storeError } = useProjectStore();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectForm>();

  useEffect(() => {
    if (!id) {
      navigate('/projects');
      return;
    }

    const fetchProject = async () => {
      try {
        setError(null);
        await getProject(id);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch project');
        setTimeout(() => navigate('/projects'), 2000);
      }
    };

    fetchProject();
  }, [id, getProject, navigate]);

  useEffect(() => {
    if (selectedProject) {
      reset({
        name: selectedProject.name,
        description: selectedProject.description,
        color: selectedProject.color,
        labels: selectedProject.labels?.map(label => label.name).join(', ') || '',
        settings: selectedProject.settings,
      });
    }
  }, [selectedProject, reset]);

  const onSubmit = async (data: ProjectForm) => {
    if (!id) return;

    try {
      setError(null);
      const formattedData = {
        ...data,
        labels: data.labels ? data.labels.split(',').map(label => ({ name: label.trim() })) : [],
      };
      await updateProject(id, formattedData);
      navigate('/projects');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProject(id);
      navigate('/projects');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!id) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-gray-500">Invalid project ID</div>
      </div>
    );
  }

  if (isLoading && !selectedProject) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-gray-500">Loading project...</div>
      </div>
    );
  }

  if (error || storeError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error || storeError}
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn btn-danger"
        >
          {isDeleting ? 'Deleting...' : 'Delete Project'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('name', { required: 'Project name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('description')}
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="color"
            id="color"
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('color')}
          />
        </div>

        <div>
          <label htmlFor="labels" className="block text-sm font-medium text-gray-700">
            Labels (comma-separated)
          </label>
          <input
            type="text"
            id="labels"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g. Frontend, Backend, Design"
            {...register('labels')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default View
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('settings.defaultView')}
          >
            <option value="list">List</option>
            <option value="board">Board</option>
            <option value="calendar">Calendar</option>
            <option value="timeline">Timeline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Task Order
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...register('settings.taskOrder')}
          >
            <option value="manual">Manual</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 