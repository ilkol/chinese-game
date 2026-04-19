import React from 'react';
import { motion } from 'framer-motion';

const IntroView = ({ onFinish }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden"
		>
			<video
				autoPlay
				playsInline
				muted={false} // Если нужен звук, оставляем false
				disablePictureInPicture // Блокирует режим "картинка в картинке"
				disableRemotePlayback // Блокирует трансляцию (AirPlay/Cast)
				// Блокируем правый клик и долгое нажатие (скачивание/пауза)
				onContextMenu={(e) => e.preventDefault()}
				className="w-full h-full object-contain pointer-events-none"
				onEnded={onFinish}
			>
				<source src="/intro.mp4" type="video/mp4" />
			</video>

			{/* Кнопка "Пропустить" — единственный разрешенный способ взаимодействия */}
			<button
				onClick={onFinish}
				className="absolute bottom-10 right-10 z-[110] px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-bold tracking-widest uppercase transition-all"
			>
				Пропустить →
			</button>

			{/* Невидимый слой поверх видео для блокировки кликов/пауз */}
			<div className="absolute inset-0 z-[105] pointer-events-auto bg-transparent"
				onContextMenu={(e) => e.preventDefault()} />
		</motion.div>
	);
};

export default IntroView;
