import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, ArrowLeft, PlayCircle, Trophy } from 'lucide-react';

const TopicMenu = ({ level, progress, onBack, onStartStep }) => {
  const steps = [
    { id: 'theory', title: 'Теория', icon: <BookOpen />, desc: 'Изучаем новые слова и правила', type: 'theory' },

    ...(level.quizzes || []).map((q, index) => ({
      id: `quiz-${index}`,
      title: q.title || `Тестирование ${index + 1}`,
      icon: <PlayCircle />,
      type: 'quiz',
      data: q.questions
    })),

    ...(level.final?.length ? [{ id: 'final', title: 'Итоговый тест', icon: <Trophy />, type: 'final' }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      {/* Шапка */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">{level.title}</h1>
        <div className="w-10" /> {/* для симметрии */}
      </div>

      {/* Список этапов */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {steps.map((step, index) => {
          const isUnlocked = index === 0 || progress[steps[index - 1].id] === true;
          const isCompleted = progress[step.id] === true;

          return (
            <motion.button
              key={step.id}
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
                  {/* Сама иконка этапа теперь видна ВСЕГДА */}
                  {step.icon}

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
                <h3 className={`font-bold ${isUnlocked ? "text-slate-800" : "text-slate-400"}`}>{step.title}</h3>
                <p className="text-xs text-slate-400">
                  {isCompleted ? "Завершено" : isUnlocked ? "Доступно" : "Заблокировано"}
                </p>
              </div>

              {isUnlocked && !isCompleted && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicMenu;
