// src/api/members.js
import axios from 'axios';

const API_URL = 'https://json-server-git-main-rks-projects-29f40e45.vercel.app';

export const fetchMembers = async () => {
  const response = await axios.get(`${API_URL}/members`);
  return response.data;
};

export const fetchDeleteHistory = async () => {
  const response = await axios.get(`${API_URL}/deleteHistory`);
  return response.data;
};

export const addMember = async (member) => {
  const response = await axios.post(`${API_URL}/members`, member);
  return response.data;
};

export const updateMember = async (id, member) => {
  const response = await axios.put(`${API_URL}/members/${id}`, member);
  return response.data;
};

export const deleteMember = async (id, member) => {
  await axios.delete(`${API_URL}/members/${id}`);
  const deletionDate = new Date().toLocaleString();
  await axios.post(`${API_URL}/deleteHistory`, { ...member, deletionDate });
};

export const restoreMember = async (index, member) => {
  await axios.post(`${API_URL}/members`, member);
  await axios.delete(`${API_URL}/deleteHistory/${index + 1}`);
};