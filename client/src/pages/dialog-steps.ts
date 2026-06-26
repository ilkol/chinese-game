import type { DialogStep } from '../features/dialog/DialogEngine';

import greatingChar from '/assets/chars/lun-lun/greatings.png';
import shyChar from '/assets/chars/lun-lun/shy.png';
import calmChar from '/assets/chars/lun-lun/calm.png';
import loveChar from '/assets/chars/lun-lun/love.png';
import pandaExcited from '../assets/excited.png';

export const DIALOG_STEPS: DialogStep[] = [
	{
		id: 1,
		text: "Привет-привет! Я Лун Лун – твой проводник в волшебный мир китайского языка. Ты готов к приключениям? Тогда слушай внимательно!",
		speaker: "Лун Лун",
		emotion: greatingChar,
		bg: 'purple',
	},
	{
		id: 2,
		text: "Знаешь, в китайском языке совсем нет букв, как в русском или английском! Вместо них там живут *иероглифы* – это такие маленькие картинки-символы.",
		speaker: "Лун Лун",
		bg: 'purple',
		photo: { src: "/assets/levels/1/1.png", alt: "Иероглифы", size: "2xl" },
	},
	{
		id: 3,
		text: "Для этого придумали *пиньинь* – специальная запись с помощью знакомых букв, которая подсказывает, как читается иероглиф.",
		speaker: "Лун Лун",
		bg: 'purple',
		photo: { src: "/assets/levels/1/2.jpeg", alt: "Пиньинь", size: "md" },
	},
	{
		id: 4,
		text: "В китайском языке есть *тоны*. Один и тот же слог можно спеть по-разному, и его значение изменится!",
		speaker: "Лун Лун",
		emotion: shyChar,
		bg: 'purple',
	},
	{
		id: 5,
		text: "Давай расскажу про тона подробнее! Посмотри как я летаю на своём космическом корабле!",
		speaker: "Лун Лун",
		emotion: calmChar,
		bg: 'purple',
	},
	{
		id: 6,
		speaker: "Лун Лун",
		text: "Первый тон – ровный и высокий, как будто ты поёшь одну ноту!",
		video: { src: "/assets/levels/1/video/1.mov" },
		bg: 'purple',
	},
	{
		id: 7,
		speaker: "Лун Лун",
		text: "Второй тон – голос идёт вверх, как при удивлении!",
		video: { src: "/assets/levels/1/video/2.mov" },
		bg: 'purple',
	},
	{
		id: 8,
		speaker: "Лун Лун",
		text: "Третий тон – голос сначала опускается, потом поднимается!",
		video: { src: "/assets/levels/1/video/3.mov" },
		bg: 'purple',
	},
	{
		id: 9,
		speaker: "Лун Лун",
		text: "Четвёртый тон – резко падает вниз, как когда мы сердимся!",
		video: { src: "/assets/levels/1/video/4.mov" },
		bg: 'purple',
	},
	{
		id: 10,
		speaker: "Лун Лун",
		text: "А вот как все четыре тона выглядят вместе:",
		video: { src: "/assets/levels/1/video/5.mp4" },
		bg: 'purple',
	},
	{
		id: 11,
		speaker: "Лун Лун",
		text: "Теперь познакомимся с пиньинем и тонами поближе! Сначала выучим гласные буквы. Готов? Поехали!",
		emotion: loveChar,
		bg: 'purple',
	},
	{
		id: 12,
		speaker: "Лун Лун",
		text: "Повторяй за мной!",
		video: { src: "/assets/levels/1/video/test.mov" },
		bg: 'purple',
	},
	{
		id: 13,
		speaker: "Сяо Син",
		emotion: pandaExcited,
		text: "Ты супер-ученик! Классно получилось повторить гласные буквы, а теперь давай потренируемся!",
		bg: 'blue',
	},
];