import { useEffect, useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';
import LevelModal from './components/LevelModal';
import TopicMenu from './components/TopicMenu';
import TheoryReader from './components/TheoryReader';
import QuizCard from './components/QuizCard';
import ListeningCard from './components/ListeningCard';
import { getLevels } from './services/api';

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
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState('map'); // 'map' или 'topic'
	const [progress, setProgress] = useState({
		theory: true,      // Теория открыта всегда
		quiz1: false,      // Тест 1 закрыт
		quiz2: false,      // Тест 2 закрыт
		final: false       // Итог закрыт
	});
	const [activeStep, setActiveStep] = useState(null); // 'theory', 'quiz1', 'quiz2', 'final'
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [isModalOpened, setIsModalOpen] = useState(false);
	const [wrongAnswers, setWrongAnswers] = useState([]);
	const [isFinished, setIsFinished] = useState(false);


	const handleSelectLevel = (level) => {
		setIsModalOpen(true);
		setSelectedLevel(level);
		setActivePlanetId(level.id);
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
	const handleNextQuestion = () => {
		const questions = selectedLevel[activeStep]; // Берем массив вопросов для текущего этапа
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(prev => prev + 1);
		} else {
			// Если вопросы кончились — завершаем этап
			const nextProgress = { ...progress, [activeStep]: true };
			setProgress(nextProgress);
			setView('topic_menu');
			setActiveStep(null);
		}
	};

	const completeTheory = () => {
		setProgress(prev => ({ ...prev, theory: true }));
		setView('topic_menu');
	};

	const handleStartStep = (stepId) => {
		setActiveStep(stepId);
		setCurrentQuestionIndex(0);
		setWrongAnswers([]);
		setIsFinished(false);
		setView(stepId === 'theory' ? 'theory' : 'quiz');
	};

	const handleAnswer = (option) => {
		const currentQuestions = selectedLevel[activeStep];
		const currentQ = currentQuestions[currentQuestionIndex];

		if (option === currentQ.correctAnswer) {
			setIsFinished(true);
			setTimeout(() => {
				if (currentQuestionIndex < currentQuestions.length - 1) {
					// Переход к следующему вопросу
					setCurrentQuestionIndex(prev => prev + 1);
					setWrongAnswers([]);
					setIsFinished(false);
				} else {
					// Завершение всего теста
					setProgress(prev => ({ ...prev, [activeStep]: true }));
					setView('topic_menu');
				}
			}, 1500);
		} else {
			if (!wrongAnswers.includes(option)) {
				setWrongAnswers([...wrongAnswers, option]);
			}
		}
	};



	useEffect(() => {
		getLevels().then(data => {
			setLevels(data);
			setLoading(false);
		});
	}, [activePlanetId]);

	if (loading) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-[#020617] text-white font-bold">
				ЗАГРУЗКА ВСЕЛЕННОЙ...
			</div>
		);
	}


	return (
		<div className="min-h-screen bg-slate-50">
			{/* 1. ЭКРАН КАРТЫ */}
			{view === 'map' && (
				<>
					<SpaceMap
						levels={levels}
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
					onStartStep={handleStartStep}
				/>
			)}

			{/* 3. ЭКРАН ТЕОРИИ */}
			{view === 'theory' && (
				<TheoryReader
					title={selectedLevel.title}
					slides={levels[selectedLevel.id - 1].theory}
					onFinish={completeTheory}
				/>
			)}
			{view === 'quiz' && selectedLevel && (
				<div className="min-h-screen flex items-center justify-center p-4">
					{(() => {
						const qData = selectedLevel[activeStep][currentQuestionIndex];
						const props = { ...qData, onAnswer: handleAnswer, wrongAnswers, isFinished };

						if (qData.type === 'test') return <QuizCard {...props} />;
						if (qData.type === 'listening') return <ListeningCard {...props} />;
						if (qData.type === 'blank') return <FillInBlanksCard {...props} />;
						if (qData.type === 'matching') return <MatchingCard pairs={qData.pairs} onComplete={() => handleAnswer(qData.correctAnswer)} />;
					})()}
				</div>
			)}
		</div>
	);
}

export default App;
