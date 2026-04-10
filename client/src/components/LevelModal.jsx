import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, BookOpen, Star } from 'lucide-react';

const LevelModal = ({ isOpen, level, onClose, onStart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Само окно */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Декоративный градиент сверху */}
            <div className={`h-32 bg-gradient-to-br ${level.color} flex items-center justify-center text-7xl`}>
              {level.icon}
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                {level.title}
              </h2>
              <p className="text-white/60 text-sm mb-8">
                Освойте базовые иероглифы и выражения по теме «{level.title}»
              </p>

              {/* Статистика темы */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                  <BookOpen className="mx-auto mb-2 text-blue-400" size={24} />
                  <div className="text-white font-bold">12 слов</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                  <Star className="mx-auto mb-2 text-yellow-400" size={24} />
                  <div className="text-white font-bold">+500 очков</div>
                </div>
              </div>

              {/* Кнопка старта */}
              <button
                onClick={() => onStart(level)}
                className={`w-full py-5 rounded-2xl bg-gradient-to-r ${level.color} text-white font-black text-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3`}
              >
                <Play fill="currentColor" />
                ПОЕХАЛИ!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelModal;
