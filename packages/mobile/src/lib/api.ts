import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  verifyPhone: (data: any) => api.post("/auth/verify-phone", data),
  login: (data: any) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Jobs
export const jobsApi = {
  getNearby: (params: any) => api.get("/jobs/nearby", { params }),
  getMyJobs: () => api.get("/jobs/my-posts"),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post("/jobs", data),
  cancel: (id: string) => api.post(`/jobs/${id}/cancel`),
  complete: (id: string) => api.post(`/jobs/${id}/complete`),
};

// Bids
export const bidsApi = {
  create: (jobId: string, data: any) => api.post(`/bids/jobs/${jobId}/bids`, data),
  getJobBids: (jobId: string) => api.get(`/bids/jobs/${jobId}/bids`),
  accept: (id: string) => api.post(`/bids/${id}/accept`),
  withdraw: (id: string) => api.post(`/bids/${id}/withdraw`),
};

// Credits
export const creditsApi = {
  getBalance: () => api.get("/credits/balance"),
  getTransactions: () => api.get("/credits/transactions"),
  purchase: (data: any) => api.post("/credits/purchase", data),
  calculateBidCost: (jobId: string) => api.get(`/credits/calculate-bid-cost/${jobId}`),
};

// Wallet
export const walletApi = {
  getWallet: () => api.get("/wallet"),
  getTransactions: () => api.get("/wallet/transactions"),
  requestPayout: (data: any) => api.post("/wallet/payout", data),
};

// Ratings
export const ratingsApi = {
  create: (jobId: string, data: any) => api.post(`/ratings/jobs/${jobId}/rate`, data),
  getReceived: () => api.get("/ratings/received"),
};

// Messages
export const messagesApi = {
  getMessages: (jobId: string) => api.get(`/messages/jobs/${jobId}/messages`),
  sendMessage: (jobId: string, data: any) => api.post(`/messages/jobs/${jobId}/messages`, data),
};

