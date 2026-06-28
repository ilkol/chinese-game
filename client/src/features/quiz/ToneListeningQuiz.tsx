import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, Volume2 } from 'lucide-react';

export interface ToneQuestion {
	correct: string;
	wrong: string;
	audioSrc?: string;
	audioStart?: number;
	audioDuration?: number;
}

interface ToneListeningQuizProps {
	questions: ToneQuestion[];
	audioSrc?: string;
	segmentDuration?: number;
	characterSrc?: string;
	backgroundSrc?: string;
	onComplete?: (score: number, total: number) => void;
}

const CORRECT_PHRASES = [
	'Идеально! ✨', 'Супер! 🚀',
	'Отлично! 🌟', 'Так держать! 💪', 'Продолжай! 🛸',
];
const WRONG_PHRASES = [
	'Не расстраивайся, ещё раз! 🛸', 'Почти! Следи за значком тона 🌙',
	'Ты справишься! Я верю! ✨', 'Ошибки — это шаги к цели 🚀',
	'Присмотрись к знаку над буквой! 🌟',
];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(a: T, b: T): [T, T] => (Math.random() < 0.5 ? [a, b] : [b, a]);

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

const Stars: React.FC = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		{STARS.map(star => <div key={star.id} style={star.style} />)}
	</div>
);

const CharBubble: React.FC<{ message: string | null; characterSrc?: string }> = ({ message, characterSrc }) => (
	<AnimatePresence>
		{message && (
			<motion.div
				initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.9 }}
				animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
				exit={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
				transition={{ type: 'spring', stiffness: 260, damping: 25 }}
				className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 w-[92%] max-w-md sm:max-w-lg bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-white/20 pointer-events-none"
			>
				<div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 overflow-hidden bg-white/10 rounded-2xl p-1">
					{characterSrc
						? <img src={characterSrc} alt="Персонаж" className="w-full h-full object-contain" />
						: <span className="text-4xl">🚀</span>
					}
				</div>
				<div className="relative flex-1 bg-white/10 border border-white/20 p-3 sm:p-4 rounded-2xl rounded-bl-none text-white text-sm sm:text-base font-semibold leading-relaxed">
					{message}
					<div className="absolute -left-[6px] bottom-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-white/10 border-b-[6px] border-b-white/10" />
				</div>
			</motion.div>
		)}
	</AnimatePresence>
);

const ScoreScreen: React.FC<{ score: number; total: number; onRestart: () => void }> = ({ score, total, onRestart }) => {
	const pct = Math.round((score / total) * 100);
	const msg = pct === 100 ? 'Ты абсолютный чемпион! 🌟' : pct >= 75 ? 'Отличный результат! 🚀' : pct >= 50 ? 'Хорошая работа! 💪' : 'Продолжай тренироваться! ✨';
	return (
		<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-white text-center">
			<div className="text-7xl font-black bg-gradient-to-br from-violet-300 to-blue-300 bg-clip-text text-transparent">{score}/{total}</div>
			<h2 className="text-2xl font-bold">{msg}</h2>
			<p className="text-white/60 text-sm">Правильных ответов: {pct}%</p>
			<button onClick={onRestart} className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full border-2 border-violet-400/60 text-violet-200 font-semibold hover:bg-violet-500/20 transition-all">
				<RotateCcw size={16} /> Попробовать ещё раз
			</button>
		</motion.div>
	);
};

