import { useState } from 'react';
import axios from 'axios';

export const useProgress = (initialProgress) => {
	const [progress, setProgress] = useState(initialProgress);

	const saveProgress = async (levelId, stepId) => {
		const newProgress = { ...progress, [stepId]: true };
		setProgress(newProgress);

		try {
			const token = localStorage.getItem('token');
			await axios.post('http://localhost:5000/api/user/progress',
				{ levelId, stepId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch (e) {
			console.error("Ошибка сохранения прогресса", e);
		}
	};

	return { progress, saveProgress, setProgress };
};
