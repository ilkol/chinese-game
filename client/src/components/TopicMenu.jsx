import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, ArrowLeft, PlayCircle, Trophy, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as API from '../services/api';
import GameLoader from './GameLoader';


const getStepIcon = (step) => {
	switch (step.type) {
		case "theory":
			return <BookOpen />
		case "final":
			return <Trophy />
		default:
			return <PlayCircle />
	}
}

const isStepCompleted = (step) => {
	return step.is_completed;
}
const getStepTitle = (step) => {
	if (step.title && step.title !== "") {
		return step.title;
	}

	switch (step.type) {
		case "theory":
			return "Теория"
		case "final":
			return `Итоговый тест`
		default:
			return `Тестирование`
	}
}

const TopicMenu = ({ level, onBack, onStartStep, isTeacher }) => {
	const [steps, setSteps] = useState([]);
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		API.getLevel(level.id).then(data => {
			console.log(data);
			setSteps(data.steps)
			setLoading(false)
		}).catch(() => {
			setLoading(false)
		});
	}, [level])

	return (
		<>
			<AnimatePresence>
				{isLoading && (
					<motion.div
						key="global-loader"
						exit={{ opacity: 0, scale: 1.1 }} // Плавное растворение с легким увеличением
						transition={{ duration: 0.8, ease: "easeInOut" }}
						className="fixed inset-0 z-[100]" // Всегда поверх всего
					>
						<GameLoader lightMod isLoading={isLoading} />
					</motion.div>
				)}
			</AnimatePresence>
			{!isLoading && (

				<div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
					{/* Шапка */}
					<div className="w-full max-w-md flex items-center justify-between mb-8">
						<button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
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
							const isUnlocked = isTeacher ? true : index === 0 || isStepCompleted(steps[index - 1], index - 1);
							const isCompleted = isTeacher ? false : isStepCompleted(step, index);

							return (
								<motion.button
									key={step.id}
									whileHover={isUnlocked ? { x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" } : {}}
									whileTap={isUnlocked ? { scale: 0.98 } : {}}
									disabled={!isUnlocked}
									onClick={() => onStartStep(step)}
									className={`relative flex items-center p-5 rounded-3xl border-b-4 transition-all
						${isUnlocked ? "bg-white border-slate-200 shadow-sm" : "bg-slate-100 opacity-60 grayscale cursor-not-allowed"}`}
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
				</div>
			)}
		</>
	);
};

export default TopicMenu;
