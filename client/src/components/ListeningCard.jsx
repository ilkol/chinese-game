import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

window.speechSynthesis.getVoices();

const ListeningCard = ({ taskText, audioText, options, onAnswer, wrongAnswers, isFinished, correctAnswer }) => {
  
	const playAudio = () => {
		// Останавливаем текущую речь, если она уже идет
		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(audioText);
		
		// Получаем список всех доступных голосов в системе
		const voices = window.speechSynthesis.getVoices();
		
		// Пытаемся найти именно китайский голос
		const chineseVoice = voices.find(voice => 
			voice.lang.includes('zh-CN') || voice.lang.includes('zh-TW') || voice.lang.includes('zh')
		);

		if (chineseVoice) {
			utterance.voice = chineseVoice;
		}

		utterance.lang = 'zh-CN';
		utterance.rate = 0.7; // Сделаем чуть помедленнее, чтобы лучше слышать слоги
		utterance.pitch = 1;

		window.speechSynthesis.speak(utterance);
	};

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-8 p-2 sm:p-4">
      {/* Карточка с кнопкой прослушивания */}
      <motion.div 
        className="bg-white rounded-[24px] sm:rounded-[40px] py-10 sm:py-16 shadow-xl border-2 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <span className="text-slate-400 text-xs sm:text-lg font-medium uppercase tracking-[0.1em] mb-6 px-4 text-center">
          {taskText || "Прослушайте и выберите правильный вариант"}
        </span>
        
        {/* Кнопка воспроизведения */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={playAudio}
          className="w-32 h-32 sm:w-48 sm:h-48 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 text-white transition-colors hover:bg-blue-600"
        >
          <Volume2 size={64} className="sm:hidden" /> {/* Маленькая иконка для мобилок */}
          <Volume2 size={96} className="hidden sm:block" /> {/* Большая для проектора */}
        </motion.button>

        <p className="mt-6 text-slate-400 text-sm font-medium italic">Нажми, чтобы прослушать</p>
      </motion.div>

      {/* Сетка ответов (та же логика, что в QuizCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {options.map((option, index) => {
          const isWrong = wrongAnswers.includes(option);			
          const isCorrectChoice = option === correctAnswer;
          const isRight = isFinished && isCorrectChoice;

          return (
            <motion.button
              key={index}
              animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
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

export default ListeningCard;
