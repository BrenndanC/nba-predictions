import axios from 'axios';

const API_URL = 'https://api.example.com';

export const getUser = (userId) => {
  return axios.get(`${API_URL}/users/${userId}`);
};

export const createUser = (userData) => {
  return axios.post(`${API_URL}/users`, userData);
};