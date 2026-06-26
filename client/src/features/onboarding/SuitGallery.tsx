import { motion } from 'framer-motion';


import suit1 from '../../assets/spacesuit/1.png';
import suit2 from '../../assets/spacesuit/2.png';
import suit3 from '../../assets/spacesuit/3.png';
import suit4 from '../../assets/spacesuit/4.png';
import suit5 from '../../assets/spacesuit/5.png';
import suit6 from '../../assets/spacesuit/6.png';


const suits = [suit1, suit2, suit3, suit4, suit5, suit6];

const getSuitStyles = (index: number) => {
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

export default SuitGallery;