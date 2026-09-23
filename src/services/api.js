import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pokeproject-w3n2.onrender.com',
});

export default api;