import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import coinImg from '../../assets/cosmoney.png';

const GoldRain = () => {
	const [coins, setCoins] = useState<{
		id: number; x: number; delay: number;
		duration: number; size: number; blur: number;
	}[]>([]);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			setCoins(Array.from({ length: 25 }).map((_, i) => ({
				id: i,
				x: Math.random() * 100,
				delay: Math.random() * 5,
				duration: Math.random() * 2 + 3,
				size: Math.random() * 100 + 15,
				blur: Math.random() * 1.5,
			})));
		});
		return () => cancelAnimationFrame(frame);
	}, []);

	if (coins.length === 0) return null;

	return (
		<div className="absolute inset-0 w-full pointer-events-none overflow-hidden z-0">
			{coins.map(coin => (
				<motion.img
					key={coin.id}
					src={coinImg}
					initial={{ y: -100, left: `${coin.x}%`, opacity: 0 }}
					animate={{ y: '115vh', rotate: 360, rotateY: 720, opacity: [0, 1, 1, 0] }}
					transition={{ duration: coin.duration, repeat: Infinity, delay: coin.delay, ease: 'linear' }}
					style={{ width: `${coin.size}px`, filter: `blur(${coin.blur}px)`, position: 'absolute' }}
				/>
			))}
		</div>
	);
};

export default GoldRain;