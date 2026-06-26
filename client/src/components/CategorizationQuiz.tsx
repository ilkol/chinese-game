import React, { useState } from 'react';
import {
	DndContext,
	useDraggable,
	useDroppable,
	DragOverlay,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	type DragEndEvent,
	type DragStartEvent
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export interface QuizItem {
	id: string;
	text: string;
	correctColumnId: string;
}

export interface Column {
	id: string;
	title: string;
}

interface ColumnsData {
	[key: string]: QuizItem[];
}

// Новый интерфейс для шагов диалога
export interface DialogStep {
	speaker?: string;
	text: string;
	emotion?: string; 
	bg?: string;    
}

export interface CategorizationQuizTask {
	type: 'categorization';
	columns: Column[];
	items: QuizItem[];
}

interface CategorizationQuizProps {
	quizData: CategorizationQuizTask;
	introDialog?: DialogStep[];
	onComplete?: () => void;
}

const SUPPORT_PHRASES = [
	'У тебя все получится, не расстраивайся! ✨',
	'Ты справишься! Я в тебя верю! 🚀',
	'Ничего страшного, давай попробуем еще раз! 💪',
	'Ошибки помогают нам учиться! Ты на правильном пути! 🌟',
	'Почти получилось! Попробуй присмотреться к знаку тона 🛸'
];

const CORRECT_PHRASES = [
	'Идеально! ✨',
	'Супер! 🚀',
	'Ты большой молодец! 💪',
	'У тебя круто получается! 🌟',
	'Продолжай в том же духе! 🛸',
	'Все правильно! 🚀'
];

interface IntroDilogProps {
	steps: DialogStep[];
	onFinish: () => void;
}

const IntroDialog: React.FC<IntroDilogProps> = ({ steps, onFinish }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const next = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(s => s + 1);
		} else {
			onFinish();
		}
	};

	const step = steps[currentStep];
	const bg = step.bg ?? 'blue';

	return (
		<motion.div
			className="fixed inset-0 z-50 flex flex-col"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{/* Затемнённый фон */}
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

			{/* Персонаж */}
			<div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-32 pointer-events-none z-10">
				<AnimatePresence mode="popLayout">
					{step.emotion && (
						<div className="relative">
							<motion.img
								key={currentStep}
								src={step.emotion}
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 20, scale: 1.05 }}
								transition={{ duration: 0.2 }}
								className="h-[55vh] object-contain z-10"
							/>
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* Плашка с текстом */}
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
								{step.text.split(/(\*[^*]+\*)/g).map((part, index) => {
									if (part.startsWith('*') && part.endsWith('*')) {
										return (
											<span key={index} className={`font-black text-${bg}-300`}>
												{part.slice(1, -1)}
											</span>
										);
									}
									return part;
								})}
							</p>
						)}

						<div className="absolute bottom-2 right-8 flex items-center gap-2 text-white/40 animate-pulse text-xs font-bold uppercase">
							Нажми, чтобы продолжить <ChevronRight size={16} />
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

