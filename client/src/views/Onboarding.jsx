import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pandaImg from '../assets/xiaosing.png'; // Твоя панда
import { ChevronRight } from 'lucide-react';

import coinImg from '../assets/cosmoney.png';
import pandaWaving from '../assets/waving.png';
import pandaThinking from '../assets/thinking.png';
import pandaSad from '../assets/sad.png';
import pandaProud from '../assets/proud.png';
import pandaExcited from '../assets/excited.png';
import pandaHappy from '../assets/happy.png';

import rocket1 from '../assets/rocket/1.png';
import rocket2 from '../assets/rocket/2.png';
import rocket3 from '../assets/rocket/3.png';
import rocket4 from '../assets/rocket/4.png';
import rocket5 from '../assets/rocket/5.png';
import rocket6 from '../assets/rocket/6.png';

import suit1 from '../assets/spacesuit/1.png';
import suit2 from '../assets/spacesuit/2.png';
import suit3 from '../assets/spacesuit/3.png';
import suit4 from '../assets/spacesuit/4.png';
import suit5 from '../assets/spacesuit/5.png';
import suit6 from '../assets/spacesuit/6.png';


const suits = [suit1, suit2, suit3, suit4, suit5, suit6];

const getSuitStyles = (index) => {
	const themes = [
		{ color: 'text-blue-300', glow: 'bg-blue-400/20', border: 'border-blue-400/30' },
		{ color: 'text-purple-300', glow: 'bg-purple-400/20', border: 'border-purple-400/30' },
		{ color: 'text-cyan-300', glow: 'bg-cyan-400/30', border: 'border-cyan-400/40' },
		{ color: 'text-yellow-300', glow: 'bg-yellow-400/40', border: 'border-yellow-400/50' },
		{ color: 'text-orange-400', glow: 'bg-orange-500/50', border: 'border-orange-500/60' },
		{ color: 'text-red-400', glow: 'bg-red-500/60', border: 'border-red-500/80' }
	];
	return themes[index] || themes[0];
};

