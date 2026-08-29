import React from 'react';

export default function TodoFilter({ currentFilter, onFilterChange, activeCount }) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-pills">
        {filters.map((filter) => (
          <button
            key={filter.id}
            id={`filter-${filter.id}-btn`}
            type="button"
            className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="remaining-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'task' : 'tasks'} remaining
      </div>
    </div>
  );
}
