import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function getSubscriptionDashboard() {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/dashboard`);
  return response.data;
}