import { motion } from 'framer-motion';

const QuizCard = ({ taskText, question, options, onAnswer, wrongAnswers, isFinished, correctAnswer }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 p-4">
      <motion.div className="bg-white rounded-[40px] py-12 shadow-2xl border-2 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Текст задания */}
        <span className="text-slate-400 text-lg font-medium uppercase tracking-[0.2em] mb-6">
          {taskText || "Как переводится иероглиф?"}
        </span>
        
        {/* Сам иероглиф */}
        <h2 className="text-9xl font-bold text-[#1e293b] leading-tight">
          {question}
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {options.map((option, index) => {
          const isWrong = wrongAnswers.includes(option);			
          const isCorrectChoice = option === correctAnswer;
          const isRight = isFinished && isCorrectChoice;

          return (
            <motion.button
              key={index}
              animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
              whileHover={!isWrong && !isFinished ? { scale: 1.02 } : {}}
              whileTap={!isWrong && !isFinished ? { scale: 0.95 } : {}}
              onClick={() => onAnswer(option)}
              disabled={isWrong || isFinished}
              className={`
                h-40 rounded-[32px] text-3xl font-bold transition-all duration-300
                flex items-center justify-center p-4 text-center border-b-8
                ${!isWrong && !isRight 
                  ? "bg-white border-slate-200 text-slate-700 shadow-lg hover:shadow-blue-50" 
                  : ""
                }
                ${isWrong ? "bg-red-100 border-red-300 text-red-400 opacity-50 border-b-0 translate-y-2" : ""}
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
