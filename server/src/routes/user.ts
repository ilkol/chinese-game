import express from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';

const router = express.Router();

// Middleware для проверки токена
const authenticate = (req: any, res: any, next: any) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).send('Unauthorized');

	jwt.verify(token, CONFIG.JWT_SECRET || 'secret', (err: any, decoded: any) => {
		if (err) return res.status(401).send('Invalid token');
		req.userId = decoded.userId;
		next();
	});
};

router.post('/progress', authenticate, async (req: any, res) => {
	const { levelId, stepId } = req.body;
	const user = await User.findById(req.userId);

	if (user) {
		// Получаем текущий прогресс планеты или создаем пустой шаблон
		const levelKey = levelId.toString();
		let levelProgress = user.progress.get(levelKey) || { theory: false, quizzes: [], final: false };

		// Обновляем конкретный шаг
		if (stepId === 'theory') levelProgress.theory = true;
		if (stepId === 'final') levelProgress.final = true;
		if (stepId.startsWith('quiz-')) {
			const index = parseInt(stepId.split('-')[1]);
			levelProgress.quizzes[index] = true;
		}

		user.progress.set(levelKey, levelProgress);
		await user.save();
		res.json({ success: true, progress: user.progress });
	}
});

export default router;
