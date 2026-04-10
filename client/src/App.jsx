import { useEffect, useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';
import LevelModal from './components/LevelModal';
import TopicMenu from './components/TopicMenu';

function App() {
	const [view, setView] = useState('map'); // 'map' или 'topic'
	const [topicProgress, setTopicProgress] = useState({
		theory: true,      // Теория открыта всегда
		quiz1: false,      // Тест 1 закрыт
		quiz2: false,      // Тест 2 закрыт
		final: false       // Итог закрыт
	});

	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [isModalOpened, setIsModalOpen] = useState(false);

	const levels = [
		{ id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
		{ id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
		// ... остальные уровни
	];

	const handleSelectLevel = (level) => {
		setIsModalOpen(true);
		setSelectedLevel(level);
		setActivePlanetId(level.id);

		console.log(level.id);
		console.log(activePlanetId);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedLevel(null);
		setActivePlanetId(null); // Карта сама вернется в обзорный режим
	};

	useEffect(() => {
		console.log("Теперь activePlanetId действительно изменился:", activePlanetId);
	}, [activePlanetId]);

	const handleStartGame = (level) => {
		setIsModalOpen(false);
		setTimeout(() => setView('topic'), 300);
	};

	return (
		<div className="relative min-h-screen bg-slate-50">
			{view === 'map' ? (
				<>
					<SpaceMap
						levels={levels}
						onSelectLevel={handleSelectLevel}
						activePlanetId={activePlanetId}
					/>
					{selectedLevel && (
						<LevelModal
							isOpen={isModalOpened}
							level={selectedLevel}
							onClose={handleCloseModal}
							onStart={handleStartGame}
						/>
					)}
				</>
			) : (
				<TopicMenu
					level={selectedLevel}
					progress={topicProgress}
					onBack={() => setView('map')}
					onStartStep={(stepId) => console.log("Начинаем этап:", stepId)}
				/>
			)}
		</div>
	);
}

export default App;
