import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Change this to your Node.js API base URL
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export default api;