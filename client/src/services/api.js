import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getLevels = async () => {
	try {
		const response = await axios.get(`${API_URL}/levels`);
		return response.data;
	} catch (error) {
		console.error("Ошибка при загрузке уровней:", error);
		throw error;
	}
};
