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
		showCoins: true
	},
	{
		id: 4,
		text: "Чтобы найти мою семью, нам нужна звёздная карта. Сейчас она разбита на кусочки, и нам нужно их собрать.",
		speaker: "Сяо Син",
		emotion: null,
		bg: "bg-[#0d1540]",
		video: "/map_preview.mp4" // Путь к видео в папке public
	},
	{
		id: 5,
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
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Включаем видео с задержкой, чтобы монеты успели уйти
		const timer = setTimeout(() => setIsReady(true), 400);
		return () => {
			clearTimeout(timer);
			setIsReady(false);
		};
	}, [src]);

	return (
		<AnimatePresence>
			{isReady && (
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
			)}
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
