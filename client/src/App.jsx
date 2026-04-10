import { useEffect, useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';
import LevelModal from './components/LevelModal';

function App() {
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);

	const levels = [
		{ id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
		{ id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
		// ... остальные уровни
	];

	const handleSelectLevel = (level) => {
		setSelectedLevel(level);
		setActivePlanetId(level.id);
		
		console.log(level.id);
		console.log(activePlanetId);
	};
	const handleCloseModal = () => {
		setSelectedLevel(null);
		setActivePlanetId(null); // Карта сама вернется в обзорный режим
	};

	useEffect(() => {
		console.log("Теперь activePlanetId действительно изменился:", activePlanetId);
	}, [activePlanetId]);

	const handleStartGame = (level) => {
		console.log("Запуск игры для уровня:", level.title);
	};

	return (
		<div className="relative">
					
			<SpaceMap 
				levels={levels} 
				onSelectLevel={handleSelectLevel} 
				activePlanetId={activePlanetId}
			/>

			{selectedLevel && (
				<LevelModal
					isOpen={!!selectedLevel}
					level={selectedLevel}
					onClose={handleCloseModal}
					onStart={handleStartGame}
				/>
			)}
		</div>
	);
}

export default App;
