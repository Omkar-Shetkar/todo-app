import React, { useState } from 'react';
import { Plus, ListPlus } from 'lucide-react';

export default function TodoInput({ onAddTodo, disabled }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task title');
      return;
    }
    setError('');
    onAddTodo(trimmed);
    setTitle('');
  };

  return (
    <section className="input-section">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="input-wrapper">
          <span className="input-icon">
            <ListPlus size={20} />
          </span>
          <input
            id="todo-input"
            type="text"
            className="todo-input"
            placeholder="What needs to be accomplished today?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            disabled={disabled}
            autoFocus
          />
        </div>
        <button
          id="add-todo-btn"
          type="submit"
          className="add-button"
          disabled={disabled || !title.trim()}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </form>
      {error && <div className="alert-banner alert-error" style={{ marginTop: '0.75rem' }}>{error}</div>}
    </section>
  );
}
