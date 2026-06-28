import { motion, animate, useMotionValue, useTransform } from 'framer-motion'; // Добавили useTransform
import { useRef, useEffect, useState } from 'react';
import { Target, LogOut, QrCode, X, ArrowRight, Lock } from 'lucide-react';
import spaceBg from '/assets/space.webp';
import { Html5QrcodeScanner } from 'html5-qrcode';
import * as api from '../../services/api';
/*
inteface Props {
	completedLevelIds: number[];
}
*/

const SpaceMap = ({ levels, onSelectLevel, activePlanetId, isLanding, completedLevelIds }) => {
	const containerRef = useRef(null);

	const scale = useMotionValue(0.7);
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const backgroundScale = useTransform(scale, [0.4, 1.2], [1.1, 1.3]);

	const planets = levels.map((level, index) => ({
		...level,
		x: index % 2 === 0 ? -70 : 70,
		y: index * 300 + 150,
	}));

	const focusOnPlanet = (planetId, customScale = 1.0) => {
		const planet = planets.find(p => p.id === planetId);
		if (!planet) return;

		animate(x, -planet.x, { type: 'spring', stiffness: 35, damping: 15 });
		animate(y, -planet.y + (window.innerHeight / 2), { type: 'spring', stiffness: 35, damping: 15 });
		animate(scale, customScale, { type: 'spring', stiffness: 35, damping: 15 });
	};
	// const focusOnPlanet = (planetId, customScale = 1.0) => {
	// 	const planet = planets.find(p => p.id === planetId);
	// 	if (!planet) return;

	// 	const centerX = window.innerWidth / 2;
	// 	const centerY = window.innerHeight / 2;

	// 	animate(x, centerX - (500 + planet.x), { type: 'spring', stiffness: 35, damping: 15 });
	// 	animate(y, centerY - planet.y, { type: 'spring', stiffness: 35, damping: 15 });
	// 	animate(scale, customScale, { type: 'spring', stiffness: 35, damping: 15 });
	// };

	useEffect(() => {
		if (activePlanetId) {
			const targetScale = isLanding ? 4.0 : 1.3;
			focusOnPlanet(activePlanetId, targetScale);
		} else {
			focusOnPlanet(1, 0.7);
		}
	}, [activePlanetId, isLanding]);

	const handleWheel = (e) => {
		const delta = e.deltaY > 0 ? -0.05 : 0.05;
		const currentScale = scale.get();
		scale.set(Math.min(Math.max(currentScale + delta, 0.4), 1.2));
	};

	const [isScannerOpen, setIsScannerOpen] = useState(false);

	useEffect(() => {
		if (isScannerOpen) {
			const scanner = new Html5QrcodeScanner("reader", {
				fps: 10,
				qrbox: { width: 250, height: 250 },
			});

			scanner.render(async (decodedText) => {
				try {
					setError("");
					await api.joinStudentToTeacher(decodedText)
					setIsScannerOpen(false);
					scanner.clear();
				} catch (e) {
					setError("Неверный QR-код или ошибка сервера");
				}
			}, (error) => {

			});

			return () => scanner.clear();
		}
	}, [isScannerOpen]);

	const [manualCode, setManualCode] = useState("");

	const handleJoin = async (code) => {
		if (!code) return;
		try {
			setError("");
			await api.joinStudentToTeacher(code)
			setIsScannerOpen(false);
			setManualCode("");
		} catch (e) {
			setError("Код не найден. Проверьте символы.");
		}

	};
	const [error, setError] = useState("");

	return (
		<div
			ref={containerRef}
			onWheel={handleWheel}
			className="fixed inset-0 bg-[#020617] overflow-hidden touch-none flex items-start justify-center"
		>
			{/* ФОН с защитой от рамок */}
			<motion.div
				className="fixed inset-0 z-0 bg-[#020617]" // Темно-синий/черный цвет космоса
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.5 }} // Твоя текущая прозрачность
				transition={{ duration: 1 }} // Картинка плавно "проявится"
				style={{
					backgroundImage: `url(${spaceBg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					scale: backgroundScale
				}}
			/>

			{/* СЛОЙ 1: МАСШТАБ */}
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
						scale.stop();
					}}
					className="relative w-[1000px] h-[4000px] cursor-grab active:cursor-grabbing flex justify-center z-10 pointer-events-auto origin-top"
				>
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						{planets.length > 0 && (
							<path
								d={`M ${500 + planets[0].x} ${planets[0].y + 60} ` +
									planets.slice(1).map(p => `L ${500 + p.x} ${p.y + 60}`).join(' ')}
								fill="none" stroke="white" strokeWidth="3" strokeDasharray="10 15" className="opacity-20" />
						)}
					</svg>

					{planets.map((planet, index) => {
						const isUnlocked = index === 0 || (completedLevelIds && completedLevelIds.includes(planets[index - 1].id));
						return (
							<motion.div key={planet.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
								onClick={() => isUnlocked ? onSelectLevel(planet) : null}
								className="absolute flex flex-col items-center"
								style={{ left: 500 + planet.x - 64, top: planet.y }}
							>
								{/* Контейнер планеты (теперь замок находится прямо внутри него) */}
								<div
									className="relative w-40 h-40 rounded-full shadow-xl flex items-center justify-center text-5xl overflow-hidden"
									style={{ backgroundImage: `url(/assets/planets/${planet.planet_img_src}.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
								>
									{/* Блокировка применяется строго к кругу планеты */}
									{!isUnlocked && (
										<div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-full">
											<Lock size={32} className="text-white/60" />
										</div>
									)}
								</div>

								{/* Название планеты (вынесено за пределы зоны блокировки) */}
								<div className="mt-1 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-2 rounded-2xl text-white font-bold whitespace-nowrap shadow-xl">
									{planet.title}
								</div>
							</motion.div>
						)
					})}
				</motion.div>
			</motion.div>

			{/* Оверлей управления */}
			<div className="absolute bottom-10 right-10 flex flex-col gap-4 z-20">
				<button
					onClick={() => setIsScannerOpen(true)}
					className="w-14 h-14 bg-purple-600 border border-purple-400 rounded-full text-white flex items-center justify-center shadow-2xl hover:bg-purple-500 active:scale-90 transition-all"
					title="Сканировать код"
				>
					<QrCode size={28} />
				</button>

				<button onClick={() => focusOnPlanet(activePlanetId || 1)} className="w-14 h-14 bg-blue-600 border border-blue-400 rounded-full text-white flex items-center justify-center shadow-2xl hover:bg-blue-500 active:scale-90 transition-all">
					<Target size={28} />
				</button>
				<div className="h-[1px] bg-white/10 my-1" />
				<button onClick={() => scale.set(Math.min(scale.get() + 0.1, 1.2))} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-3xl hover:bg-white/20 transition-all">+</button>
				<button onClick={() => scale.set(Math.max(scale.get() - 0.1, 0.4))} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-3xl hover:bg-white/20 transition-all">−</button>
				<button
					onClick={() => {
						localStorage.clear();
						window.location.reload();
					}}
					className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white flex items-center justify-center hover:bg-red-500/20 transition-all shadow-2xl"
					title="Выйти"
				>
					<LogOut size={24} />
				</button>
			</div>

			{isScannerOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
					<div className="bg-slate-900 border border-white/20 p-6 rounded-[32px] w-full max-w-sm relative shadow-2xl">
						{/* Кнопка закрытия */}
						<button
							onClick={() => setIsScannerOpen(false)}
							className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
						>
							<X size={24} />
						</button>

						<h2 className="text-white text-xl font-bold mb-6 text-center">Вход в класс</h2>

						{/* Область сканера */}
						<div id="reader" className="overflow-hidden rounded-2xl bg-black border border-white/10 mb-6"></div>

						{/* Разделитель */}
						<div className="flex items-center gap-4 mb-6">
							<div className="h-[1px] flex-1 bg-white/10"></div>
							<span className="text-white/30 text-xs font-bold uppercase tracking-widest">или введите код</span>
							<div className="h-[1px] flex-1 bg-white/10"></div>
						</div>

						<div className="h-6 mb-2 flex items-center justify-center">
							{error && (
								<motion.span
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="text-red-400 text-[10px] uppercase font-black bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 tracking-wider"
								>
									{error}
								</motion.span>
							)}
						</div>

						{/* Ручной ввод с анимацией тряски */}
						<motion.div
							animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
							transition={{ duration: 0.4 }}
							className="relative group"
						>
							<input
								type="text"
								value={manualCode}
								onChange={(e) => {
									setManualCode(e.target.value);
									if (error) setError("");
								}}
								placeholder="Код"
								className={`w-full bg-white/5 border ${error ? 'border-red-500/40 shadow-[0_0_15px_rgba(248,113,113,0.1)]' : 'border-white/10'} rounded-2xl py-4 px-6 text-white text-center text-xl font-black tracking-[0.2em] focus:outline-none focus:border-purple-500/50 transition-all placeholder:tracking-normal placeholder:font-medium`}
							/>
							{manualCode.length > 0 && (
								<button
									onClick={() => handleJoin(manualCode)}
									className="absolute right-2 top-2 bottom-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all flex items-center justify-center"
								>
									<ArrowRight size={20} />
								</button>
							)}
						</motion.div>

						<p className="mt-6 text-center text-slate-500 text-[10px] uppercase font-bold tracking-wider">
							Спросите код у вашего учителя
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default SpaceMap;
