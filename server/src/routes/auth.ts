import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { CONFIG } from '../config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		const { username, password, role } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword, role });
		await user.save();
		const token = jwt.sign({ userId: user._id, role: user.role }, CONFIG.JWT_SECRET);
		res.json({ token, username: user.username, role: user.role, progress: user.progress });
	} catch (e) {
		res.status(400).json({ error: 'Имя пользователя уже занято' });
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ error: 'Неверные данные' });
	}
	const token = jwt.sign({ userId: user._id, role: user.role }, CONFIG.JWT_SECRET);
	res.json({ token, username: user.username, role: user.role, progress: user.progress });
});

export default router;
