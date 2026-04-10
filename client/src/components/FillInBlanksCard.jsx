import { motion } from 'framer-motion';

const FillInBlanksCard = ({ taskText, sentence, options, onAnswer, wrongAnswers, isFinished, correctAnswer }) => {
  const parts = sentence.split('[___]');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-8 p-2 sm:p-4">
      <motion.div 
        className="bg-white rounded-[24px] sm:rounded-[40px] py-12 sm:py-20 shadow-xl border-2 border-slate-100 flex flex-col items-center justify-center px-6 text-center"
      >
        <span className="text-slate-400 text-xs sm:text-lg font-medium uppercase tracking-[0.1em] mb-8">
          {taskText || "Вставьте пропущенное слово"}
        </span>

        {/* Предложение с пропуском */}
        <div className="text-4xl sm:text-6xl font-bold text-[#1e293b] leading-relaxed flex flex-wrap justify-center items-center gap-3">
          <span>{parts[0]}</span>
          <motion.span 
            animate={isFinished ? { scale: [1, 1.1, 1], color: '#22c55e' } : {}}
            className={`
              min-w-[120px] border-b-4 sm:border-b-8 px-4 py-1 inline-block transition-all
              ${isFinished ? "border-green-500 text-green-500" : "border-blue-500 text-blue-500 bg-blue-50"}
              ${!isFinished ? "animate-pulse" : ""}
            `}
          >
            {isFinished ? correctAnswer : "?"}
          </motion.span>
          <span>{parts[1]}</span>
        </div>
      </motion.div>

      {/* Сетка ответов (используем ту же логику, что и раньше) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {options.map((option, index) => {
          const isWrong = wrongAnswers.includes(option);
          const isRight = isFinished && option === correctAnswer;

          return (
            <motion.button
              key={index}
              animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              onClick={() => onAnswer(option)}
              disabled={isWrong || isFinished}
              className={`
                min-h-[80px] sm:h-32 rounded-[20px] sm:rounded-[32px] 
                text-xl sm:text-3xl font-bold transition-all duration-300
                flex items-center justify-center p-4 border-b-4 sm:border-b-8
                ${!isWrong && !isRight ? "bg-white border-slate-200 text-slate-700 shadow-md" : ""}
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

export default FillInBlanksCard;