const SuitGallery = () => {
	// Тройной массив гарантирует, что при смещении на одну треть
	// мы всегда будем видеть контент слева и справа без дыр
	const tripleSuits = [...suits, ...suits, ...suits];

	return (
		<div className="w-full overflow-hidden py-50 relative">
			<motion.div
				className="flex gap-6 items-center"
				// Смещаемся ровно на 1/3 ширины всего контейнера (длина одного полного набора)
				animate={{ x: ["0%", "-33.333%"] }}
				transition={{
					repeat: Infinity,
					duration: 20,
					ease: "linear"
				}}
				// "max-content" заставляет контейнер растянуться во всю длину всех 18 карточек
				style={{ width: "max-content" }}
			>
				{tripleSuits.map((src, i) => {
					const style = getSuitStyles(i % 6);
					return (
						<motion.div
							key={i}
							whileHover={{ y: -15, scale: 1.05 }}
							className="w-48 h-72 md:w-56 md:h-80 flex-shrink-0 relative group"
						>
							{/* Весь твой код витрины и изображения скафандра */}
							<div className={`absolute inset-0 rounded-[60px] border-2 ${style.border} bg-white/5 backdrop-blur-md overflow-hidden`}>
								<motion.div
									animate={{ y: [-100, 300] }}
									transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
									className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent z-0"
								/>
								<div className={`absolute inset-0 ${style.glow} opacity-30`} />
							</div>

							<div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
								<img src={src} className="w-full h-full object-contain z-10" />
								<div className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${style.color}`}>
									Model {i % 6 + 1}
								</div>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
};

const rockets = [rocket1, rocket2, rocket3, rocket4, rocket5, rocket6];

const getRocketStyles = (index) => {
	const levels = [
		{ color: 'text-blue-400', glow: 'bg-blue-500/20', border: 'border-blue-500/30', flare: 'opacity-20' },    // Ур 1
		{ color: 'text-cyan-400', glow: 'bg-cyan-500/30', border: 'border-cyan-500/40', flare: 'opacity-30' },    // Ур 2
		{ color: 'text-emerald-400', glow: 'bg-emerald-500/40', border: 'border-emerald-500/50', flare: 'opacity-40' }, // Ур 3
		{ color: 'text-purple-400', glow: 'bg-purple-500/50', border: 'border-purple-500/60', flare: 'opacity-60' }, // Ур 4
		{ color: 'text-orange-400', glow: 'bg-orange-500/60', border: 'border-orange-500/70', flare: 'opacity-80' }, // Ур 5
		{ color: 'text-red-500', glow: 'bg-red-600/70', border: 'border-red-500/80', flare: 'opacity-100 animate-pulse' } // Ур 6 - ЭПИК
	];
	return levels[index] || levels[0];
};
const RocketGallery = () => {
	return (
		<div className="w-full overflow-hidden py-50 relative">
			<motion.div
				className="flex gap-12 items-center"
				animate={{ x: [0, -1500] }}
				transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
				style={{ width: "fit-content" }}
			>
				{[...rockets, ...rockets].map((src, i) => {
					const style = getRocketStyles(i % 6);
					return (
						<motion.div
							key={i}
							whileHover={{ scale: 1.15, rotateY: 10, z: 50 }}
							className={`w-52 h-80 md:w-64 md:h-96 flex-shrink-0 relative group transition-all`}
							style={{ perspective: "1000px" }}
						>
							{/* ФОН КАРТОЧКИ: Энергетическое поле */}
							<div className={`absolute inset-0 rounded-[40px] border-2 ${style.border} bg-white/5 backdrop-blur-xl overflow-hidden`}>
								{/* Динамический свет снизу (выхлоп) */}
								<div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 ${style.glow} blur-[60px] rounded-full`} />

								{/* Декоративная сетка (как в ангаре будущего) */}
								<div className="absolute inset-0 opacity-10"
									style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
							</div>

							{/* ЭПИК ЭФФЕКТ: Вспышка за ракетой */}
							<div className={`absolute inset-0 flex items-center justify-center ${style.flare}`}>
								<div className={`w-32 h-32 ${style.glow} blur-[40px] rounded-full scale-150`} />
							</div>

							{/* САМА РАКЕТА */}
							<div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
								<img
									src={src}
									alt={`Rocket Lvl ${i % 6 + 1}`}
									className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10"
								/>

								{/* Текст уровня */}
								<div className={`mt-4 font-black uppercase italic tracking-tighter text-lg ${style.color}`}>
									LVL {i % 6 + 1}
								</div>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
};

const steps = [
	{
		id: 1,
		text: "Привет, путешественник! Это я — Сяо Син. Спасибо, что решил помочь мне найти других панд.",
		speaker: "Сяо Син",
		emotion: pandaWaving, // Машет лапкой
		bg: "bg-[#020617]"
	},
	{
		id: 2,
		text: "Вместе мы будем лететь по планетам и учить китайский язык. На каждой планете тебя ждут весёлые задания!",
		speaker: "Сяо Син",
		emotion: pandaExcited, // Радостное предвкушение
		bg: "bg-[#050b24]"
	},
	{
		id: 3,
		text: "Знакомься, это Космани — самая ценная валюта в галактике! Проходи тренировки на отлично, и монеты посыплются звёздным дождём!",
		speaker: "Сяо Син",
		emotion: pandaProud, // Гордо показывает валюту
		bg: "bg-[#0a1033]",
		showCoins: true,
	},
	{
		id: 4,
		text: "Накопил достаточно Космани? Время отправляться в Космический Магазин! Там ты можешь купить крутейшие новые скафандры",
		speaker: "Сяо Син",
		emotion: pandaProud, // Гордо показывает валюту
		bg: "bg-[#0a1033]",
		showShop: true,
	},
	{
		id: 5,
		text: "Или же улучшения для вашей ракеты: сделай её мощнее, быстрее и добавь новые крутые отсеки.",
		speaker: "Сяо Син",
		emotion: null,
		bg: "bg-[#0a1033]",
		showRockets: true
	},
	{
		id: 6,
		text: "Чтобы найти других панд, нам нужна звёздная карта. Сейчас она разбита на кусочки, и нам нужно их собрать.",
		speaker: "Сяо Син",
		emotion: null,
		bg: "bg-[#0d1540]",
		video: "/map_preview.mp4" // Путь к видео в папке public
	},
	{
		id: 7,
		text: "Ну что, командир? Начинаем наше приключение! Я верю в тебя. Полетели! 🚀",
		speaker: "Сяо Син",
		emotion: pandaHappy, // Счастливый финал
		bg: "bg-[#111a4d]"
	}
];

const GoldRain = () => {
	const [coins, setCoins] = useState([]);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			const generatedCoins = Array.from({ length: 25 }).map((_, i) => ({
				id: i,
				// Используем случайное число от 0 до 100
				x: Math.random() * 100,
				delay: Math.random() * 5,
				duration: Math.random() * 2 + 3,
				size: Math.random() * 100 + 15,
				blur: Math.random() * 1.5
			}));
			setCoins(generatedCoins);
		});
		return () => cancelAnimationFrame(frame);
	}, []);

	if (coins.length === 0) return null;

	return (
		// Добавляем w-full и left-0, чтобы контейнер не схлопывался из-за flex родителя
		<div className="absolute inset-0 w-full left-0 pointer-events-none overflow-hidden z-0">
			{coins.map((coin) => (
				<motion.img
					key={coin.id}
					src={coinImg}
					// Используем x как процент от ширины экрана
					initial={{ y: -100, left: `${coin.x}%`, opacity: 0 }}
					animate={{
						y: "115vh",
						rotate: 360,
						rotateY: 720,
						opacity: [0, 1, 1, 0]
					}}
					transition={{
						duration: coin.duration,
						repeat: Infinity,
						delay: coin.delay,
						ease: "linear"
					}}
					style={{
						width: `${coin.size}px`,
						filter: `blur(${coin.blur}px)`,
						position: 'absolute'
					}}
				/>
			))}
		</div>
	);
};

