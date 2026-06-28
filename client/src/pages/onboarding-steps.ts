import type { DialogStep } from '../features/dialog/DialogEngine';

import pandaWaving from '/assets/chars/sao-sin/waving.png';
import pandaProud from '/assets/chars/sao-sin/proud.png';
import pandaExcited from '/assets/chars/sao-sin/excited.png';
import pandaHappy from '/assets/chars/sao-sin/happy.png';

export interface OnboardingStep extends DialogStep {
	bgClass?: string;
	showCoins?: boolean;
	showShop?: boolean;
	showRockets?: boolean;
	video?: { src: string; muted?: boolean };
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
	{
		id: 1,
		text: "Привет, путешественник! Это я — Сяо Син. Спасибо, что решил помочь мне найти других панд.",
		speaker: "Сяо Син",
		emotion: pandaWaving,
		bg: 'blue',
		bgClass: 'bg-[#020617]',
	},
	{
		id: 2,
		text: "Вместе мы будем лететь по планетам и учить китайский язык. На каждой планете тебя ждут весёлые задания!",
		speaker: "Сяо Син",
		emotion: pandaExcited,
		bg: 'blue',
		bgClass: 'bg-[#050b24]',
	},
	{
		id: 3,
		text: "Знакомься, это Космани — самая ценная валюта в галактике! Проходи тренировки на отлично, и монеты посыплются звёздным дождём!",
		speaker: "Сяо Син",
		emotion: pandaProud,
		bg: 'blue',
		bgClass: 'bg-[#0a1033]',
		showCoins: true,
	},
	{
		id: 4,
		text: "Накопил достаточно Космани? Время в Космический Магазин! Там можно купить крутейшие скафандры.",
		speaker: "Сяо Син",
		emotion: pandaProud,
		bg: 'blue',
		bgClass: 'bg-[#0a1033]',
		showShop: true,
	},
	{
		id: 5,
		text: "Или улучшения для ракеты: сделай её мощнее, быстрее и добавь новые крутые отсеки.",
		speaker: "Сяо Син",
		bg: 'blue',
		bgClass: 'bg-[#0a1033]',
		showRockets: true,
	},
	{
		id: 6,
		text: "Чтобы найти других панд, нам нужна звёздная карта. Сейчас она разбита на кусочки — нам нужно их собрать.",
		speaker: "Сяо Син",
		bg: 'blue',
		bgClass: 'bg-[#0d1540]',
		video: { src: '/map_preview.mp4', muted: true },
	},
	{
		id: 7,
		text: "Ну что, командир? Начинаем наше приключение! Я верю в тебя. Полетели! 🚀",
		speaker: "Сяо Син",
		emotion: pandaHappy,
		bg: 'blue',
		bgClass: 'bg-[#111a4d]',
	},
];