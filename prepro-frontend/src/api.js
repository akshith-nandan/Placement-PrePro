import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('pp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('pp_token');
      localStorage.removeItem('pp_user');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (name, email, password, college) => API.post('/auth/register', { name, email, password, college }),
  demo: () => API.post('/auth/demo'),
};

export const quizzes = {
  getCategories: () => API.get('/quizzes/categories'),
  getQuestions: (cat) => API.get(`/quizzes/${cat}`),
  submit: (cat, answers) => API.post(`/quizzes/${cat}/submit`, { answers }),
};

export const coding = {
  getAll: () => API.get('/coding'),
  getOne: (id) => API.get(`/coding/${id}`),
  submit: (id, code, language) => API.post(`/coding/${id}/submit`, { code, language }),
};

export const materials = {
  getAll: () => API.get('/materials'),
  getPinned: () => API.get('/materials/pinned'),
};

export const mock = {
  getAll: () => API.get('/mock'),
  getOne: (id) => API.get(`/mock/${id}`),
  submit: (id, answers, timeTaken) => API.post(`/mock/${id}/submit`, { answers, timeTaken }),
};

export const progress = {
  get: () => API.get('/progress'),
};

export default API;