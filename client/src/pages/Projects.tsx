import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">
          New Project
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <Listbox value={selectedSort} onChange={setSelectedSort}>
            <div className="relative">
              <Listbox.Button className="input flex items-center justify-between">
                <span>{selectedSort.name}</span>
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
        <div className="text-center text-gray-500">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-gray-500">No projects found</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredProjects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/projects/${project._id}`)}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: project.color || '#6B7280' }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{project.name}</div>
                      {project.description && (
                        <div className="text-sm text-gray-500 mt-1">{project.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {project.members?.length || 0} members
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </div>
      )}
    </div>
  );
} 