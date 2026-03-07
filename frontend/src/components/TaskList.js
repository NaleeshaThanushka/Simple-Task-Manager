// frontend/src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const API_URL = 'http://localhost:5000/api/tasks';

// ── Inject global styles once ──────────────────────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --bg:        #0a0a0f;
    --surface:   #111118;
    --border:    #1e1e2e;
    --border-hi: #2e2e4e;
    --accent:    #7c6af7;
    --accent-lo: rgba(124,106,247,0.12);
    --accent-hi: #a89fff;
    --danger:    #f75a6a;
    --success:   #4ade80;
    --text:      #e8e8f0;
    --muted:     #6b6b8a;
    --glow:      0 0 24px rgba(124,106,247,0.35);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,106,247,0.15) 0%, transparent 60%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 2px; }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 12px rgba(124,106,247,0.3); }
    50%       { box-shadow: 0 0 28px rgba(124,106,247,0.6); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .task-manager-root { animation: fadeUp 0.6s ease both; }

  /* ── Header ── */
  .tm-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
  }
  .tm-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    display: block;
  }
  .tm-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem);
    line-height: 0.95;
    letter-spacing: 0.03em;
    background: linear-gradient(135deg, #fff 30%, var(--accent-hi) 70%, var(--accent) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .tm-title-accent {
    display: block;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px rgba(124,106,247,0.5);
    color: transparent;
  }
  .tm-header-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    margin: 1.2rem auto 0;
    animation: pulse-glow 3s ease-in-out infinite;
  }

  /* ── Error banner ── */
  .tm-error {
    border: 1px solid rgba(247,90,106,0.3);
    background: rgba(247,90,106,0.08);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    animation: fadeUp 0.4s ease both;
  }
  .tm-error-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .tm-error-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: var(--danger);
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }
  .tm-error-msg {
    font-size: 0.85rem;
    color: rgba(247,90,106,0.8);
    line-height: 1.5;
  }

  /* ── Section header ── */
  .tm-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .tm-section-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .tm-section-title::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--accent);
  }
  .tm-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    background: var(--accent-lo);
    border: 1px solid rgba(124,106,247,0.25);
    color: var(--accent-hi);
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
  }

  /* ── Empty state ── */
  .tm-empty {
    text-align: center;
    padding: 4rem 2rem;
    border: 1px dashed var(--border-hi);
    border-radius: 12px;
    background: rgba(255,255,255,0.01);
    position: relative;
    overflow: hidden;
  }
  .tm-empty::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(124,106,247,0.04), transparent 70%);
  }
  .tm-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
    opacity: 0.4;
  }
  .tm-empty-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Loading spinner ── */
  .tm-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem;
  }
  .tm-spinner {
    width: 36px;
    height: 36px;
    border: 2px solid var(--border-hi);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin-slow 0.9s linear infinite;
  }
  .tm-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Task list ── */
  .tm-task-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .tm-task-list > * {
    animation: slide-in 0.35s ease both;
  }
`;

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Inject global styles once
    useEffect(() => {
        const id = 'tm-global-style';
        if (!document.getElementById(id)) {
            const el = document.createElement('style');
            el.id = id;
            el.textContent = GLOBAL_STYLE;
            document.head.appendChild(el);
        }
    }, []);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setTasks(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch tasks. Make sure backend is running on port 5000');
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        try {
            const response = await axios.post(API_URL, taskData);
            if (response.data && response.data.title) {
                setTasks(prevTasks => [response.data, ...prevTasks]);
                return { success: true };
            }
            return { success: false, error: 'Invalid response from server' };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to create task' };
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, taskData);
            setTasks(tasks.map(task => task._id === id ? response.data : task));
            setEditingTask(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to update task' };
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setTasks(tasks.filter(task => task._id !== id));
            } catch {
                alert('Failed to delete task');
            }
        }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
            await axios.put(`${API_URL}/${task._id}`, { ...task, status: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
        } catch {
            alert('Failed to toggle status');
        }
    };

    const pendingCount  = tasks.filter(t => t.status === 'Pending').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    return (
        <div className="task-manager-root" style={{
            maxWidth: '780px',
            margin: '0 auto',
            padding: '3rem 1.5rem 5rem',
            position: 'relative',
        }}>

            {/* ── Header ───────────────────────────────────────────── */}
            <header className="tm-header">
                <span className="tm-eyebrow">Clear your mind</span>
                <h1 className="tm-title">
                    Task
                    <span className="tm-title-accent">Manager</span>
                </h1>
                <div className="tm-header-line" />

                {/* Stats row */}
                {!loading && tasks.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '1.5rem',
                    }}>
                        {[
                            { label: 'Total',     value: tasks.length,    color: 'var(--text)' },
                            { label: 'Pending',   value: pendingCount,    color: '#f59e0b' },
                            { label: 'Done',      value: completedCount,  color: 'var(--success)' },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    fontSize: '2rem',
                                    lineHeight: 1,
                                    color,
                                    textShadow: `0 0 20px ${color}55`,
                                }}>
                                    {value}
                                </div>
                                <div style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    marginTop: '0.2rem',
                                }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </header>

            {/* ── Error ────────────────────────────────────────────── */}
            {error && (
                <div className="tm-error">
                    <span className="tm-error-icon">⚠</span>
                    <div>
                        <div className="tm-error-title">Connection Error</div>
                        <div className="tm-error-msg">{error}</div>
                    </div>
                </div>
            )}

            {/* ── Task Form ────────────────────────────────────────── */}
            <TaskForm
                onSubmit={editingTask
                    ? (data) => updateTask(editingTask._id, data)
                    : createTask
                }
                initialData={editingTask}
                onCancel={() => setEditingTask(null)}
            />

            {/* ── Task List ────────────────────────────────────────── */}
            <div style={{ marginTop: '2.5rem' }}>
                <div className="tm-section-header">
                    <span className="tm-section-title">Your Tasks</span>
                    <span className="tm-badge">
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                </div>

                {loading ? (
                    <div className="tm-loading">
                        <div className="tm-spinner" />
                        <span className="tm-loading-text">Fetching tasks…</span>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="tm-empty">
                        <span className="tm-empty-icon">◈</span>
                        <p className="tm-empty-text">No tasks yet — create one above</p>
                    </div>
                ) : (
                    <div className="tm-task-list">
                        {tasks.map((task, i) => (
                            <div key={task._id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <TaskItem
                                    task={task}
                                    onEdit={() => setEditingTask(task)}
                                    onDelete={() => deleteTask(task._id)}
                                    onToggleStatus={() => toggleStatus(task)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;