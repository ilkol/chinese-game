import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, ArrowLeft, PlayCircle, Trophy, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as API from '../services/api';
import GameLoader from '../components/GameLoader';


const getStepIcon = (step: API.LevelStep) => {
	switch (step.type) {
		case "theory":
			return <BookOpen />
		case "final":
			return <Trophy />
		default:
			return <PlayCircle />
	}
}

const isStepCompleted = (step: API.LevelStep) => {
	return step.is_completed;
}
const getStepTitle = (step: API.LevelStep) => {
	if (step.title && step.title !== "") {
		return step.title;
	}

	switch (step.type) {
		case "theory":
			return "Космознайка"
		case "final":
			return `Итоговый тест`
		default:
			return `Тестирование`
	}
}

interface Props {
	level: API.Level;
	onBack: () => void;
	onStartStep: (_: API.LevelStep) => void;
	isTeacher: boolean;
	backgroundSrc?: string;
}

const TopicMenu = ({ level, onBack, onStartStep, isTeacher, backgroundSrc }: Props) => {
	const [steps, setSteps] = useState<API.LevelStep[]>([]);
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		API.getLevel(level.id).then(data => {
			if (data.steps !== null) {
				setSteps(data.steps)
			}
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		});
	}, [level])

	return (
		<div
			className="relative min-h-screen w-screen overflow-hidden bg-slate-50 bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined }}
		>
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.div
						key="global-loader"
						exit={{ opacity: 0, scale: 1.1 }} // Плавное растворение с легким увеличением
						transition={{ duration: 0.8, ease: "easeInOut" }}
						className="fixed inset-0 z-[100]" // Всегда поверх всего
					>
						<GameLoader lightMod isLoading={isLoading} />
					</motion.div>
				) : (
					<motion.div
						key="menu-content"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="min-h-screen p-6 flex flex-col items-center relative z-10"
					>

						{/* Шапка */}
						<div className="w-full max-w-md flex items-center justify-between mb-8 bg-white rounded-full">
							<button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
								<ArrowLeft size={28} />
							</button>
							<h1 className="text-xl font-black uppercase tracking-tight">{level.title}</h1>
							<button
								onClick={() => {
									localStorage.clear();
									window.location.reload();
								}}
								className="p-2 text-slate-400 hover:text-red-500 transition-colors"
							>
								<LogOut size={24} />
							</button>
							<div className="w-10" /> {/* для симметрии */}
						</div>

						{/* Список этапов */}
						<div className="w-full max-w-md flex flex-col gap-4">
							{steps.map((step, index) => {
								const isUnlocked = isTeacher ? true : index === 0 || isStepCompleted(steps[index - 1]);
								const isCompleted = isTeacher ? false : isStepCompleted(step);
								let bgClass = "bg-white border-slate-200";

								if (isUnlocked) {
									switch (step.type) {
										case "theory":
										case "dialog":
											bgClass = "bg-red-100 border-red-200"; // Нежно-красный фон и подходящая граница
											break;
										default:
											bgClass = "bg-white border-slate-200";
									}
								} else {
									bgClass = "bg-slate-100 border-transparent opacity-60 grayscale cursor-not-allowed";
								}

								return (
									<motion.button
										key={step.id}
										whileHover={isUnlocked ? { x: 5, backgroundColor: "rgba(255, 255, 255, 0.93)" } : {}}
										whileTap={isUnlocked ? { scale: 0.98 } : {}}
										disabled={!isUnlocked}
										onClick={() => onStartStep(step)}
										className={`relative flex items-center p-5 rounded-3xl border-b-4 transition-all
										${bgClass} ${isUnlocked ? "hover:bg-red-100/50" : ""}`}
									>
										<div className="relative mr-4">
											<div className={`
			w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
			${isCompleted ? "bg-green-100 text-green-600" : isUnlocked ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-400"}
		`}>
												{getStepIcon(step)}

												{/* Если этап заблокирован — рисуем маленький замочек сверху */}
												{!isUnlocked && (
													<div className="absolute inset-0 bg-slate-200/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center text-slate-500">
														<Lock size={16} />
													</div>
												)}
											</div>

											{/* Если этап пройден — рисуем зеленую галочку в углу (Badge) */}
											{isCompleted && (
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white"
												>
													<CheckCircle2 size={14} strokeWidth={3} />
												</motion.div>
											)}
										</div>

										<div className="text-left">
											<h3 className={`font-bold ${isUnlocked ? "text-slate-800" : "text-slate-400"}`}>{getStepTitle(step)}</h3>
											<p className="text-xs text-slate-400">
												{step.description ? step.description : ""}
											</p>
										</div>

										{!isTeacher && isUnlocked && !isCompleted && (
											<div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
										)}
									</motion.button>
								);
							})}
						</div>

					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TopicMenu;
