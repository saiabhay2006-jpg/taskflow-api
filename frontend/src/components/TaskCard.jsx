import { useState } from 'react';

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusClass = task.status === 'in-progress' ? 'in-progress' : task.status;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    await onDelete(task._id);
    setIsDeleting(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-card status-${task.status}`}>
      <div className="task-card-top">
        <div className="task-card-info">
          <h4 className="task-card-title">{task.title}</h4>
          {task.description && (
            <p className="task-card-description">{task.description}</p>
          )}
        </div>
        <div className="task-card-actions">
          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onUpdate(task._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : '🗑️'}
          </button>
        </div>
      </div>
      <div className="task-card-bottom">
        <div className="task-card-meta">
          <span className={`status-badge ${statusClass}`}>
            {task.status === 'pending' && '⏳'}
            {task.status === 'in-progress' && '🔄'}
            {task.status === 'completed' && '✅'}
            {' '}{task.status.replace('-', ' ')}
          </span>
          {task.user && typeof task.user === 'object' && (
            <span className="task-card-date" style={{ color: 'var(--primary-300)' }}>
              👤 {task.user.name}
            </span>
          )}
        </div>
        <span className="task-card-date">
          📅 {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
}
