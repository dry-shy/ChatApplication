import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  searchUsers: (query) => api.get('/auth/search', { params: { query } }),
  getOnlineUsers: () => api.get('/auth/online-users'),
}

export const messageAPI = {
  sendMessage: (data) => api.post('/messages/send', data),
  getMessages: (receiverId, page = 1) =>
    api.get('/messages/get', { params: { receiverId, page } }),
  markAsRead: (messageId) => api.post('/messages/mark-read', { messageId }),
  markAsSeen: (messageId) => api.post('/messages/mark-seen', { messageId }),
  getConversations: () => api.get('/messages/conversations'),
  deleteMessage: (messageId) => api.delete('/messages/delete', { data: { messageId } }),
}

export default api
