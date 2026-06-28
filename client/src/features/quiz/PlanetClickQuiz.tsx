import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw } from 'lucide-react';

export interface PlanetQuestion {
	label: string;
	audioSrc: string;
}

interface PlanetClickQuizProps {
	questions: PlanetQuestion[];
	allLetters: string[];
	characterSrc?: string;
	onComplete?: (score: number, total: number) => void;
}

const CORRECT_PHRASES = [
	'Идеально! ✨', 'Супер! 🚀',
	'Отлично! 🌟', 'Так держать! 💪',
];
const WRONG_PHRASES = [
	'Не расстраивайся! 🛸', 'Слушай внимательнее 🌙',
	'Ты справишься! ✨', 'Попробуй ещё раз 🚀',
];

const PLANET_COUNT = 14;
const PLANETS_PER_QUESTION = 4;

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Генерируем случайное смещение для планеты — чтобы не было идеальной сетки
const jitter = (max = 24) => (Math.random() - 0.5) * max * 2;

// Генерируем 4 варианта: 1 правильный + 3 случайных
const generateChoices = (correct: string, allLetters: string[]): string[] => {
	const others = allLetters.filter(l => l !== correct);
	const wrong = [...others].sort(() => Math.random() - 0.5).slice(0, PLANETS_PER_QUESTION - 1);
	return [...wrong, correct].sort(() => Math.random() - 0.5);
};

// Случайные картинки планет без повторений
const assignPlanetImages = (count: number): number[] => {
	const indices = Array.from({ length: PLANET_COUNT }, (_, i) => i + 1);
	return indices.sort(() => Math.random() - 0.5).slice(0, count);
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

interface PlanetCardProps {
	letter: string;
	imageIndex: number;
	position: { x: number; y: number; size: number };
	state: 'idle' | 'correct' | 'wrong';
	disabled: boolean;
	onClick: () => void;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ letter, imageIndex, position, state, disabled, onClick }) => {
	const ring =
		state === 'correct' ? 'drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]' :
		state === 'wrong'   ? 'drop-shadow-[0_0_20px_rgba(248,113,113,0.8)]' :
		'';

	return (
		<motion.button
			onClick={onClick}
			disabled={disabled}
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{
				opacity: 1,
				scale: state === 'correct' ? [1, 1.2, 1] : 1,
				x: state === 'wrong' ? [-8, 8, -6, 6, 0] : 0,
			}}
			transition={{ duration: 0.35 }}
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
				width: position.size,
				height: position.size,
			}}
			className="flex flex-col items-center justify-center"
		>
			<div className={`relative w-full h-full ${ring} transition-all`}>
				<img
					src={`/assets/planets/${imageIndex}.png`}
					alt={letter}
					className="w-full h-full object-contain"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white font-black text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
						{letter}
					</span>
				</div>
			</div>
		</motion.button>
	);
};

interface ScoreScreenProps {
	score: number;
	total: number;
	onRestart: () => void;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, total, onRestart }) => {
	const pct = Math.round((score / total) * 100);
	const msg =
		pct === 100 ? 'Ты абсолютный чемпион! 🌟' :
			pct >= 75 ? 'Отличный результат! 🚀' :
				pct >= 50 ? 'Хорошая работа! 💪' :
					'Продолжай тренироваться! ✨';

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="flex flex-col items-center gap-4 text-white text-center"
		>
			<div className="text-7xl font-black bg-gradient-to-br from-violet-300 to-blue-300 bg-clip-text text-transparent">
				{score}/{total}
			</div>
			<h2 className="text-2xl font-bold">{msg}</h2>
			<p className="text-white/60 text-sm">Правильных ответов: {pct}%</p>
			<button
				onClick={onRestart}
				className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full border-2 border-violet-400/60 text-violet-200 font-semibold hover:bg-violet-500/20 transition-all"
			>
				<RotateCcw size={16} /> Попробовать ещё раз
			</button>
		</motion.div>
	);
};

