import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export interface MatchingPair {
	id: string;
	letter: string;
	audioSrc: string;
}

interface PlanetMatchingQuizProps {
	pairs: MatchingPair[];
	characterSrc?: string;
	backgroundSrc?: string;
	onComplete?: () => void;
}

const CORRECT_PHRASES = [
	'正确！Идеально! ✨', '棒！Супер! 🚀',
	'太好了！Отлично! 🌟', '对了！Так держать! 💪',
];
const WRONG_PHRASES = [
	'Не та планета! 🛸', 'Слушай внимательнее 🌙',
	'Попробуй ещё раз! ✨', 'Почти! 🚀',
];

const PLANET_COUNT = 14;
const PAIRS_PER_ROUND = 4;

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const jitter = (max = 16) => (Math.random() - 0.5) * max * 2;

const assignPlanetImages = (count: number): number[] =>
	Array.from({ length: PLANET_COUNT }, (_, i) => i + 1)
		.sort(() => Math.random() - 0.5)
		.slice(0, count);

// Разбиваем все пары на раунды по PAIRS_PER_ROUND
const chunkPairs = (pairs: MatchingPair[]): MatchingPair[][] => {
	const chunks: MatchingPair[][] = [];
	for (let i = 0; i < pairs.length; i += PAIRS_PER_ROUND) {
		chunks.push(pairs.slice(i, i + PAIRS_PER_ROUND));
	}
	return chunks;
};

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
		{STARS.map(star => <div key={star.id} style={star.style} />)}
	</div>
);

// Планета со звуком (верхний ряд)
interface SoundPlanetProps {
	pair: MatchingPair;
	imageIndex: number;
	offset: { x: number; y: number; size: number };
	isSelected: boolean;
	isMatched: boolean;
	isWrong: boolean;
	onClick: () => void;
}

