import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue;

	if (!value) {
		throw new Error(`❌ Ошибка: Переменная окружения ${key} не задана в файле .env`);
	}

	return value;
};

export const CONFIG = {
	PORT: getEnv('PORT', '5000'),
	JWT_SECRET: getEnv('JWT_SECRET'), // Здесь упадет с ошибкой, если в .env пусто
	MONGO_URI: getEnv('MONGO_URI'),
	IS_PROD: process.env.NODE_ENV === 'production'
};
