import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const API = axios.create({
	baseURL: API_URL,
});
API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


export const getLevels = () => API.get('/level').then(res => res.data);
export const getLevel = (id) => API.get(`/level/${id}`).then(res => res.data);
export const loginUser = (credentials) => API.post('/auth/login', credentials).then(res => res.data);
export const registerUser = (credentials) => API.post('/auth/register', credentials).then(res => res.data);
export const saveUserProgress = (levelId, stepId) => 
  API.post('/progress', { levelId, stepId }).then(res => res.data);

export const getStudentsProgress = () => API.post('/user/getStudents').then(res => res.data);

export default API;