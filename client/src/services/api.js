import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_URL,
});
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


export const getLevels = () => api.get('/levels').then(res => res.data);
export const loginUser = (credentials) => api.post('/user/login', credentials).then(res => res.data);
export const saveUserProgress = (levelId, stepId) => 
  api.post('/user/progress', { levelId, stepId }).then(res => res.data);

export default api;