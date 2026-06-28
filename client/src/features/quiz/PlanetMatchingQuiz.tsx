import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw } from 'lucide-react';

export interface MatchingPlanetPair {
	id: string;
	label: string;
	audioSrc?: string;
	imageSrc?: string;
}

interface PlanetMatchingQuizProps {
	pairs: MatchingPlanetPair[];
	pairsPerRound?: number;
	characterSrc?: string;
	backgroundSrc?: string;
	onComplete?: () => void;
}

const PLANET_COUNT = 14;
const CORRECT_PHRASES = ['Идеально! ✨', 'Супер! 🚀', 'Отлично! 🌟', 'Так держать! 💪'];
const WRONG_PHRASES = ['Не та буква! 🛸', 'Слушай внимательнее 🌙', 'Попробуй ещё раз ✨', 'Почти! 🚀'];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const jitter = (max = 16) => (Math.random() - 0.5) * max * 2;

const STARS = Array.from({ length: 60 }).map((_, i) => {
	const size = Math.random() * 2.5 + 0.5;
	return {
		id: i,
		style: {
			position: 'absolute' as const,
			width: size, height: size,
			borderRadius: '50%',
			background: '#fff',
			top: `${Math.random() * 100}%`,
			left: `${Math.random() * 100}%`,
			opacity: Math.random() * 0.7 + 0.2,
		},
	};
});

const Stars = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		{STARS.map(s => <div key={s.id} style={s.style} />)}
	</div>
);

// Назначаем уникальные картинки планет для раунда
const assignImages = (count: number): number[] => {
	const all = Array.from({ length: PLANET_COUNT }, (_, i) => i + 1);
	return all.sort(() => Math.random() - 0.5).slice(0, count * 2); // x2 — для верхнего и нижнего рядов
};

// Позиции для планет в ряду — с джиттером
const generateRowPositions = (count: number, containerWidth = 320) => {
	const slotWidth = containerWidth / count;
	const yAnchors = [20, 70, 10, 80, 40, 60]; // px — чередование вверх/вниз
	
	return Array.from({ length: count }).map((_, i) => ({
		x: slotWidth * i + slotWidth / 2 - 40 + jitter(10),
		y: yAnchors[i % yAnchors.length] + jitter(10), // якорь + небольшой джиттер
		size: 75 + Math.floor(Math.random() * 25),
	}));
};

type PlanetState = 'idle' | 'selected' | 'matched' | 'wrong';

interface PlanetProps {
	id: string;
	label?: string;
	imageSrc?: string;
	imageIndex: number;
	position: { x: number; y: number; size: number };
	state: PlanetState;
	isSound?: boolean;
	isPlaying?: boolean;
	onClick: () => void;
}

const Planet: React.FC<PlanetProps> = ({ label, imageIndex, position, state, isSound, isPlaying, imageSrc, onClick }) => {
	const glow =
		state === 'selected' ? 'drop-shadow-[0_0_20px_rgba(96,165,250,0.9)]' :
			state === 'matched' ? 'drop-shadow-[0_0_20px_rgba(52,211,153,0.9)]' :
				state === 'wrong' ? 'drop-shadow-[0_0_20px_rgba(248,113,113,0.9)]' :
					'drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]';

	return (
		<motion.button
			onClick={onClick}
			disabled={state === 'matched'}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{
				opacity: state === 'matched' ? 0 : 1,
				scale: state === 'matched' ? 0.3 : state === 'selected' ? 1.1 : 1,
				x: state === 'wrong' ? [-8, 8, -6, 6, 0] : 0,
			}}
			transition={{
				opacity: { duration: 0.4 },
				scale: { duration: 0.25 },
				x: { duration: 0.35 },
			}}
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
				width: position.size,
			}}
			className="flex flex-col items-center gap-1"
		>
			<div className={`relative transition-all ${glow}`}
				style={{ width: position.size, height: position.size }}
			>
				<img
					src={`/assets/planets/${imageIndex}.png`}
					alt={label ?? 'planet'}
					className="w-full h-full object-contain"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					{imageSrc ? (
						// Картинка черты поверх планеты
						<img
							src={imageSrc}
							alt={label}
							className="w-3/5 h-3/5 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
						/>
					) : isSound ? (
						<Volume2
							size={28}
							className={`text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] ${isPlaying ? 'animate-pulse text-blue-300' : ''}`}
						/>
					) : (
						<span className="text-white font-black text-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
							{label}
						</span>
					)}
				</div>
			</div>
		</motion.button>
	);
};

