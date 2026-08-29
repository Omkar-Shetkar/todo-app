import React from 'react';
import { Trash2 } from 'lucide-react';

export default function TodoStats({ totalCount, completedCount, onClearCompleted, disabled }) {
  return (
    <footer className="card-footer">
      <div className="stats-summary">
        <span>Total: <strong>{totalCount}</strong></span>
        <span>Done: <strong>{completedCount}</strong></span>
      </div>

      <button
        id="clear-completed-btn"
        type="button"
        className="clear-btn"
        onClick={onClearCompleted}
        disabled={disabled || completedCount === 0}
        title="Clear all completed tasks"
      >
        Clear Completed
      </button>
    </footer>
  );
}
