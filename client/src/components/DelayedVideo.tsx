import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
	src: string;
	muted?: boolean;
	delay?: number;
}

const DelayedVideo = ({ src, muted = false, delay = 400 }: Props) => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsReady(true), delay);
		return () => {
			clearTimeout(timer);
			setIsReady(false);
		};
	}, [src, delay]);

	return (
		<AnimatePresence>
			{isReady && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 z-0 w-full h-full overflow-hidden"
				>
					<video
						autoPlay
						muted={muted}
						loop
						playsInline
						className="w-full h-full object-cover"
					>
						<source src={src} type="video/mp4" />
					</video>
					<div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default DelayedVideo;