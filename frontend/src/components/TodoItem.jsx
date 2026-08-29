import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit3, X, CheckCheck } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li
      id={`todo-item-${todo.id}`}
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
    >
      <div className="todo-content-area">
        <button
          id={`toggle-todo-${todo.id}`}
          type="button"
          className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
          title={todo.completed ? 'Mark as active' : 'Mark as completed'}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="inline-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="todo-title"
            onDoubleClick={handleStartEdit}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="item-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="icon-btn"
              onClick={handleSaveEdit}
              title="Save"
              aria-label="Save changes"
            >
              <CheckCheck size={16} color="#10b981" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleCancelEdit}
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X size={16} color="#f43f5e" />
            </button>
          </>
        ) : (
          <>
            <button
              id={`edit-todo-${todo.id}`}
              type="button"
              className="icon-btn edit-btn"
              onClick={handleStartEdit}
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit3 size={16} />
            </button>
            <button
              id={`delete-todo-${todo.id}`}
              type="button"
              className="icon-btn delete-btn"
              onClick={() => onDelete(todo.id)}
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