const SoundPlanet: React.FC<SoundPlanetProps> = ({
	imageIndex, offset, isSelected, isMatched, isWrong, onClick,
}) => {
	const glow =
		isMatched  ? 'drop-shadow-[0_0_24px_rgba(52,211,153,0.9)]' :
		isSelected ? 'drop-shadow-[0_0_24px_rgba(96,165,250,0.9)]' :
		isWrong    ? 'drop-shadow-[0_0_24px_rgba(248,113,113,0.9)]' :
		'hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.3)]';

	return (
		<motion.button
			onClick={onClick}
			disabled={isMatched}
			animate={{
				scale: isMatched ? [1, 1.2, 0.8, 0] : isWrong ? [1, 0.9, 1] : 1,
				x: isWrong ? [-8, 8, -6, 6, 0] : 0,
				opacity: isMatched ? [1, 1, 0] : 1,
			}}
			transition={{ duration: isMatched ? 0.5 : 0.3 }}
			style={{
				position: 'absolute',
				left: offset.x,
				top: offset.y,
				width: offset.size,
				height: offset.size,
			}}
		>
			<div className={`relative w-full h-full transition-all ${glow}`}>
				<img
					src={`/assets/planets/${imageIndex}.png`}
					alt="planet"
					className="w-full h-full object-contain"
				/>
				{/* Иконка звука по центру */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className={`rounded-full p-2 ${isSelected ? 'bg-blue-500/60' : 'bg-black/40'} backdrop-blur-sm transition-all`}>
						<Volume2 size={20} className="text-white" />
					</div>
				</div>
			</div>
		</motion.button>
	);
};

// Планета с буквой (нижний ряд)
interface LetterPlanetProps {
	pair: MatchingPair;
	imageIndex: number;
	offset: { x: number; y: number; size: number };
	isSelected: boolean;
	isMatched: boolean;
	isWrong: boolean;
	onClick: () => void;
}

const LetterPlanet: React.FC<LetterPlanetProps> = ({
	pair, imageIndex, offset, isSelected, isMatched, isWrong, onClick,
}) => {
	const glow =
		isMatched  ? 'drop-shadow-[0_0_24px_rgba(52,211,153,0.9)]' :
		isSelected ? 'drop-shadow-[0_0_24px_rgba(167,139,250,0.9)]' :
		isWrong    ? 'drop-shadow-[0_0_24px_rgba(248,113,113,0.9)]' :
		'hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.3)]';

	return (
		<motion.button
			onClick={onClick}
			disabled={isMatched}
			animate={{
				scale: isMatched ? [1, 1.2, 0.8, 0] : isWrong ? [1, 0.9, 1] : 1,
				x: isWrong ? [-8, 8, -6, 6, 0] : 0,
				opacity: isMatched ? [1, 1, 0] : 1,
			}}
			transition={{ duration: isMatched ? 0.5 : 0.3 }}
			style={{
				position: 'absolute',
				left: offset.x,
				top: offset.y,
				width: offset.size,
				height: offset.size,
			}}
		>
			<div className={`relative w-full h-full transition-all ${glow}`}>
				<img
					src={`/assets/planets/${imageIndex}.png`}
					alt={pair.letter}
					className="w-full h-full object-contain"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white font-black text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
						{pair.letter}
					</span>
				</div>
			</div>
		</motion.button>
	);
};

// Генерация позиций для ряда планет в контейнере 320x140
const generateRowPositions = (count: number) => {
	const anchors = [
		{ x: 0,   y: 10 },
		{ x: 80,  y: 0  },
		{ x: 160, y: 15 },
		{ x: 240, y: 5  },
	];
	return anchors.slice(0, count).map(a => ({
		x: a.x + jitter(10),
		y: a.y + jitter(10),
		size: 80 + Math.floor(Math.random() * 30), // 80–110px
	}));
};

const PlanetMatchingQuiz: React.FC<PlanetMatchingQuizProps> = ({
	pairs,
	characterSrc,
	backgroundSrc,
	onComplete,
}) => {
	const rounds = chunkPairs(pairs);
	const [roundIndex, setRoundIndex] = useState(0);
	const [matchedIds, setMatchedIds] = useState<string[]>([]);
	const [selectedSound, setSelectedSound] = useState<MatchingPair | null>(null);
	const [selectedLetter, setSelectedLetter] = useState<MatchingPair | null>(null);
	const [wrongIds, setWrongIds] = useState<string[]>([]);
	const [charMsg, setCharMsg] = useState<string | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const currentRound = rounds[roundIndex] ?? [];
	const totalMatched = matchedIds.length;
	const totalPairs = pairs.length;

	// Стабильные позиции и картинки для текущего раунда
	const [roundAssets] = useState(() =>
		rounds.map(round => ({
			soundImages: assignPlanetImages(round.length),
			letterImages: assignPlanetImages(round.length),
			soundPositions: generateRowPositions(round.length),
			letterPositions: generateRowPositions(round.length),
			shuffledLetters: [...round].sort(() => Math.random() - 0.5),
		}))
	);

	const assets = roundAssets[roundIndex];

	const showBubble = useCallback((msg: string) => {
		if (charTimerRef.current) clearTimeout(charTimerRef.current);
		setCharMsg(msg);
		charTimerRef.current = setTimeout(() => setCharMsg(null), 3000);
	}, []);

	const playAudio = useCallback((audioSrc: string) => {
		if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
		const audio = new Audio(audioSrc);
		audioRef.current = audio;
		audio.play().catch(() => {});
	}, []);

	const handleLetterClick = (pair: MatchingPair) => {
		if (matchedIds.includes(pair.id)) return;

		// Если звуковая планета не выбрана — просто выделяем букву
		if (!selectedSound) {
			setSelectedLetter(prev => prev?.id === pair.id ? null : pair);
			return;
		}

		// Проверяем совпадение
		if (selectedSound.id === pair.id) {
			// Совпало
			const newMatched = [...matchedIds, pair.id];
			setMatchedIds(newMatched);
			setSelectedSound(null);
			setSelectedLetter(null);
			showBubble(random(CORRECT_PHRASES));

			// Проверяем конец раунда
			const roundMatchedCount = newMatched.filter(id =>
				currentRound.some(p => p.id === id)
			).length;

			if (roundMatchedCount === currentRound.length) {
				setTimeout(() => {
					if (roundIndex + 1 < rounds.length) {
						setRoundIndex(r => r + 1);
					} else {
						onComplete?.();
					}
				}, 800);
			}
		} else {
			// Не совпало
			setWrongIds([selectedSound.id, pair.id]);
			showBubble(random(WRONG_PHRASES));
			setTimeout(() => {
				setWrongIds([]);
				setSelectedSound(null);
				setSelectedLetter(null);
			}, 700);
		}
	};

	// Также можно выбрать букву первой, потом звук
	const handleSoundClickWithLetter = (pair: MatchingPair) => {
		if (matchedIds.includes(pair.id)) return;
		playAudio(pair.audioSrc);

		if (selectedLetter) {
			if (selectedLetter.id === pair.id) {
				const newMatched = [...matchedIds, pair.id];
				setMatchedIds(newMatched);
				setSelectedSound(null);
				setSelectedLetter(null);
				showBubble(random(CORRECT_PHRASES));

				const roundMatchedCount = newMatched.filter(id =>
					currentRound.some(p => p.id === id)
				).length;

				if (roundMatchedCount === currentRound.length) {
					setTimeout(() => {
						if (roundIndex + 1 < rounds.length) {
							setRoundIndex(r => r + 1);
						} else {
							onComplete?.();
						}
					}, 800);
				}
			} else {
				setWrongIds([pair.id, selectedLetter.id]);
				showBubble(random(WRONG_PHRASES));
				setTimeout(() => {
					setWrongIds([]);
					setSelectedSound(null);
					setSelectedLetter(null);
				}, 700);
			}
		} else {
			setSelectedSound(prev => prev?.id === pair.id ? null : pair);
		}
	};

	return (
		<div
			className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
			style={{ background: backgroundSrc ? `url(${backgroundSrc}) center/cover no-repeat` : '#0a0a1a' }}
		>
			{!backgroundSrc && <Stars />}
			{backgroundSrc && <div className="absolute inset-0 bg-black/40" />}

			<div className="relative z-10 w-full max-w-sm sm:max-w-lg px-4 py-8 flex flex-col items-center gap-10">

				{/* Прогресс */}
				<div className="w-full">
					<div className="flex justify-between text-white/40 text-xs mb-2 font-medium">
						<span>Пар найдено: {totalMatched} из {totalPairs}</span>
						<span>Раунд {roundIndex + 1} из {rounds.length}</span>
					</div>
					<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full"
							animate={{ width: `${(totalMatched / totalPairs) * 100}%` }}
							transition={{ duration: 0.4 }}
						/>
					</div>
				</div>

				{/* Подсказка */}
				<p className="text-white/40 text-xs text-center -mt-6">
					Нажми на планету со звуком, затем найди букву
				</p>

				{/* Верхний ряд — звуковые планеты */}
				<div className="relative w-[320px] h-[130px]">
					<AnimatePresence>
						{currentRound.map((pair, i) => (
							<SoundPlanet
								key={`sound-${roundIndex}-${pair.id}`}
								pair={pair}
								imageIndex={assets.soundImages[i]}
								offset={assets.soundPositions[i]}
								isSelected={selectedSound?.id === pair.id}
								isMatched={matchedIds.includes(pair.id)}
								isWrong={wrongIds.includes(pair.id)}
								onClick={() => handleSoundClickWithLetter(pair)}
							/>
						))}
					</AnimatePresence>
				</div>

				{/* Разделитель */}
				<div className="w-full flex items-center gap-4">
					<div className="flex-1 h-px bg-white/10" />
					<span className="text-white/20 text-xs uppercase tracking-widest">найди пару</span>
					<div className="flex-1 h-px bg-white/10" />
				</div>

				{/* Нижний ряд — буквенные планеты */}
				<div className="relative w-[320px] h-[130px]">
					<AnimatePresence>
						{assets.shuffledLetters.map((pair, i) => (
							<LetterPlanet
								key={`letter-${roundIndex}-${pair.id}`}
								pair={pair}
								imageIndex={assets.letterImages[i]}
								offset={assets.letterPositions[i]}
								isSelected={selectedLetter?.id === pair.id}
								isMatched={matchedIds.includes(pair.id)}
								isWrong={wrongIds.includes(pair.id)}
								onClick={() => handleLetterClick(pair)}
							/>
						))}
					</AnimatePresence>
				</div>
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
						<div className="w-14 h-14 flex items-center justify-center shrink-0 overflow-hidden bg-white/10 rounded-2xl p-1">
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