import axios from 'axios';
import type { Conversation, Message, Contact, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/api/auth/login', credentials);
  return res.data;
};

export const register = async (credentials: RegisterCredentials): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>('/api/auth/register', credentials);
  return res.data;
};

// Message endpoints
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await api.get<Conversation[]>('/api/messages/conversations');
  return res.data;
};

export const getMessagesByUser = async (wa_id: string): Promise<Message[]> => {
  const res = await api.get<Message[]>(`/api/messages/${wa_id}`);
  return res.data;
};

export const sendMessage = async (msg: { to: string; text: string }): Promise<Message> => {
  const res = await api.post<Message>('/api/messages', msg);
  return res.data;
};

export const searchUserByPhone = async (phone: string): Promise<Contact> => {
  const res = await api.get<Contact>(`/api/auth/search?phone=${encodeURIComponent(phone)}`);
  return res.data;
};