import { useState } from 'react';
import { motion } from 'framer-motion';

const MatchingCard = ({ pairs, onComplete }) => {
  const [selectedHanzi, setSelectedHanzi] = useState(null);
  const [selectedPinyin, setSelectedPinyin] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);

  // Стабильное перемешивание один раз при создании
  const [shuffledHanzi] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [shuffledPinyin] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const checkMatch = (hanzi, pinyin) => {
    if (hanzi.id === pinyin.id) {
      const newMatched = [...matchedIds, hanzi.id];
      setMatchedIds(newMatched);
      
      // Проверка на завершение всего уровня
      if (newMatched.length === pairs.length) {
        setTimeout(onComplete, 1000);
      }
    } else {
      // Если не совпало, даем визуальный отклик и сбрасываем
      setTimeout(() => {
        setSelectedHanzi(null);
        setSelectedPinyin(null);
      }, 500);
      return; 
    }
    // Сбрасываем выделение после успеха (без задержки)
    setSelectedHanzi(null);
    setSelectedPinyin(null);
  };

  const handleSelect = (type, item) => {
    if (matchedIds.includes(item.id)) return;

    if (type === 'hanzi') {
      if (selectedPinyin) {
        setSelectedHanzi(item);
        checkMatch(item, selectedPinyin);
      } else {
        setSelectedHanzi(item === selectedHanzi ? null : item);
      }
    } else {
      if (selectedHanzi) {
        setSelectedPinyin(item);
        checkMatch(selectedHanzi, item);
      } else {
        setSelectedPinyin(item === selectedPinyin ? null : item);
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
          {shuffledHanzi.map((item) => (
            <MatchButton 
              key={item.id}
              text={item.hanzi}
              isSelected={selectedHanzi?.id === item.id}
              isMatched={matchedIds.includes(item.id)}
              onClick={() => handleSelect('hanzi', item)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {shuffledPinyin.map((item) => (
            <MatchButton 
              key={item.id}
              text={item.pinyin}
              isSelected={selectedPinyin?.id === item.id}
              isMatched={matchedIds.includes(item.id)}
              onClick={() => handleSelect('pinyin', item)}
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
