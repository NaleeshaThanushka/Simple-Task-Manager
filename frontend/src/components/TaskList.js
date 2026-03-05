import React, {useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const API_URL = 'http://localhost:5000/api/tasks'

const TaskList = () =>{
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try{
            setLoading(true);
            const response = await axios.get(API_URL);
            setTasks(response.data);
            setError('');
        }catch(error){
            setError('Failed to fetch tasks');
            console.error(error);
        
        }finally{
            setLoading(false);
        }
    };
    const createTask = async (taskData) =>{
        try{
            const response = await axios.post(API_URL, taskData);
            setTasks([response.data, ...tasks]);
            return { success: true};
        }catch(error){
            return { success: false, error: err.response?.data?.message || 'Failed to create task' };
        }
    };
    // Update task
  const updateTask = async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setEditingTask(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update task' };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  // Toggle task status
  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    await updateTask(task._id, { ...task, status: newStatus });
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Task Form */}
      <TaskForm 
        onSubmit={editingTask ? 
          (data) => updateTask(editingTask._id, data) : 
          createTask
        }
        initialData={editingTask}
        onCancel={() => setEditingTask(null)}
      />

      {/* Task List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet. Create one above!</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => deleteTask(task._id)}
                onToggleStatus={() => toggleStatus(task)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
