import { useState } from 'react';
import { motion } from 'framer-motion';

const MatchingCard = ({ pairs, onComplete }) => {
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [selectedSecond, setSelectedSecond] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);

  // Стабильное перемешивание один раз при создании
  const [shuffledFist] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [shuffledSecond] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const checkMatch = (first, second) => {
    if (first.id === second.id) {
      const newMatched = [...matchedIds, first.id];
      setMatchedIds(newMatched);
      
      // Проверка на завершение всего уровня
      if (newMatched.length === pairs.length) {
        setTimeout(onComplete, 1000);
      }
    } else {
      // Если не совпало, даем визуальный отклик и сбрасываем
      setTimeout(() => {
        setSelectedFirst(null);
        setSelectedSecond(null);
      }, 500);
      return; 
    }
    // Сбрасываем выделение после успеха (без задержки)
    setSelectedFirst(null);
    setSelectedSecond(null);
  };

  const handleSelect = (type, item) => {
    if (matchedIds.includes(item.id)) return;

    if (type === 'first') {
      if (selectedSecond) {
        setSelectedFirst(item);
        checkMatch(item, selectedSecond);
      } else {
        setSelectedFirst(item === selectedFirst ? null : item);
      }
    } else {
      if (selectedFirst) {
        setSelectedSecond(item);
        checkMatch(selectedFirst, item);
      } else {
        setSelectedSecond(item === selectedSecond ? null : item);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 p-4">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 shadow-xl border-2 border-slate-100 text-center">
        <span className="text-slate-400 uppercase tracking-widest text-xs sm:text-sm font-bold">Соедините пары</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="flex flex-col gap-4">
          {shuffledFist.map((item) => (
            <MatchButton 
              key={item.id}
              text={item.first}
              isSelected={selectedFirst?.id === item.id}
              isMatched={matchedIds.includes(item.id)}
              onClick={() => handleSelect('first', item)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {shuffledSecond.map((item) => (
            <MatchButton 
              key={item.id}
              text={item.second}
              isSelected={selectedSecond?.id === item.id}
              isMatched={matchedIds.includes(item.id)}
              onClick={() => handleSelect('second', item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchButton = ({ text, isSelected, isMatched, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`
      h-20 sm:h-24 rounded-2xl text-xl sm:text-2xl font-bold transition-all duration-200 border-b-4
      ${isMatched ? "bg-green-100 border-green-500 text-green-600 opacity-50 pointer-events-none" : 
        isSelected ? "bg-blue-500 border-blue-700 text-white translate-y-1 border-b-0" : 
        "bg-white border-slate-200 text-slate-700 shadow-md"}
    `}
  >
    {text}
  </motion.button>
);

export default MatchingCard;
