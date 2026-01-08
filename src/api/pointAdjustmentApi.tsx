import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/admin/point-adjustment`;

export const getAllPointAdjustments = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createPointAdjustment = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updatePointAdjustment = async (id, data) => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deletePointAdjustment = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
