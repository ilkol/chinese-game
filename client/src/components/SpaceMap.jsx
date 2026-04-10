import { motion, animate, useMotionValue } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Target } from 'lucide-react';
import spaceBg from '../assets/space.webp';

const SpaceMap = ({ levels, onSelectLevel, lastUnlockedId = 1 }) => {
	const [scale, setScale] = useState(0.7);
	const containerRef = useRef(null);

	// Прямое управление координатами
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const planets = levels.map((level, index) => ({
		...level,
		x: index % 2 === 0 ? -70 : 70,
		y: index * 300 + 150,
	}));

	const focusOnPlanet = (planetId) => {
		const planet = planets.find(p => p.id === planetId);
		if (!planet) return;

		const targetScale = 1.0;
		const targetX = -planet.x;
		const targetY = -planet.y + (window.innerHeight / 2);

		animate(x, targetX, { type: 'spring', stiffness: 35, damping: 15 });
		animate(y, targetY, { type: 'spring', stiffness: 35, damping: 15 });

		animate(scale, targetScale, {
			type: 'spring', stiffness: 35, damping: 15,
			onUpdate: (latest) => setScale(latest)
		});
	};

	useEffect(() => {
		const timer = setTimeout(() => focusOnPlanet(lastUnlockedId), 100);
		return () => clearTimeout(timer);
	}, []);

	const handleWheel = (e) => {
		const delta = e.deltaY > 0 ? -0.05 : 0.05;
		setScale((prev) => Math.min(Math.max(prev + delta, 0.4), 1.2));
	};

	return (
		<div
			ref={containerRef}
			onWheel={handleWheel}
			// Поменяли items-center на items-start, чтобы карта не прыгала в середину
			className="fixed inset-0 bg-[#020617] overflow-hidden touch-none flex items-start justify-center"
		>
			{/* Фон */}
			<div className="fixed inset-0 z-0 bg-[#020617]" style={{
				backgroundImage: `url(${spaceBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
				transform: `scale(${1.1 + (scale * 0.1)})`, opacity: 0.5, transition: 'transform 0.1s ease-out'
			}} />

			{/* СЛОЙ 1: МАСШТАБ (Теперь items-start, чтобы точка отсчета была сверху) */}
			<motion.div
				style={{ scale }}
				className="w-full h-full flex items-start justify-center pointer-events-none"
			>
				{/* СЛОЙ 2: ПЕРЕМЕЩЕНИЕ */}
				<motion.div
					drag
					style={{ x, y }}
					dragConstraints={{ top: -3500, bottom: 500, left: -500, right: 500 }}
					dragElastic={0.1}
					onPointerDown={() => {
						x.stop();
						y.stop();
					}}
					// Добавили originY: 0, чтобы внутри зум-слоя карта росла сверху вниз
					className="relative w-[1000px] h-[4000px] cursor-grab active:cursor-grabbing flex justify-center z-10 pointer-events-auto origin-top"
				>
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						{planets.length > 0 && (
							<path
								d={`M ${500 + planets[0].x} ${planets[0].y + 60} ` +
									planets.slice(1).map(p => `L ${500 + p.x} ${p.y + 60}`).join(' ')}
								fill="none" stroke="white" strokeWidth="3" strokeDasharray="10 15" className="opacity-20"
							/>
						)}
					</svg>

					{planets.map((planet) => (
						<motion.div key={planet.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
							onClick={() => onSelectLevel(planet)}
							className="absolute flex flex-col items-center"
							style={{ left: 500 + planet.x - 64, top: planet.y }}
						>
							<div className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-5xl bg-gradient-to-br ${planet.color} border-4 border-white/20 backdrop-blur-sm`}>
								{planet.icon}
							</div>
							<div className="mt-4 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-2 rounded-2xl text-white font-bold whitespace-nowrap shadow-xl">
								{planet.title}
							</div>
						</motion.div>
					))}
				</motion.div>
			</motion.div>

			{/* Оверлей управления */}
			<div className="absolute bottom-10 right-10 flex flex-col gap-4 z-20">
				<button onClick={() => focusOnPlanet(lastUnlockedId)} className="w-14 h-14 bg-blue-600 border border-blue-400 rounded-full text-white flex items-center justify-center shadow-2xl hover:bg-blue-500 active:scale-90 transition-all">
					<Target size={28} />
				</button>
				<div className="h-[1px] bg-white/10 my-1" />
				<button onClick={() => setScale(s => Math.min(s + 0.1, 1.2))} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-3xl hover:bg-white/20 transition-all">+</button>
				<button onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-3xl hover:bg-white/20 transition-all">−</button>
			</div>
		</div>
	);
};

export default SpaceMap;
