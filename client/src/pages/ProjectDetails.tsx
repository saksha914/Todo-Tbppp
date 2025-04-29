import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed' | 'archived';
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProject, getProject, deleteProject, isLoading: projectLoading } = useProjectStore();
  const { tasks, getTasks, isLoading: tasksLoading } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' >('overview');

  useEffect(() => {
    if (id) {
      getProject(id);
      getTasks({ project: id });
    }
  }, [id, getProject, getTasks]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(id);
        navigate('/projects');
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const projectTasks = tasks.filter(task => task.project?._id === id);

  if (projectLoading || !selectedProject) {
    return <div className="text-center text-gray-500">Loading project...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="h-12 w-12 rounded-full"
            style={{ backgroundColor: selectedProject.color || '#6B7280' }}
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{selectedProject.name}</h1>
            <p className="text-sm text-gray-500">
              Created {format(new Date(selectedProject.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="btn btn-secondary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Project
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Project
          </button>
        </div>
      </div>

      {/* Description */}
      {selectedProject.description && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600">{selectedProject.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'tasks', ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 truncate">Total Tasks</p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">{projectTasks.length}</p>
                    </div>
                    <div className="bg-primary-100 rounded-md p-3">
                      <PlusIcon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 truncate">Completed Tasks</p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">
                        {projectTasks.filter(task => task.status === 'completed').length}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 truncate">In Progress</p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">
                        {projectTasks.filter(task => task.status === 'in-progress').length}
                      </p>
                    </div>
                    <div className="bg-yellow-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 truncate">Team Members</p>
                      <p className="mt-1 text-3xl font-semibold text-gray-900">
                        {selectedProject.members?.length || 0}
                      </p>
                    </div>
                    <div className="bg-blue-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {projectTasks.slice(0, 5).map((task, index) => (
                      <li key={task._id}>
                        <div className="relative pb-8">
                          {index !== projectTasks.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Task <span className="font-medium text-gray-900">{task.title}</span> was created
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={task.createdAt}>
                                  {format(new Date(task.createdAt), 'MMM d, yyyy')}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
              <button
                onClick={() => navigate(`/tasks/new?project=${id}`)}
                className="btn btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
            </div>
            {tasksLoading ? (
              <div className="text-center text-gray-500">Loading tasks...</div>
            ) : projectTasks.length === 0 ? (
              <div className="text-center text-gray-500">No tasks found</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="mt-2 space-y-2">
                  {projectTasks.map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500">
                              Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 