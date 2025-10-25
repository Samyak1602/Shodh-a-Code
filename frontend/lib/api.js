import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getContest = async (contestId) => {
  const response = await api.get(`/api/contests/${contestId}`);
  return response.data;
};

export const postSubmission = async (payload) => {
  const response = await api.post('/api/submissions', payload);
  return response.data;
};

export const getSubmission = async (submissionId) => {
  const response = await api.get(`/api/submissions/${submissionId}`);
  return response.data;
};

export const getLeaderboard = async (contestId) => {
  const response = await api.get(`/api/contests/${contestId}/leaderboard`);
  return response.data;
};
