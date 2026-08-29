const API_BASE = '/api/todos';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(endpoint, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const todoApi = {
  async getTodos(completed = null) {
    let url = API_BASE;
    if (completed !== null && completed !== undefined) {
      url += `?completed=${completed}`;
    }
    return request(url);
  },

  async createTodo(title) {
    return request(API_BASE, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async updateTodo(id, updates) {
    return request(`${API_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleTodo(id) {
    return request(`${API_BASE}/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteTodo(id) {
    return request(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  async clearCompleted() {
    return request(`${API_BASE}/completed`, {
      method: 'DELETE',
    });
  },
};
