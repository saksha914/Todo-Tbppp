import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function NewProject() {
  const { createProject, isLoading } = useProjectStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>();

  const onSubmit = async (data: ProjectForm) => {
    try {
      setError(null);
      // Convert comma-separated labels string to array of objects
      const formattedData = {
        ...data,
        labels: data.labels ? data.labels.split(',').map(label => ({ name: label.trim() })) : [],
        settings: {
          defaultView: 'list',
          taskOrder: 'manual',
          ...data.settings,
        },
      };
      await createProject(formattedData);
      navigate('/projects');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

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
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
} 