const PlanetMatchingQuiz: React.FC<PlanetMatchingQuizProps> = ({
	pairs,
	pairsPerRound = 4,
	characterSrc,
	backgroundSrc,
	onComplete,
}) => {

	const rounds = Array.from(
		{ length: Math.ceil(pairs.length / pairsPerRound) },
		(_, i) => pairs.slice(i * pairsPerRound, i * pairsPerRound + pairsPerRound)
	);

	const [roundIndex, setRoundIndex] = useState(0);
	const [finished, setFinished] = useState(false);
	const [charMsg, setCharMsg] = useState<string | null>(null);
	const [playingId, setPlayingId] = useState<string | null>(null);

	const currentRound = rounds[roundIndex];

	// Стейт выделения и совпадений
	const [selectedTop, setSelectedTop] = useState<string | null>(null);
	const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
	const [matchedIds, setMatchedIds] = useState<string[]>([]);
	const [wrongIds, setWrongIds] = useState<string[]>([]);

	// Перемешанные порядки для текущего раунда
	const [topOrder, setTopOrder] = useState(() => [...currentRound].sort(() => Math.random() - 0.5));
	const [bottomOrder, setBottomOrder] = useState(() => [...currentRound].sort(() => Math.random() - 0.5));

	// Картинки и позиции — генерируем один раз для раунда
	const [images] = useState(() => assignImages(pairsPerRound));
	const [topPositions, setTopPositions] = useState(() => generateRowPositions(pairsPerRound));
	const [bottomPositions, setBottomPositions] = useState(() => generateRowPositions(pairsPerRound));

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showBubble = useCallback((msg: string) => {
		if (charTimerRef.current) clearTimeout(charTimerRef.current);
		setCharMsg(msg);
		charTimerRef.current = setTimeout(() => setCharMsg(null), 3000);
	}, []);

	const playAudio = useCallback((id: string, src?: string) => {
		if (!src) return;
		if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
		const audio = new Audio(src);
		audioRef.current = audio;
		setPlayingId(id);
		audio.addEventListener('ended', () => setPlayingId(null));
		audio.addEventListener('error', () => setPlayingId(null));
		audio.play().catch(() => setPlayingId(null));
	}, []);

	const advanceRound = useCallback(() => {
		if (roundIndex + 1 >= rounds.length) {
			setFinished(true);
			onComplete?.();
		} else {
			const next = roundIndex + 1;
			setRoundIndex(next);
			setMatchedIds([]);
			setSelectedTop(null);
			setSelectedBottom(null);
			setWrongIds([]);
			setTopOrder([...rounds[next]].sort(() => Math.random() - 0.5));
			setBottomOrder([...rounds[next]].sort(() => Math.random() - 0.5));
			setTopPositions(generateRowPositions(pairsPerRound));
			setBottomPositions(generateRowPositions(pairsPerRound));
		}
	}, [roundIndex, rounds, onComplete, pairsPerRound]); 

	const handleTopClick = (id: string, src?: string) => {
		if (matchedIds.includes(id)) return;
		playAudio(id, src);
		setSelectedTop(id);

		if (selectedBottom) {
			checkMatch(id, selectedBottom);
		}
	};

	const handleBottomClick = (id: string) => {
		if (matchedIds.includes(id)) return;

		if (selectedTop) {
			checkMatch(selectedTop, id);
		} else {
			setSelectedBottom(id);
		}
	};

	const checkMatch = (topId: string, bottomId: string) => {
		if (topId === bottomId) {
			const newMatched = [...matchedIds, topId];
			setMatchedIds(newMatched);
			setSelectedTop(null);
			setSelectedBottom(null);
			showBubble(random(CORRECT_PHRASES));

			if (newMatched.length === currentRound.length) {
				setTimeout(advanceRound, 800);
			}
		} else {
			setWrongIds([topId, bottomId]);
			showBubble(random(WRONG_PHRASES));
			setTimeout(() => {
				setWrongIds([]);
				setSelectedTop(null);
				setSelectedBottom(null);
			}, 700);
		}
	};

	const getTopState = (id: string): PlanetState => {
		if (matchedIds.includes(id)) return 'matched';
		if (wrongIds.includes(id)) return 'wrong';
		if (selectedTop === id) return 'selected';
		return 'idle';
	};

	const getBottomState = (id: string): PlanetState => {
		if (matchedIds.includes(id)) return 'matched';
		if (wrongIds.includes(id)) return 'wrong';
		if (selectedBottom === id) return 'selected';
		return 'idle';
	};

	const totalPairs = pairs.length;
	const completedPairs = roundIndex * pairsPerRound + matchedIds.length;
	const progress = (completedPairs / totalPairs) * 100;

	return (
		<div
			className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
			style={{ background: backgroundSrc ? `url(${backgroundSrc}) center/cover no-repeat` : '#0a0a1a' }}
		>
			{!backgroundSrc && <Stars />}
			{backgroundSrc && <div className="absolute inset-0 bg-black/40" />}

			<div className="relative z-10 w-full max-w-sm px-4 py-8 flex flex-col items-center gap-10">

				{/* Прогресс */}
				{!finished && (
					<div className="w-full">
						<div className="flex justify-between text-white/40 text-xs mb-2 font-medium">
							<span>Пар найдено: {completedPairs} из {totalPairs}</span>
							<span>Раунд {roundIndex + 1} из {rounds.length}</span>
						</div>
						<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full"
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.4 }}
							/>
						</div>
					</div>
				)}

				{finished ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center gap-4 text-white text-center"
					>
						<div className="text-7xl font-black bg-gradient-to-br from-violet-300 to-blue-300 bg-clip-text text-transparent">
							{totalPairs}/{totalPairs}
						</div>
						<h2 className="text-2xl font-bold">Все пары найдены! 🌟</h2>
						<button
							onClick={() => {
								setRoundIndex(0);
								setFinished(false);
								setMatchedIds([]);
								setSelectedTop(null);
								setSelectedBottom(null);
							}}
							className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full border-2 border-violet-400/60 text-violet-200 font-semibold hover:bg-violet-500/20 transition-all"
						>
							<RotateCcw size={16} /> Повторить
						</button>
					</motion.div>
				) : (
					<>
						<p className="text-white/40 text-xs text-center -mb-6">
							{topOrder[0]?.imageSrc
								? 'Найди название для каждой черты'
								: 'Нажми на планету со звуком, затем найди букву'
							}
						</p>

						{/* Верхний ряд — звуковые планеты */}
						<div className="relative w-full h-52">
							{topOrder.map((pair, i) => (
								<Planet
									key={pair.id}
									id={pair.id}
									imageIndex={images[i]}
									position={topPositions[i]}
									state={getTopState(pair.id)}
									label={pair.label}        // ← добавить
									imageSrc={pair.imageSrc}        // ← добавить
									isSound={!pair.imageSrc}        // ← звук только если нет картинки
									isPlaying={playingId === pair.id}
									onClick={() => handleTopClick(pair.id, pair.audioSrc)}
								/>
							))}
						</div>

						{/* Разделитель */}
						<div className="w-full h-[1px] bg-white/10" />

						{/* Нижний ряд — буквенные планеты */}
						<div className="relative w-full h-52">
							{bottomOrder.map((pair, i) => (
								<Planet
									key={pair.id}
									id={pair.id}
									label={pair.label}
									imageIndex={images[pairsPerRound + i]}
									position={bottomPositions[i]}
									state={getBottomState(pair.id)}
									onClick={() => handleBottomClick(pair.id)}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{/* Пузырь персонажа */}
			<AnimatePresence>
				{charMsg && (
					<motion.div
						initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.9 }}
						animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
						exit={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
						transition={{ type: 'spring', stiffness: 260, damping: 25 }}
						className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 w-[92%] max-w-md bg-white/10 backdrop-blur-md p-4 rounded-3xl shadow-2xl border-2 border-white/20 pointer-events-none"
					>
						<div className="w-16 h-16 flex items-center justify-center shrink-0 overflow-hidden bg-white/10 rounded-2xl p-1">
							{characterSrc
								? <img src={characterSrc} alt="Персонаж" className="w-full h-full object-contain" />
								: <span className="text-3xl">🚀</span>
							}
						</div>
						<div className="relative flex-1 bg-white/10 border border-white/20 p-3 rounded-2xl rounded-bl-none text-white text-sm font-semibold leading-relaxed">
							{charMsg}
							<div className="absolute -left-[6px] bottom-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-white/10 border-b-[6px] border-b-white/10" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default PlanetMatchingQuiz;