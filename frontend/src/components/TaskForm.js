import React, { useState, useEffect, useRef } from 'react';

// ── Inject styles once ────────────────────────────────────────────────────
const FORM_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --bg:        #0a0a0f;
    --surface:   #111118;
    --surface2:  #16161f;
    --border:    #1e1e2e;
    --border-hi: #2e2e4e;
    --accent:    #7c6af7;
    --accent-lo: rgba(124,106,247,.12);
    --accent-hi: #a89fff;
    --danger:    #f75a6a;
    --success:   #4ade80;
    --text:      #e8e8f0;
    --muted:     #6b6b8a;
  }

  /* ── Keyframes ── */
  @keyframes tf-glow-in {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tf-shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-6px); }
    40%     { transform:translateX(6px); }
    60%     { transform:translateX(-4px); }
    80%     { transform:translateX(4px); }
  }
  @keyframes tf-border-pulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(247,90,106,.1); }
    50%     { box-shadow: 0 0 0 3px rgba(247,90,106,.25); }
  }
  @keyframes tf-spin {
    to { transform:rotate(360deg); }
  }
  @keyframes tf-success-pop {
    0%   { transform:scale(0.8); opacity:0; }
    60%  { transform:scale(1.15); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes tf-dash {
    to { stroke-dashoffset: 0; }
  }

  /* ── Card ── */
  .tf-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: border-color .35s;
    animation: tf-glow-in .5s ease both;
    font-family: 'DM Sans', sans-serif;
  }
  .tf-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124,106,247,.05) 0%, transparent 55%);
    pointer-events: none;
  }
  .tf-card:focus-within {
    border-color: var(--border-hi);
  }

  /* ── Top accent line ── */
  .tf-top-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent) 40%, var(--accent-hi) 60%, transparent);
    opacity: 0;
    transition: opacity .4s;
  }
  .tf-card:focus-within .tf-top-accent { opacity: 1; }

  /* ── Header ── */
  .tf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }
  .tf-header-left { display:flex; align-items:center; gap:.75rem; }
  .tf-mode-badge {
    font-family: 'DM Mono', monospace;
    font-size: .6rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    padding: .25rem .7rem;
    border-radius: 999px;
    border: 1px solid;
    transition: all .3s;
  }
  .tf-mode-badge.create {
    color: var(--accent-hi);
    border-color: rgba(124,106,247,.35);
    background: var(--accent-lo);
  }
  .tf-mode-badge.edit {
    color: #f59e0b;
    border-color: rgba(245,158,11,.35);
    background: rgba(245,158,11,.1);
  }
  .tf-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: .05em;
    color: var(--text);
    line-height: 1;
  }
  .tf-char-count {
    font-family: 'DM Mono', monospace;
    font-size: .6rem;
    letter-spacing: .1em;
    color: var(--muted);
    transition: color .2s;
  }
  .tf-char-count.warn { color: #f59e0b; }
  .tf-char-count.over { color: var(--danger); }

  /* ── Fields ── */
  .tf-field { margin-bottom: 1.1rem; position:relative; }
  .tf-label {
    display: flex;
    align-items: center;
    gap: .4rem;
    font-family: 'DM Mono', monospace;
    font-size: .62rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: .55rem;
    transition: color .2s;
  }
  .tf-label-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--border-hi);
    transition: background .2s, box-shadow .2s;
  }
  .tf-field:focus-within .tf-label { color: var(--accent-hi); }
  .tf-field:focus-within .tf-label-dot {
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
  }
  .tf-label-req {
    color: var(--accent);
    margin-left: .15rem;
  }

  .tf-input-wrap { position:relative; }

  .tf-input, .tf-textarea {
    width: 100%;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: .8rem 1rem;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    display: block;
  }
  .tf-input:focus, .tf-textarea:focus {
    border-color: rgba(124,106,247,.55);
    box-shadow: 0 0 0 3px rgba(124,106,247,.1), 0 0 20px rgba(124,106,247,.07);
    background: rgba(124,106,247,.03);
  }
  .tf-input::placeholder, .tf-textarea::placeholder { color: var(--muted); }
  .tf-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .tf-input.error {
    border-color: rgba(247,90,106,.55);
    animation: tf-border-pulse 1.5s ease infinite;
  }
  .tf-input.disabled, .tf-textarea.disabled {
    opacity: .45;
    cursor: not-allowed;
  }

  /* ── Error message ── */
  .tf-error-msg {
    display: flex;
    align-items: center;
    gap: .4rem;
    font-family: 'DM Mono', monospace;
    font-size: .62rem;
    letter-spacing: .08em;
    color: var(--danger);
    margin-top: .45rem;
    animation: tf-shake .35s ease;
  }
  .tf-error-msg::before {
    content: '!';
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: .55rem;
    flex-shrink: 0;
  }

  /* ── Row layout ── */
  .tf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.1rem; }
  @media (max-width: 520px) { .tf-row { grid-template-columns: 1fr; } }

  /* ── Select ── */
  .tf-select {
    width: 100%;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: .8rem 2.5rem .8rem 1rem;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: border-color .2s, box-shadow .2s;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b6b8a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
  }
  .tf-select:focus {
    border-color: rgba(124,106,247,.55);
    box-shadow: 0 0 0 3px rgba(124,106,247,.1);
  }
  .tf-select option { background: #1a1a26; }

  /* ── Priority dots ── */
  .tf-prio-row { display:flex; gap:.5rem; margin-bottom:1.1rem; }
  .tf-prio-opt {
    flex: 1;
    border: 1px solid var(--border);
    border-radius: 9px;
    padding: .6rem .5rem;
    text-align: center;
    cursor: pointer;
    transition: all .2s;
    font-family: 'DM Mono', monospace;
    font-size: .62rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--muted);
    background: transparent;
    user-select: none;
  }
  .tf-prio-opt:hover { border-color: var(--border-hi); color: var(--text); }
  .tf-prio-opt.selected-high  { border-color:rgba(249,115,22,.5); color:#f97316; background:rgba(249,115,22,.08); box-shadow:0 0 12px rgba(249,115,22,.15); }
  .tf-prio-opt.selected-medium{ border-color:rgba(245,158,11,.5); color:#f59e0b; background:rgba(245,158,11,.08); box-shadow:0 0 12px rgba(245,158,11,.15); }
  .tf-prio-opt.selected-low   { border-color:rgba(124,106,247,.5); color:var(--accent-hi); background:var(--accent-lo); box-shadow:0 0 12px rgba(124,106,247,.15); }
  .tf-prio-label {
    font-family: 'DM Mono', monospace;
    font-size: .62rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: .55rem;
    display: flex; align-items: center; gap: .4rem;
  }
  .tf-prio-label .tf-label-dot { width:5px; height:5px; border-radius:50%; background:var(--border-hi); }

  /* ── Divider ── */
  .tf-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.4rem 0 1.25rem;
  }

  /* ── Actions ── */
  .tf-actions { display:flex; gap:.75rem; align-items:center; }
  .tf-btn {
    border: none;
    border-radius: 10px;
    padding: .75rem 1.5rem;
    font-family: 'DM Mono', monospace;
    font-size: .68rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all .2s;
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    position: relative;
    overflow: hidden;
  }
  .tf-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,.07);
    opacity: 0;
    transition: opacity .15s;
  }
  .tf-btn:hover::after { opacity: 1; }
  .tf-btn:active { transform: scale(.97); }

  .tf-btn-submit {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 20px rgba(124,106,247,.35);
    flex: 1;
  }
  .tf-btn-submit:hover {
    box-shadow: 0 6px 30px rgba(124,106,247,.55);
    transform: translateY(-1px);
  }
  .tf-btn-submit:disabled {
    opacity: .5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .tf-btn-submit.edit-mode {
    background: linear-gradient(135deg, #d97706, #f59e0b);
    box-shadow: 0 4px 20px rgba(245,158,11,.3);
  }
  .tf-btn-submit.edit-mode:hover {
    box-shadow: 0 6px 30px rgba(245,158,11,.5);
  }

  .tf-btn-cancel {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .tf-btn-cancel:hover {
    border-color: var(--border-hi);
    color: var(--text);
  }

  /* ── Spinner ── */
  .tf-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: tf-spin .8s linear infinite;
    flex-shrink: 0;
  }

  /* ── Success flash ── */
  .tf-success-flash {
    position: absolute;
    inset: 0;
    background: rgba(74,222,128,.06);
    border-radius: inherit;
    pointer-events: none;
    animation: tf-glow-in .2s ease both;
  }
`;

// ── Main component ────────────────────────────────────────────────────────
const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    dueDate: '',
  });
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const titleRef = useRef(null);

  const MAX_TITLE = 80;
  const isEdit = !!initialData;

  // Inject styles once
  useEffect(() => {
    const id = 'tf-global-style';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = FORM_STYLE;
      document.head.appendChild(el);
    }
  }, []);

  // Populate from initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title:       initialData.title       || '',
        description: initialData.description || '',
        priority:    initialData.priority    || 'Medium',
        category:    initialData.category    || '',
        dueDate:     initialData.dueDate     || '',
      });
    } else {
      setFormData({ title:'', description:'', priority:'Medium', category:'', dueDate:'' });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!formData.title?.trim()) e.title = 'Title is required';
    if (formData.title?.length > MAX_TITLE) e.title = `Max ${MAX_TITLE} characters`;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      titleRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result?.success) {
        if (!initialData) {
          setFormData({ title:'', description:'', priority:'Medium', category:'', dueDate:'' });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 800);
        }
        setErrors({});
      } else if (result?.error) {
        alert(result.error);
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const titleLen = formData.title?.length || 0;
  const charClass =
    titleLen > MAX_TITLE ? 'over' :
    titleLen > MAX_TITLE * 0.8 ? 'warn' : '';

  return (
    <div className="tf-card">
      <div className="tf-top-accent" />
      {showSuccess && <div className="tf-success-flash" />}

      {/* Header */}
      <div className="tf-header">
        <div className="tf-header-left">
          <span className={`tf-mode-badge ${isEdit ? 'edit' : 'create'}`}>
            {isEdit ? '✎ Editing' : '+ New'}
          </span>
          <h2 className="tf-heading">
            {isEdit ? 'Edit Task' : 'Create Task'}
          </h2>
        </div>
        {titleLen > 0 && (
          <span className={`tf-char-count ${charClass}`}>
            {titleLen}/{MAX_TITLE}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Title */}
        <div className="tf-field">
          <label className="tf-label">
            <span className="tf-label-dot" />
            Title <span className="tf-label-req">*</span>
          </label>
          <div className="tf-input-wrap">
            <input
              ref={titleRef}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              disabled={submitting}
              className={`tf-input ${errors.title ? 'error' : ''} ${submitting ? 'disabled' : ''}`}
              autoComplete="off"
            />
          </div>
          {errors.title && (
            <p className="tf-error-msg">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="tf-field">
          <label className="tf-label">
            <span className="tf-label-dot" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details, context, or notes…"
            disabled={submitting}
            className={`tf-textarea ${submitting ? 'disabled' : ''}`}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="tf-actions">
          <button
            type="submit"
            disabled={submitting}
            className={`tf-btn tf-btn-submit ${isEdit ? 'edit-mode' : ''}`}
          >
            {submitting
              ? <><div className="tf-spinner" /> Saving…</>
              : isEdit
                ? '✓ Update Task'
                : '＋ Create Task'
            }
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="tf-btn tf-btn-cancel"
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
};

export default TaskForm;