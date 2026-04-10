import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import type { Level } from './types.js';

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

app.listen(PORT, () => {
    console.log(`🚀 TS-Сервер запущен на http://localhost:${PORT}`);
});
