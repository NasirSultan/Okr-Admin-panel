import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

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
