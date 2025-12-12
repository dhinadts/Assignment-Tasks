import axios from 'axios';

const api = axios.create({
  baseURL: 'https://assignment-tasks.onrender.com'
});

export default api;
