import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Star } from 'lucide-react';
import { useEffect } from 'react';
import { fireConfetti } from '../utils/effects';

const VictoryModal = ({ isOpen, onClose, topicTitle }) => {
  // Запускаем конфетти при открытии
  useEffect(() => {
    if (isOpen) fireConfetti();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Фон с размытием */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />

          {/* Карточка победы */}
          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative bg-white rounded-[40px] p-8 w-full max-w-sm text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* Иконка кубка с анимацией */}
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200 text-white"
            >
              <Trophy size={48} strokeWidth={2.5} />
            </motion.div>

            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase">Великолепно!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Вы полностью завершили тему <br/>
              <span className="font-bold text-slate-700 italic">«{topicTitle}»</span>
            </p>

            {/* <div className="flex justify-center gap-2 mb-8 text-yellow-400">
                {[...Array(3)].map((_, i) => <Star key={i} fill="currentColor" size={32} />)}
            </div> */}

            <button
              onClick={onClose}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              ВЕРНУТЬСЯ НА КАРТУ <ArrowRight />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VictoryModal;
