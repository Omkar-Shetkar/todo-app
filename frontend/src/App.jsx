import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header.jsx';
import TodoInput from './components/TodoInput.jsx';
import TodoFilter from './components/TodoFilter.jsx';
import TodoList from './components/TodoList.jsx';
import TodoStats from './components/TodoStats.jsx';
import { todoApi } from './services/api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await todoApi.getTodos();
      setTodos(data || []);
    } catch (err) {
      console.error('Failed to load todos:', err);
      setError('Unable to reach server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (title) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      console.error('Failed to add todo:', err);
      setError(err.message || 'Failed to create task');
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      setError(null);
      const updated = await todoApi.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      setError('Failed to update task status');
      // Revert on error
      fetchTodos();
    }
  };

  const handleUpdate = async (id, updates) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    try {
      setError(null);
      const updated = await todoApi.updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError('Failed to save task update');
      fetchTodos();
    }
  };

  const handleDelete = async (id) => {
    const previous = todos;
    // Optimistic removal
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      setError(null);
      await todoApi.deleteTodo(id);
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('Failed to delete task');
      setTodos(previous);
    }
  };

  const handleClearCompleted = async () => {
    const previous = todos;
    // Optimistic removal
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      setError(null);
      await todoApi.clearCompleted();
    } catch (err) {
      console.error('Failed to clear completed todos:', err);
      setError('Failed to clear completed tasks');
      setTodos(previous);
    }
  };

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return (
    <div className="app-container">
      <Header />

      <main className="main-card">
        <TodoInput onAddTodo={handleAddTodo} disabled={loading} />

        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
        />

        <div className="todo-list-container">
          <TodoList
            todos={filteredTodos}
            currentFilter={filter}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        <TodoStats
          totalCount={todos.length}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
          disabled={loading}
        />
      </main>

      {error && (
        <div className="alert-banner alert-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="icon-btn"
            style={{ color: '#fda4af' }}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