const PlanetClickQuiz: React.FC<PlanetClickQuizProps> = ({
	questions,
	allLetters,
	characterSrc,
	onComplete,
}) => {
	const [current, setCurrent] = useState(0);
	const [score, setScore] = useState(0);
	const [finished, setFinished] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [charMsg, setCharMsg] = useState<string | null>(null);
	const [planetStates, setPlanetStates] = useState<Record<string, 'idle' | 'correct' | 'wrong'>>({});
	const [answered, setAnswered] = useState(false);

	// Генерируем данные для текущего вопроса — стабильно через useState
	const [questionData, setQuestionData] = useState(() => {
		const choices = generateChoices(questions[0].label, allLetters);
		const images = assignPlanetImages(PLANETS_PER_QUESTION);
		const offsets = choices.map(() => ({ x: jitter(20), y: jitter(20) }));
		return { choices, images, offsets };
	});

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const q = questions[current];

	const showBubble = useCallback((msg: string) => {
		if (charTimerRef.current) clearTimeout(charTimerRef.current);
		setCharMsg(msg);
		charTimerRef.current = setTimeout(() => setCharMsg(null), 3200);
	}, []);

	const playAudio = useCallback(() => {
		if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
		const audio = new Audio(q.audioSrc);
		audioRef.current = audio;
		setIsPlaying(true);
		audio.addEventListener('ended', () => setIsPlaying(false));
		audio.addEventListener('error', () => setIsPlaying(false));
		audio.play().catch(() => setIsPlaying(false));
	}, [q.audioSrc]);

	const handleChoice = (letter: string) => {
		if (answered) return;
		setAnswered(true);

		const isCorrect = letter === q.label;
		if (isCorrect) setScore(s => s + 1);

		// Подсвечиваем все планеты
		const states: Record<string, 'idle' | 'correct' | 'wrong'> = {};
		questionData.choices.forEach(ch => {
			states[ch] = ch === q.label ? 'correct' : ch === letter ? 'wrong' : 'idle';
		});
		setPlanetStates(states);
		showBubble(random(isCorrect ? CORRECT_PHRASES : WRONG_PHRASES));

		// Переходим к следующему через 1.5с
		setTimeout(() => {
			if (current + 1 >= questions.length) {
				setFinished(true);
				onComplete?.(score + (isCorrect ? 1 : 0), questions.length);
			} else {
				const next = current + 1;
				setCurrent(next);
				const choices = generateChoices(questions[next].label, allLetters);
				const images = assignPlanetImages(PLANETS_PER_QUESTION);
				const offsets = choices.map(() => ({ x: jitter(20), y: jitter(20) }));
				setQuestionData({ choices, images, offsets });
				setPlanetStates({});
				setAnswered(false);
				setCharMsg(null);
				setPositions(generatePlanetPositions(PLANETS_PER_QUESTION));
			}
		}, 1500);
	};

	const generatePlanetPositions = (count: number) => {
		// Фиксированные "якорные" позиции для 4 планет в зоне 300x300
		// чтобы они не перекрывались, но выглядели органично
		const anchors = [
			{ x: 20, y: 10 },  // верхний левый
			{ x: 160, y: 0 },  // верхний правый
			{ x: 0, y: 150 },  // нижний левый
			{ x: 150, y: 140 },  // нижний правый
		];
		return anchors.slice(0, count).map(anchor => ({
			x: anchor.x + jitter(18),
			y: anchor.y + jitter(18),
			size: 100 + Math.floor(Math.random() * 40), // 100–140px
		}));
	};

	const [positions, setPositions] = useState(() => generatePlanetPositions(PLANETS_PER_QUESTION));


	const handleRestart = () => {
		setCurrent(0);
		setScore(0);
		setFinished(false);
		setAnswered(false);
		setCharMsg(null);
		setPlanetStates({});
		const choices = generateChoices(questions[0].label, allLetters);
		const images = assignPlanetImages(PLANETS_PER_QUESTION);
		const offsets = choices.map(() => ({ x: jitter(20), y: jitter(20) }));
		setQuestionData({ choices, images, offsets });
	};


	return (
		<div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none bg-[#0a0a1a]">
			<Stars />

			<div className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col items-center gap-8">

				{/* Прогресс */}
				{!finished && (
					<div className="w-full">
						<div className="flex justify-between text-white/40 text-xs mb-2 font-medium">
							<span>Вопрос {current + 1} из {questions.length}</span>
							<span>{Math.round((current / questions.length) * 100)}%</span>
						</div>
						<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full"
								initial={false}
								animate={{ width: `${(current / questions.length) * 100}%` }}
								transition={{ duration: 0.4 }}
							/>
						</div>
					</div>
				)}

				{finished ? (
					<ScoreScreen score={score} total={questions.length} onRestart={handleRestart} />
				) : (
					<>
						{/* Кнопка прослушать */}
						<motion.button
							key={current}
							initial={{ opacity: 0, y: -12 }}
							animate={{ opacity: 1, y: 0 }}
							onClick={playAudio}
							className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 font-semibold text-base transition-all ${isPlaying
								? 'border-violet-400 bg-violet-500/20 text-violet-200'
								: 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
								}`}
						>
							<Volume2 size={20} className={isPlaying ? 'animate-pulse' : ''} />
							{isPlaying ? 'Воспроизводится...' : 'Послушать'}
						</motion.button>
						<p className="text-white/30 text-xs -mt-6">Найди букву которую услышал</p>

						{/* Сетка планет 2x2 со смещением */}
						<div className="relative w-[300px] h-[300px] mt-4">
							{questionData.choices.map((letter, i) => (
								<PlanetCard
									key={`${current}-${letter}`}
									letter={letter}
									imageIndex={questionData.images[i]}
									position={positions[i]}
									state={planetStates[letter] ?? 'idle'}
									disabled={answered}
									onClick={() => handleChoice(letter)}
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
						className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 w-[92%] max-w-md sm:max-w-lg bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-white/20 pointer-events-none"
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

export default PlanetClickQuiz;