import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach JWT token from localStorage to every request if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // Debug: log token and headers for update and delete requests
  if (config.url && (/notes\//.test(config.url) && (config.method === 'put' || config.method === 'delete'))) {
    console.log('[API DEBUG] Sending request:', config.method?.toUpperCase(), config.url);
    console.log('[API DEBUG] Authorization header:', config.headers['Authorization']);
    console.log('[API DEBUG] All headers:', config.headers);
  }
  return config;
});

// Auth endpoints

// For signup: pass { email, name, dateOfBirth } | For signin: pass { email }
export const sendOtp = (data: { email: string; name?: string; dateOfBirth?: string }) =>
  axiosInstance.post('/auth/send-otp', data);


// For signup: pass { email, otp, name, dateOfBirth } | For signin: pass { email, otp }
export const verifyOtp = (data: { email: string; otp: string; name?: string; dateOfBirth?: string }) =>
  axiosInstance.post('/auth/verify-otp', data);

export const login = (email: string, password: string) =>
  axiosInstance.post('/auth/login', { email, password });

export const getUser = () =>
  axiosInstance.get('/auth/me');

// Notes endpoints
export const createNote = (note: { title: string; content: string }) =>
  axiosInstance.post('/notes', note);

export const getNotes = () =>
  axiosInstance.get('/notes');


export const updateNote = (id: string, note: { title?: string; content?: string }) =>
  axiosInstance.put(`/notes/${id}`, note);

export const deleteNote = (id: string) =>
  axiosInstance.delete(`/notes/${id}`);

export default axiosInstance;
