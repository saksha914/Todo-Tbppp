import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import NewTask from './pages/NewTask';
import NewProject from './pages/NewProject';
import EditProject from './pages/EditProject';
import ProjectDetails from './pages/ProjectDetails';
import TaskDetail from './pages/TaskDetail';

function App() {
  const { isAuthenticated} = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:id/edit" element={<EditProject />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<NewTask />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