const CategorizationQuiz: React.FC<CategorizationQuizProps> = ({ quizData, introDialog, onComplete }) => {
	const { columns, items } = quizData;

	// Показываем диалог только если он передан
	const [showIntro, setShowIntro] = useState<boolean>(!!introDialog?.length);

	const [poolItems, setPoolItems] = useState<QuizItem[]>(() =>
		[...items].sort(() => Math.random() - 0.5)
	);

	const [columnsData, setColumnsData] = useState<ColumnsData>(() => {
		const initial: ColumnsData = {};
		columns.forEach(col => {
			initial[col.id] = [];
		});
		return initial;
	});

	const [activeItem, setActiveItem] = useState<QuizItem | null>(null);
	const [characterMessage, setCharacterMessage] = useState<string | null>(null);

	const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
	const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } });
	const sensors = useSensors(mouseSensor, touchSensor);

	const handleDragStart = (event: DragStartEvent): void => {
		const { active } = event;
		const item = items.find(i => i.id === active.id);
		if (item) setActiveItem(item);
	};

	const sendRandomPhrase = (phrase: string[]) => {
		const randomPhrase = phrase[Math.floor(Math.random() * phrase.length)];
		setCharacterMessage(randomPhrase);
		setTimeout(() => setCharacterMessage(null), 3000);
	};

	const handleDragEnd = (event: DragEndEvent): void => {
		const { active, over } = event;
		setActiveItem(null);

		if (!over) return;

		const itemId = active.id as string;
		const targetColumnId = over.id as string;
		const draggedItem = items.find(item => item.id === itemId);

		if (draggedItem && draggedItem.correctColumnId === targetColumnId) {
			setPoolItems(prev => prev.filter(item => item.id !== itemId));
			setColumnsData(prev => {
				const updatedColumn = [...(prev[targetColumnId] || []), draggedItem];
				const newData = { ...prev, [targetColumnId]: updatedColumn };

				const totalPlaced = Object.values(newData).reduce((sum, col) => sum + col.length, 0);
				if (totalPlaced === items.length && onComplete) {
					setTimeout(onComplete, 1000);
				}
				return newData;
			});
			sendRandomPhrase(CORRECT_PHRASES);
		} else {
			sendRandomPhrase(SUPPORT_PHRASES);
		}
	};

	const maxItemsPerColumn = items.length / columns.length;

	return (
		<>
			{/* Вступительный диалог */}
			<AnimatePresence>
				{showIntro && introDialog?.length && (
					<IntroDialog
						steps={introDialog}
						onFinish={() => setShowIntro(false)}
					/>
				)}
			</AnimatePresence>

			<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<div className="w-full max-w-6xl mx-auto p-2 sm:p-4 flex flex-col gap-4 sm:gap-6 select-none relative">

					<AnimatePresence>
						{characterMessage && (
							<motion.div
								initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.9 }}
								animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
								exit={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
								transition={{ type: 'spring', stiffness: 260, damping: 25 }}
								className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 w-[92%] max-w-md sm:max-w-lg bg-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-blue-100 pointer-events-none"
							>
								<div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50 rounded-2xl p-1 shadow-inner">
									<img
										src="/assets/chars/lun-lun/happy.png"
										alt="Лун-Лун"
										className="w-full h-full object-contain"
									/>
								</div>

								<div className="relative flex-1 bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl rounded-bl-none text-slate-700 text-sm sm:text-base font-semibold leading-relaxed shadow-sm">
									{characterMessage}
									<div className="absolute -left-[6px] bottom-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-slate-50 border-b-[6px] border-b-slate-50" />
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-3 sm:p-6 min-h-[110px] sm:min-h-[160px]">
						<div className="flex flex-wrap gap-2 justify-center max-h-[180px] overflow-y-auto p-1">
							{poolItems.map(item => (
								<DraggableItem key={item.id} id={item.id} text={item.text} />
							))}
						</div>
					</div>

					<div className={`grid grid-cols-2 lg:grid-cols-${columns.length} gap-2 sm:gap-4`}>
						{columns.map(col => (
							<DroppableColumn
								key={col.id}
								id={col.id}
								title={col.title}
								maxItems={maxItemsPerColumn}
								items={columnsData[col.id] || []}
							/>
						))}
					</div>

					<DragOverlay dropAnimation={null}>
						{activeItem ? (
							<div className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-500 border-b-2 sm:border-b-4 border-blue-700 rounded-lg sm:rounded-xl text-white font-bold shadow-xl text-xs sm:text-base scale-105 pointer-events-none">
								{activeItem.text}
							</div>
						) : null}
					</DragOverlay>

				</div>
			</DndContext>
		</>
	);
};

interface DroppableColumnProps {
	id: string;
	title: string;
	items: QuizItem[];
	maxItems: number;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, items, maxItems }) => {
	const { isOver, setNodeRef } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className={`flex flex-col h-[180px] sm:h-[320px] rounded-xl sm:rounded-2xl border p-2 sm:p-4 transition-all duration-200 bg-white ${isOver ? 'scale-[1.02] shadow-md border-solid border-blue-400 bg-blue-50/10' : 'border-dashed border-slate-200'}`}
		>
			<h3 className="text-center font-bold text-slate-700 text-xs sm:text-lg mb-1 sm:mb-3 truncate">{title}</h3>

			<div className="flex-1 overflow-y-auto flex flex-col gap-1 sm:gap-2 pr-1">
				{items.map(item => (
					<motion.div
						key={item.id}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-white border border-green-200 text-green-700 font-medium px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-center shadow-xs text-[11px] sm:text-sm truncate"
					>
						{item.text}
					</motion.div>
				))}
				{items.length === 0 && (
					<div className="flex-1 flex items-center justify-center text-slate-300 text-[10px] sm:text-xs italic text-center px-1">
						Сюда
					</div>
				)}
			</div>

			<div className="text-right text-[10px] sm:text-xs font-semibold text-slate-400 mt-1">
				{items.length} / {maxItems}
			</div>
		</div>
	);
};

interface DraggableItemProps {
	id: string;
	text: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text }) => {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

	return (
		<div
			ref={setNodeRef}
			style={{ touchAction: 'none' }}
			{...listeners}
			{...attributes}
			className={`
				px-3 py-2 sm:px-4 sm:py-3 bg-white border-b-2 sm:border-b-4 border-slate-200 rounded-lg sm:rounded-xl 
				text-slate-700 font-bold shadow-xs cursor-grab active:cursor-grabbing text-xs sm:text-base 
				transition-all select-none
				${isDragging ? 'opacity-20 border-dashed bg-slate-100 text-transparent border-slate-300 shadow-none' : 'hover:shadow-sm'}
			`}
		>
			{text}
		</div>
	);
};

export default CategorizationQuiz;