const DelayedVideo = ({ src }) => {


	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="absolute inset-0 z-0"
			>
				<video autoPlay muted loop playsInline className="w-full h-full object-contain">
					<source src={src} type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
			</motion.div>
		</AnimatePresence>
	);
};

const OnboardingView = ({ onComplete }) => {
	const [currentStep, setCurrentStep] = useState(0);


	const next = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete();
		}
	};

	return (
		<div className={`fixed inset-0 z-0 transition-colors duration-1000 ${steps[currentStep].bg} overflow-hidden`}>
			{/* 1. Слой фона (здесь будут картинки локаций) */}
			{steps[currentStep].video && <DelayedVideo src={steps[currentStep].video} />}


			{steps[currentStep].showCoins && <AnimatePresence>
				{steps[currentStep].showCoins && (
					<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
						<GoldRain />
					</motion.div>
				)}
			</AnimatePresence>}
			{/* 2. Сяо Син (Персонаж) */}
			<div className="absolute inset-0 flex items-end justify-center pb-32 pointer-events-none">
				{steps[currentStep].showRockets && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="w-full"
					>
						<RocketGallery />
					</motion.div>
				)}
				{steps[currentStep].showShop && (
					<div className="flex flex-col gap-2 w-full py-4">
						{/* Парад Ракет */}
						{/* <RocketGallery /> */}
						{/* Парад Скафандров */}
						<SuitGallery />
					</div>
				)}
				<AnimatePresence mode="popLayout">
					{/* Добавляем проверку на существование эмоции */}
					{steps[currentStep].emotion && (
						<div className="relative">

							{steps[currentStep].showCoins && (

								<>
									<div className="absolute left-1/2 -translate-x-1/2 -translate-y-[180px] w-32 h-32 bg-yellow-500/80 blur-3xl rounded-full" />
									<motion.img
										src={coinImg}
										initial={{ opacity: 0, y: -220, scale: 0 }}
										animate={{ opacity: 1, y: -220, scale: 0.8, rotateY: 360 }}
										exit={{ opacity: 0, transition: { duration: 0.2 } }} // БЫСТРЫЙ ВЫХОД
										transition={{
											duration: 0.8,
											rotateY: { repeat: Infinity, duration: 3, ease: "linear" }
										}}
										style={{ transformStyle: "preserve-3d", imageRendering: "auto" }}
										className="absolute left-1/2 -translate-x-1/2 z-20"
									/>

								</>
							)}

							<motion.img
								key={currentStep}
								src={steps[currentStep].emotion}
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 20, scale: 1.05 }}
								transition={{ duration: 0.2 }}
								className="h-[55vh] object-contain z-10"
							/>
						</div>
					)}
				</AnimatePresence>
			</div>
			{/* 3. Диалоговое окно (Interface) */}
			<div className="absolute inset-x-0 bottom-0 p-6 z-20">
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="max-w-2xl mx-auto relative"
				>
					{/* Имя говорящего */}
					<div className="absolute -top-6 left-6 bg-blue-600 text-white px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">
						{steps[currentStep].speaker}
					</div>

					{/* Плашка с текстом */}
					<div
						onClick={next}
						className="bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-[32px] p-8 pt-10 min-h-[160px] cursor-pointer hover:border-white/40 transition-all shadow-2xl"
					>
						<p className="text-white text-lg md:text-xl font-medium leading-relaxed">
							{steps[currentStep].text}
						</p>

						{/* Индикатор клика */}
						<div className="absolute  bottom-2 right-8 flex items-center gap-2 text-white/40 animate-pulse text-xs font-bold uppercase">
							Нажми, чтобы продолжить <ChevronRight size={16} />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Прогресс-бар сверху */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
				{steps.map((_, i) => (
					<div
						key={i}
						className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
					/>
				))}
			</div>
		</div>
	);
};

export default OnboardingView;
