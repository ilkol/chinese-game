import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import type { Level } from './types.js';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

interface StatusResponse {
    status: string;
    message: string;
    time: string;
}

app.get('/api/status', (req: Request, res: Response<StatusResponse>) => {
    res.json({
        status: 'ok',
        message: 'Сервер на TypeScript запущен!',
        time: new Date().toLocaleTimeString()
    });
});

app.get('/api/levels', async (req, res) => {
	const dataPath = path.join(process.cwd(), 'data', 'levels.json');
	const fileContent = fs.readFile(dataPath, 'utf8', (err, data) => {
		if (err) {
			res.status(500).json({ error: 'Не удалось загрузить уровни' });
		}
		const levels: Level[] = JSON.parse(data);
		res.json(levels);
	});
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chinese_game')
  .then(() => console.log('📦 MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`🚀 TS-Сервер запущен на http://localhost:${PORT}`);
});
