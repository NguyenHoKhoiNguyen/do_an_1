import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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

// News API
export const newsAPI = {
  getNews: (page = 1) => api.get('/news', { params: { page } }),
  searchNews: (query, page = 1) => api.get(`/news/search/${encodeURIComponent(query)}`, { params: { page } }),
  getHeadlines: (page = 1) => api.get('/news/headlines', { params: { page } }),
};

// Standings API
export const standingsAPI = {
  getStandings: () => api.get('/standings'),
  getTeamStanding: (teamId) => api.get(`/standings/team/${teamId}`),
  getSOS: (teamId) => api.get(`/standings/sos/${teamId}`),
};

// Export API
export const exportAPI = {
  exportStandingsPDF: () => api.get('/export/standings', { responseType: 'blob' }),
  exportTeamsPDF: () => api.get('/export/teams', { responseType: 'blob' }),
  exportPlayersPDF: () => api.get('/export/players', { responseType: 'blob' }),
  exportMatchesPDF: () => api.get('/export/matches', { responseType: 'blob' }),
};

// AI API
export const aiAPI = {
  getHistory: () => api.get('/ai/chat/history'),
  sendMessage: (message) => api.post('/ai/chat', { message }),
  clearHistory: () => api.delete('/ai/chat/clear'),
};

export default api;
