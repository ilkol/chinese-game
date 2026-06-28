import { motion } from 'framer-motion';

const QuizCard = ({ taskText, question, imgSrc, options, onAnswer, wrongAnswers, isFinished, correctAnswer }: {
	taskText?: string;
	question: string;
	imgSrc?: string;
	options: string[];
	onAnswer: (_: string) => void;
	wrongAnswers: string[];
	isFinished: boolean;
	correctAnswer: string;
}) => {
	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-8 p-2 sm:p-4">
			{/* Карточка вопроса */}
			<motion.div
				className="bg-white rounded-[24px] sm:rounded-[40px] py-8 sm:py-12 shadow-xl border-2 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden text-center"
			>
				<span className="text-slate-400 text-xs sm:text-lg font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-6 px-4">
					{taskText || "Как переводится иероглиф?"}
				</span>

				{question && (
					<div className="text-2xl sm:text-4xl font-bold text-slate-700 mb-4 sm:mb-8 px-4">
						{question}
					</div>
				)}
				{imgSrc && (
					<div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50 rounded-2xl p-1 shadow-inner">
						<img src={imgSrc} className="object-contain z-10" />
					</div>
				)}
			</motion.div>

			{/* Сетка ответов: 1 колонка на телефонах, 2 колонки от 640px (sm) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
				{options.map((option, index) => {
					const isWrong = wrongAnswers.includes(option);
					const isCorrectChoice = option === correctAnswer;
					const isRight = isFinished && isCorrectChoice;

					return (
						<motion.button
							key={index}
							animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
							whileHover={!isWrong && !isFinished ? { scale: 1.01 } : {}}
							whileTap={!isWrong && !isFinished ? { scale: 0.98 } : {}}
							onClick={() => onAnswer(option)}
							disabled={isWrong || isFinished}
							className={`
                min-h-[80px] sm:h-40 rounded-[20px] sm:rounded-[32px] 
                text-xl sm:text-3xl font-bold transition-all duration-300
                flex items-center justify-center p-4 text-center border-b-4 sm:border-b-8
                ${!isWrong && !isRight
									? "bg-white border-slate-200 text-slate-700 shadow-md"
									: ""
								}
                ${isWrong ? "bg-red-50 border-red-200 text-red-400 opacity-50 border-b-0 translate-y-1" : ""}
                ${isRight ? "bg-green-500 border-green-700 text-white shadow-green-200" : ""}
              `}
						>
							{option}
						</motion.button>
					);
				})}
			</div>
		</div>
	);
};

export default QuizCard;
