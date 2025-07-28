import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const sendOtp = (data: { email: string; name?: string; dateOfBirth?: string }) =>
  axiosInstance.post('/auth/send-otp', data);

export const verifyOtp = (data: { email: string; otp: string; name?: string; dateOfBirth?: string }) =>
  axiosInstance.post('/auth/verify-otp', data);

export const login = (email: string, password: string) =>
  axiosInstance.post('/auth/login', { email, password });

export const getUser = () =>
  axiosInstance.get('/auth/me');

export const createNote = (note: { title: string; content: string }) =>
  axiosInstance.post('/notes', note);

export const getNotes = () =>
  axiosInstance.get('/notes');

export const updateNote = (id: string, note: { title?: string; content?: string }) =>
  axiosInstance.put(`/notes/${id}`, note);

export const deleteNote = (id: string) =>
  axiosInstance.delete(`/notes/${id}`);

export default axiosInstance;
