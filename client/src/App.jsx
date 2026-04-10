import { useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';
import LevelModal from './components/LevelModal';

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const levels = [
    { id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
    { id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
    // ... остальные уровни
  ];

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const handleStartGame = (level) => {
    console.log("Запуск игры для уровня:", level.title);
    setIsModalOpen(false);
    // Тут будет переключение на экран с вопросами
  };

  return (
    <div className="relative">
      <SpaceMap levels={levels} onSelectLevel={handleSelectLevel} />
      
      {selectedLevel && (
        <LevelModal 
          isOpen={isModalOpen}
          level={selectedLevel}
          onClose={() => setIsModalOpen(false)}
          onStart={handleStartGame}
        />
      )}
    </div>
  );
}

export default App;
