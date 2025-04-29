import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const { tasks = [], getTasks, isLoading: tasksLoading } = useTaskStore();
  const { projects = [], getProjects, isLoading: projectsLoading } = useProjectStore();

  useEffect(() => {
    getTasks();
    getProjects();
  }, [getTasks, getProjects]);

  const recentTasks = Array.isArray(tasks) ? tasks.slice(0, 5) : [];
  const recentProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];

  // Task status distribution data
  const statusData = tasks.reduce((acc, task) => {
    const status = task.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Task priority distribution data
  const priorityData = tasks.reduce((acc, task) => {
    const priority = task.priority;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(priorityData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Project progress data
  const projectProgressData = projects.map(project => {
    const projectTasks = tasks.filter(task => task.project?._id === project._id);
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return {
      name: project.name,
      completed: completedTasks,
      total: projectTasks.length,
      progress: projectTasks.length ? (completedTasks / projectTasks.length) * 100 : 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Link to="/tasks/new" className="btn btn-primary">
            New Task
          </Link>
          <Link to="/projects/new" className="btn btn-secondary">
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {tasks.filter(task => task.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {projects.filter(project => 
              tasks.some(task => task.project?._id === project._id && task.status !== 'completed')
            ).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Task Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2">Task Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2">Task Priority</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks and Projects */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Recent Tasks</h2>
              <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            {tasksLoading ? (
              <div className="mt-2 text-center text-gray-500">Loading tasks...</div>
            ) : recentTasks.length === 0 ? (
              <div className="mt-2 text-center text-gray-500">No tasks yet</div>
            ) : (
              <div className="mt-2 space-y-2">
                {recentTasks.map((task) => (
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
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Recent Projects</h2>
              <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            {projectsLoading ? (
              <div className="mt-2 text-center text-gray-500">Loading projects...</div>
            ) : recentProjects.length === 0 ? (
              <div className="mt-2 text-center text-gray-500">No projects yet</div>
            ) : (
              <div className="mt-2 space-y-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color || '#6B7280' }}
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                          <p className="text-xs text-gray-500">
                            {project.members?.length || 0} members
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 