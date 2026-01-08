import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const toggleBlockUser = async (id) => {
  const response = await api.patch(`/users/block-toggle/${id}`);
  return response.data;
};


export const getUserProfile = async (id) => {
  const response = await api.get(`/users/${id}/profile`);
  return response.data;
};


export const triggerWeeklyEmail = async () => {
  const response = await api.post('/mail/trigger-weekly');
  return response.data;
};


export const getWeeklyReport = async () => {
  const response = await api.get('/users/weekly-report');
  return response.data;
};


export const getWeeklyAiPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/ai-performance/weekly`);
    if (!response.ok) throw new Error("Failed to fetch AI performance");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};