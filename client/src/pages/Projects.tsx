import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Project {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  labels?: Array<{ name: string }>;
  createdAt: string;
  updatedAt: string;
}

const sortOptions = [
  { id: 'name-asc', name: 'Name (A-Z)' },
  { id: 'name-desc', name: 'Name (Z-A)' },
  { id: 'date-asc', name: 'Date (Oldest)' },
  { id: 'date-desc', name: 'Date (Newest)' },
];

export default function Projects() {
  const { projects = [], getProjects, deleteProject, isLoading } = useProjectStore();
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const filteredProjects = Array.isArray(projects) ? projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (selectedSort.id) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    }) : [];

  const handleDelete = async (_id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(_id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and organize your projects</p>
        </div>
        <Link 
          to="/projects/new" 
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="w-full sm:w-48">
          <Listbox value={selectedSort} onChange={setSelectedSort}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm">
                <span className="block truncate">{selectedSort.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {option.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Link
              to="/projects/new"
              className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => (
            <div
              key={project._id}
              className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: project.color || '#6B7280' }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${project._id}/edit`);
                    }}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(project._id, e)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {project.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex flex-wrap gap-2">
                  {project.labels?.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                    >
                      {label.name}
                    </span>
                  ))}
                  {(!project.labels || project.labels.length === 0) && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      No labels
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 