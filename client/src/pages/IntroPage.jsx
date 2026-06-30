import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const IntroView = ({ onFinish }) => {
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isVisible, setIsVisible] = useState(true);
	const timeoutRef = useRef(null);

	const resetControlTimeout = () => {
		setIsVisible(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		if (isPlaying) {
			timeoutRef.current = setTimeout(() => {
				setIsVisible(false);
			}, 1000); 
		}
	};

	useEffect(() => {
		resetControlTimeout();
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [isPlaying]);

	const togglePlay = (e) => {
		e.stopPropagation();
		if (!videoRef.current) return;
		
		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play().catch((err) => console.log("Playback blocked:", err));
		}
		setIsPlaying(!isPlaying);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onMouseMove={resetControlTimeout}
			className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden select-none cursor-none"
			style={{ cursor: isVisible ? 'default' : 'none' }} // Прячем курсор вместе с кнопками
		>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={false}
				disablePictureInPicture
				disableRemotePlayback
				onContextMenu={(e) => e.preventDefault()}
				className="w-full h-full object-contain pointer-events-none"
				onEnded={onFinish}
			>
				<source src="/intro.mp4" type="video/mp4" />
			</video>

			<div 
				className="absolute inset-0 z-[105]"
				onClick={resetControlTimeout}
				onContextMenu={(e) => e.preventDefault()}
			/>

			<AnimatePresence>
				{isVisible && (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 z-[110] flex items-center justify-center pointer-events-none"
					>
						
						<motion.button
							onClick={togglePlay}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="pointer-events-auto flex items-center justify-center w-20 h-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-colors shadow-2xl focus:outline-none"
						>
							<AnimatePresence mode="wait" initial={false}>
								<motion.div
									key={isPlaying ? 'pause' : 'play'}
									initial={{ opacity: 0, scale: 0.6, rotate: isPlaying ? -45 : 45 }}
									animate={{ opacity: 1, scale: 1, rotate: 0 }}
									exit={{ opacity: 0, scale: 0.6, rotate: isPlaying ? 45 : -45 }}
									transition={{ duration: 0.2 }}
								>
									{isPlaying ? (
										<Pause size={32} fill="currentColor" />
									) : (
										<Play size={32} fill="currentColor" className="ml-1" />
									)}
								</motion.div>
							</AnimatePresence>
						</motion.button>

						<button
							onClick={onFinish}
							className="absolute bottom-10 right-10 pointer-events-auto px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-bold tracking-widest uppercase transition-all"
						>
							Пропустить →
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default IntroView;
