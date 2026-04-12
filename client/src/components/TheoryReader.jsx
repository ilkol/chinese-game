import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, BookOpen, Info } from 'lucide-react';

const TheoryReader = ({ title, slides, onFinish }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			onFinish();
		}
	};

	const prevSlide = () => {
		if (currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'ArrowRight') nextSlide();
			if (e.key === 'ArrowLeft') prevSlide();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [currentSlide]);

	const progress = ((currentSlide + 1) / slides.length) * 100;

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Шапка с прогресс-баром */}
			<div className="bg-white p-4 shadow-sm z-10">
				<div className="max-w-2xl mx-auto flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 p-2 rounded-xl text-blue-600">
							<BookOpen size={20} />
						</div>
						<h1 className="font-bold text-slate-800 line-clamp-1">{title}</h1>
					</div>
					<span className="text-sm font-bold text-slate-400">
						{currentSlide + 1} / {slides.length}
					</span>
				</div>
				<div className="max-w-2xl mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						className="h-full bg-blue-500"
					/>
				</div>
			</div>

			{/* Основной контент (Слайды) */}
			<div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentSlide}
						initial={{ x: 50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -50, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="w-full max-w-2xl bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden flex flex-col"
					>
						{/* Рендер контента в зависимости от типа */}
						<div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
							{slides[currentSlide].type === 'text' && (
								<div className="prose prose-slate">
									<h2 className="text-2xl font-black mb-4">{slides[currentSlide].header}</h2>
									<p className="text-lg text-slate-600 leading-relaxed">
										{slides[currentSlide].content}
									</p>
								</div>
							)}

							{slides[currentSlide].type === 'image' && (
								<div className="space-y-4">
									<h2 className="text-2xl font-black">{slides[currentSlide].header}</h2>
									<img
										src={slides[currentSlide].url}
										className="w-full h-64 object-cover rounded-2xl shadow-md"
										alt="theory"
									/>
									<p className="text-slate-500 italic text-center">{slides[currentSlide].caption}</p>
								</div>
							)}

							{slides[currentSlide].type === 'video' && (
								<div className="space-y-4">
									<h2 className="text-2xl font-black">{slides[currentSlide].header}</h2>
									<div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
										<iframe
											className="w-full h-full"
											src={slides[currentSlide].url}
											title="YouTube video"
											allowFullScreen
										/>
									</div>
								</div>
							)}

							{/* Специальный блок для иероглифов */}
							{slides[currentSlide].type === 'hanzi' && (
								<div className="flex flex-col items-center py-8">
									<div className="text-9xl font-bold text-slate-800 mb-4 bg-slate-50 w-full text-center py-10 rounded-3xl border-2 border-dashed border-slate-200">
										{slides[currentSlide].char}
									</div>
									<div className="text-3xl font-bold text-blue-600 mb-2">{slides[currentSlide].pinyin}</div>
									<div className="text-xl text-slate-500">{slides[currentSlide].translation}</div>
								</div>
							)}
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Кнопки управления */}
			<div className="p-6 bg-white border-t border-slate-100">
				<div className="max-w-2xl mx-auto flex gap-4">
					<button
						onClick={prevSlide}
						disabled={currentSlide === 0}
						className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${currentSlide === 0 ? "bg-slate-50 text-slate-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
							}`}
					>
						<ChevronLeft size={24} /> Назад
					</button>

					<button
						onClick={nextSlide}
						className="flex-[2] py-4 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
					>
						{currentSlide === slides.length - 1 ? "Завершить" : "Далее"}
						<ChevronRight size={24} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default TheoryReader;
