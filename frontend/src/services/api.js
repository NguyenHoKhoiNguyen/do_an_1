import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm JWT token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Teams API
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  getStats: (id) => api.get(`/teams/${id}/stats`),
  search: (params) => api.get('/teams/search', { params }),
};

// Players API
export const playersAPI = {
  getAll: () => api.get('/players'),
  getById: (id) => api.get(`/players/${id}`),
  getByTeam: (teamId) => api.get(`/players/team/${teamId}`),
  create: (data) => api.post('/players', data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  updateStats: (id, stats) => api.patch(`/players/${id}/stats`, stats),
  search: (params) => api.get('/players/search', { params }),
};

// Matches API
export const matchesAPI = {
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  getUpcoming: () => api.get('/matches/upcoming'),
  getPast: () => api.get('/matches/past'),
  create: (data) => api.post('/matches', data),
  update: (id, data) => api.put(`/matches/${id}`, data),
  updateScore: (id, data) => api.patch(`/matches/${id}/score`, data),
  delete: (id) => api.delete(`/matches/${id}`),
  search: (params) => api.get('/matches/search', { params }),
  getStats: (params) => api.get('/matches/stats', { params }),
};

export default api;
