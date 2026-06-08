import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  }, [navigate]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, [fetchUser, fetchTasks]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await api.post('/tasks', { title: title.trim(), description: description.trim() });
      showToast('Task created successfully!');
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      showToast('Task updated!');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      showToast('Task deleted!');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const stats = {
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">📋</div>
          <span className="navbar-brand-text">TaskFlow</span>
        </div>
        <div className="navbar-right">
          {user && (
            <div className="navbar-user">
              <div className="navbar-avatar">{getInitials(user.name)}</div>
              <div>
                <div className="navbar-user-name">{user.name}</div>
                <div className="navbar-user-role">{user.role}</div>
              </div>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard">
        <div className="dashboard-header">
          <h1>
            {user ? `Hey, ${user.name.split(' ')[0]}! 👋` : 'Dashboard'}
          </h1>
          <p>Here's a summary of your tasks</p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon in-progress">🔄</div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="add-task-section">
          <h3>➕ New Task</h3>
          <form className="add-task-form" onSubmit={createTask}>
            <input
              className="input-field"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="input-field"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? (
                <span className="spinner"></span>
              ) : (
                'Add Task'
              )}
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="task-list-header">
          <h2>📋 Your Tasks</h2>
          <span className="task-count-badge">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-container">
            <span className="spinner"></span>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={updateStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </>
  );
}