const ToneListeningQuiz: React.FC<ToneListeningQuizProps> = ({
	questions, audioSrc, segmentDuration = 2, characterSrc, backgroundSrc, onComplete,
}) => {
	const [current, setCurrent] = useState(0);
	const [score, setScore] = useState(0);
	const [answered, setAnswered] = useState(false);
	const [chosen, setChosen] = useState<string | null>(null);
	const [finished, setFinished] = useState(false);
	const [charMsg, setCharMsg] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [choices, setChoices] = useState<[string, string]>(() => shuffle(questions[0].correct, questions[0].wrong));

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const q = questions[current];

	const showBubble = useCallback((msg: string) => {
		if (charTimerRef.current) clearTimeout(charTimerRef.current);
		setCharMsg(msg);
		charTimerRef.current = setTimeout(() => setCharMsg(null), 3200);
	}, []);

	const playAudio = useCallback(() => {
		const src = q.audioSrc ?? audioSrc;
		if (!src) return;
		if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

		const audio = new Audio(src);
		const start = q.audioStart ?? current * segmentDuration;
		
		const duration = q.audioDuration ?? segmentDuration;

		audio.currentTime = start;
		audioRef.current = audio;
		setIsPlaying(true);

		audio.addEventListener('timeupdate', () => {
			if (audio.currentTime >= start + duration) { audio.pause(); setIsPlaying(false); }
		});
		audio.addEventListener('ended', () => setIsPlaying(false));
		audio.addEventListener('error', () => setIsPlaying(false));
		audio.play().catch(() => setIsPlaying(false));
	}, [q, audioSrc, current, segmentDuration]);

	const handleChoice = (picked: string) => {
		if (answered) return;
		setAnswered(true);
		setChosen(picked);
		const isCorrect = picked === q.correct;
		if (isCorrect) setScore(s => s + 1);
		showBubble(random(isCorrect ? CORRECT_PHRASES : WRONG_PHRASES));
	};

	const handleNext = () => {
		if (charTimerRef.current) clearTimeout(charTimerRef.current);
		setCharMsg(null);

		const nextScore = score + (chosen === q.correct ? 1 : 0);

		if (current + 1 >= questions.length) {
			setFinished(true);
			onComplete?.(nextScore, questions.length);
			return;
		}
		const next = current + 1;
		setCurrent(next);
		setChoices(shuffle(questions[next].correct, questions[next].wrong));
		setAnswered(false);
		setChosen(null);
	};

	const handleRestart = () => {
		setCurrent(0); setScore(0); setAnswered(false);
		setChosen(null); setFinished(false); setCharMsg(null);
		setChoices(shuffle(questions[0].correct, questions[0].wrong));
	};

	return (
		<div
			className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
			style={{ background: backgroundSrc ? `url(${backgroundSrc}) center/cover no-repeat` : '#0a0a1a' }}
		>
			{!backgroundSrc && <Stars />}
			{backgroundSrc && <div className="absolute inset-0 bg-black/40" />}

			<div className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col items-center gap-6">
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
						<motion.button
							key={current}
							initial={{ opacity: 0, y: -12 }}
							animate={{ opacity: 1, y: 0 }}
							onClick={playAudio}
							className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 font-semibold text-base transition-all ${isPlaying ? 'border-violet-400 bg-violet-500/20 text-violet-200' : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'}`}
						>
							<Volume2 size={20} className={isPlaying ? 'animate-pulse' : ''} />
							{isPlaying ? 'Воспроизводится...' : 'Послушать'}
						</motion.button>
						<p className="text-white/30 text-xs -mt-4">Нажми ещё раз, чтобы повторить</p>

						<div className="grid grid-cols-2 gap-4 w-full mt-2">
							{choices.map(ch => {
								const isCorrect = ch === q.correct;
								const isPicked = ch === chosen;
								let style = 'bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30';
								if (answered && isCorrect) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
								else if (answered && isPicked && !isCorrect) style = 'bg-red-500/20 border-red-400 text-red-200';
								return (
									<motion.button
										key={ch}
										whileTap={!answered ? { scale: 0.95 } : {}}
										animate={
											answered && isCorrect ? { scale: [1, 1.06, 1] } :
											answered && isPicked && !isCorrect ? { x: [0, -6, 6, -4, 4, 0] } : {}
										}
										transition={{ duration: 0.35 }}
										disabled={answered}
										onClick={() => handleChoice(ch)}
										className={`rounded-2xl border-2 py-8 text-5xl font-bold transition-all ${style}`}
										style={{ fontFamily: "'Noto Sans SC', serif" }}
									>
										{ch}
									</motion.button>
								);
							})}
						</div>

						<AnimatePresence>
							{answered && (
								<motion.button
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									onClick={handleNext}
									className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-violet-400/60 text-violet-200 font-semibold hover:bg-violet-500/20 transition-all"
								>
									{current < questions.length - 1 ? 'Следующий' : 'Результат 🎉'}
									<ChevronRight size={16} />
								</motion.button>
							)}
						</AnimatePresence>
					</>
				)}
			</div>

			<CharBubble message={charMsg} characterSrc={characterSrc} />
		</div>
	);
};

export default ToneListeningQuiz;