import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import DelayedVideo from '../../components/DelayedVideo';

export interface DialogStep {
	id: number;
	text?: string;
	speaker?: string;
	emotion?: string;
	bg?: string;
	video?: { src: string; muted?: boolean };
	photo?: { src: string; alt: string; size?: string };
}

interface Props {
	steps: DialogStep[];
	backgroundSrc?: string;
	onComplete: () => void;
	children?: (step: DialogStep) => React.ReactNode; // слот для кастомного контента (монеты, ракеты и т.д.)
	getBgClass?: (step: DialogStep) => string | undefined;
}

const DialogEngine = ({ steps, backgroundSrc, onComplete, children, getBgClass }: Props) => {
	const [currentStep, setCurrentStep] = useState(0);

	const step = steps[currentStep];
	const bg = step.bg ?? 'blue';

	const next = () => {
		if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
		else onComplete();
	};

	return (
		<div
			className={`fixed inset-0 z-0 overflow-hidden transition-colors duration-1000 bg-center bg-cover bg-no-repeat ${getBgClass?.(step) ?? ''}`}
			style={{ backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined }}
		>
			{/* Видео-фон */}
			{step.video && <DelayedVideo src={step.video.src} muted={step.video.muted} />}

			{/* Фото */}
			{step.photo && (
				<AnimatePresence>
					<motion.div
						key={`photo-${currentStep}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-0 flex items-start justify-center pt-10"
					>
						<img
							src={step.photo.src}
							alt={step.photo.alt}
							className={`max-w-${step.photo.size ?? 'md'} mx-auto`}
						/>
					</motion.div>
				</AnimatePresence>
			)}

			{/* Кастомный контент (монеты, галерея и т.д.) */}
			{children?.(step)}

			{/* Персонаж */}
			<div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-32 pointer-events-none z-10">
				<AnimatePresence mode="popLayout">
					{step.emotion && (
						<motion.img
							key={currentStep}
							src={step.emotion}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 20, scale: 1.05 }}
							transition={{ duration: 0.2 }}
							className="h-[55vh] object-contain z-10"
						/>
					)}
				</AnimatePresence>
			</div>

			{/* Диалоговая плашка */}
			<div className="absolute inset-x-0 bottom-0 p-6 z-20">
				<motion.div
					key={currentStep}
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.25 }}
					className="max-w-2xl mx-auto relative"
				>
					{step.speaker && (
						<div className={`absolute -top-6 left-6 bg-${bg}-600 text-white px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-lg`}>
							{step.speaker}
						</div>
					)}
					<div
						onClick={next}
						className="bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-[32px] p-8 pt-10 min-h-[160px] cursor-pointer hover:border-white/40 transition-all shadow-2xl"
					>
						{step.text && (
							<p className="text-white text-lg md:text-xl font-medium leading-relaxed">
								{step.text.split(/(\*[^*]+\*)/g).map((part, i) =>
									part.startsWith('*') && part.endsWith('*') ? (
										<span key={i} className={`font-black text-${bg}-300`}>
											{part.slice(1, -1)}
										</span>
									) : part
								)}
							</p>
						)}
						<div className="absolute bottom-2 right-8 flex items-center gap-2 text-white/40 animate-pulse text-xs font-bold uppercase">
							Нажми, чтобы продолжить <ChevronRight size={16} />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Прогресс-бар */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
				{steps.map((_, i) => (
					<div
						key={i}
						className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
					/>
				))}
			</div>
		</div>
	);
};

export default DialogEngine;