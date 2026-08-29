import React from 'react';
import TodoItem from './TodoItem.jsx';
import { ClipboardList, CheckCircle2, CircleDashed } from 'lucide-react';

export default function TodoList({ todos, currentFilter, onToggle, onUpdate, onDelete }) {
  if (todos.length === 0) {
    let icon = <ClipboardList className="empty-state-icon" />;
    let title = 'No tasks found';
    let desc = 'Add a new task above to get started.';

    if (currentFilter === 'active') {
      icon = <CheckCircle2 className="empty-state-icon" style={{ color: '#10b981' }} />;
      title = 'All caught up!';
      desc = 'There are no active tasks pending.';
    } else if (currentFilter === 'completed') {
      icon = <CircleDashed className="empty-state-icon" />;
      title = 'No completed tasks yet';
      desc = 'Finish your pending tasks to see them listed here.';
    }

    return (
      <div className="empty-state">
        {icon}
        <div className="empty-state-title">{title}</div>
        <p className="empty-state-desc">{desc}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
