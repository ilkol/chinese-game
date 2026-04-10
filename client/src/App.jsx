import { useEffect, useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';
import LevelModal from './components/LevelModal';
import TopicMenu from './components/TopicMenu';
import TheoryReader from './components/TheoryReader';

const LEVELS_DATA = [
	{ id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
	{ id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
];

const THEORY_SLIDES = [
	{ type: 'text', header: 'Нихао!', content: 'Это самое базовое приветствие. Дословно: Ты (nǐ) + Хорошо (hǎo).' },
	{ type: 'hanzi', char: '你好', pinyin: 'nǐ hǎo', translation: 'Привет / Здравствуйте' },
	{ type: 'video', header: 'Тональность', url: 'https://youtube.com' }
];


function App() {
	const [view, setView] = useState('map'); // 'map' или 'topic'
	const [progress, setProgress] = useState({
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

	const startTopic = () => {
		setIsModalOpen(false);
		setTimeout(() => setView('topic_menu'), 300);
		// setView('topic_menu');
	};
	const startStep = (stepId) => {
		if (stepId === 'theory') setView('theory');
		if (stepId === 'quiz1') console.log('Запуск теста 1'); // Сюда позже прикрутим твои Quiz компоненты
	};

	const completeTheory = () => {
		setProgress(prev => ({ ...prev, theory: true }));
		setView('topic_menu');
	};

	useEffect(() => {
		console.log("Теперь activePlanetId действительно изменился:", activePlanetId);
	}, [activePlanetId]);


	return (
		<div className="min-h-screen bg-slate-50">
			{/* 1. ЭКРАН КАРТЫ */}
			{view === 'map' && (
				<>
					<SpaceMap
						levels={LEVELS_DATA}
						onSelectLevel={handleSelectLevel}
						activePlanetId={activePlanetId}
					/>
					<LevelModal
						isOpen={isModalOpened}
						level={selectedLevel}
						onClose={handleCloseModal}
						onStart={startTopic}
					/>
				</>
			)}

			{/* 2. МЕНЮ ТЕМЫ (Список шагов) */}
			{view === 'topic_menu' && (
				<TopicMenu
					level={selectedLevel}
					progress={progress}
					onBack={() => setView('map')}
					onStartStep={startStep}
				/>
			)}

			{/* 3. ЭКРАН ТЕОРИИ */}
			{view === 'theory' && (
				<TheoryReader
					title={selectedLevel.title}
					slides={THEORY_SLIDES}
					onFinish={completeTheory}
				/>
			)}
		</div>
	);
}

export default App;
