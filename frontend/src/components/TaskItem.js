import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleToggle = () => {
    console.log('Toggle button clicked for task:', task); // Debug log
    onToggleStatus(task);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
      task.status === 'Completed' ? 'border-green-500' : 'border-yellow-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-semibold ${
              task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              task.status === 'Completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {task.status}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-2">{task.description}</p>
          )}
          
          <p className="text-sm text-gray-400">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={handleToggle}
            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
              task.status === 'Pending'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {task.status === 'Pending' ? '✓ Complete' : '↩ Pending'}
          </button>
          
          <button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-md font-medium transition-colors"
          >
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-md font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;