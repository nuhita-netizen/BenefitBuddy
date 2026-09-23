import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitUserForm = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const checkEligibility = async (userId) => {
  try {
    const response = await api.post(`/eligibility/check/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking eligibility:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getInsurancePlans = async () => {
  const response = await api.get('/insurance');
  return response.data;
};

export const askGemini = async (question, user, scheme) => {
  const response = await api.post('/ask-gemini', { question, user, scheme });
  return response.data;
};
