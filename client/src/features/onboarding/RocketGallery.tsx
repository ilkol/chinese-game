import { motion } from 'framer-motion';

import rocket1 from '../../assets/rocket/1.png';
import rocket2 from '../../assets/rocket/2.png';
import rocket3 from '../../assets/rocket/3.png';
import rocket4 from '../../assets/rocket/4.png';
import rocket5 from '../../assets/rocket/5.png';
import rocket6 from '../../assets/rocket/6.png';


const rockets = [rocket1, rocket2, rocket3, rocket4, rocket5, rocket6];

const getRocketStyles = (index: number) => {
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

export default RocketGallery;