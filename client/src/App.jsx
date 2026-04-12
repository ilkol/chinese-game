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
import MapView from './views/MapView';
import QuizView from './views/QuizView';
import VictoryModal from './components/VictoryModal';
import AuthView from './views/AuthView';
import axios from 'axios';

// const LEVELS_DATA = [
// 	{ id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
// 	{ id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
// ];

// const THEORY_SLIDES = [
// 	{ type: 'text', header: 'Нихао!', content: 'Это самое базовое приветствие. Дословно: Ты (nǐ) + Хорошо (hǎo).' },
// 	{ type: 'hanzi', char: '你好', pinyin: 'nǐ hǎo', translation: 'Привет / Здравствуйте' },
// 	{ type: 'video', header: 'Тональность', url: 'https://youtube.com' }
// ];


// function App() {

// 	const [selectedLevel, setSelectedLevel] = useState(null);
// 	
// 	const [isModalOpened, setIsModalOpen] = useState(false);



// 	useEffect(() => {
// 		getLevels().then(data => {
// 			setLevels(data);
// 			setLoading(false);
// 		});
// 	}, []);

// 	if (loading) {
// 		return (
// 			<div className="h-screen w-screen flex items-center justify-center bg-[#020617] text-white font-bold">
// 				ЗАГРУЗКА ВСЕЛЕННОЙ...
// 			</div>
// 		);
// 	}


// 	return (
// 		<div className="min-h-screen bg-slate-50">
// 			{/* 1. ЭКРАН КАРТЫ */}
// 			{view === 'map' && (
// 				<MapView
// 					levels={levels}
// 					onSelectLevel={handleSelectLevel}
// 					activePlanetId={activePlanetId}

// 					isModalOpened={isModalOpened}
// 					selectedLevel={selectedLevel}
// 					onCloseModal={handleCloseModal}
// 					onStartTopic={startTopic}
// 				/>
// 			)}

// 			{/* 2. МЕНЮ ТЕМЫ (Список шагов) */}
// 			{view === 'topic_menu' && (
// 				<>
// 					<TopicMenu
// 						level={selectedLevel}
// 						progress={progress}
// 						onBack={() => setView('map')}
// 						onStartStep={handleStartStep}
// 					/>
// 					<VictoryModal
// 						isOpen={showVictory}
// 						topicTitle={selectedLevel.title}
// 						onClose={() => {
// 							setShowVictory(false);
// 							setView('map'); // После победы выходим на карту
// 						}}
// 					/>
// 				</>

// 			)}

// 			{/* 3. ЭКРАН ТЕОРИИ */}
// 			{view === 'theory' && (
// 				<TheoryReader
// 					title={selectedLevel.title}
// 					slides={selectedLevel.theory}
// 					onFinish={completeTheory}
// 				/>
// 			)}
// 			{view === 'quiz' && selectedLevel && (
// 				<QuizView
// 					questionData={currentQuestions[currentQuestionIndex]}
// 					onAnswer={handleAnswer}
// 					wrongAnswers={wrongAnswers}
// 					isFinished={isFinished}
// 				/>
// 			)}
// 		</div>
// 	);
// }


function App() {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState('map'); // 'map' или 'topic'
	const [levels, setLevels] = useState([]);

	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [progress, setProgress] = useState(() => {
		const savedUser = localStorage.getItem('user');
		if (savedUser) {
			const parsedUser = JSON.parse(savedUser);
			return parsedUser.progress || {};
		}
		return {};
	});

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [activeStep, setActiveStep] = useState(null); // 'theory', 'quiz1', 'quiz2', 'final'
	const [isModalOpened, setIsModalOpen] = useState(false);
	const [wrongAnswers, setWrongAnswers] = useState([]);
	const [isFinished, setIsFinished] = useState(false);
	const [currentQuestions, setCurrentQuestions] = useState([]);
	const [showVictory, setShowVictory] = useState(false);


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

	const handleAnswer = (option) => {
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
					if (activeStep === 'final') {
						setView('topic_menu'); // Возвращаемся в меню
						setTimeout(() => setShowVictory(true), 500); // Показываем победу через полсекунды
					} else {
						setView('topic_menu');
					}
				}
			}, 1500);
		} else {
			if (!wrongAnswers.includes(option)) {
				setWrongAnswers([...wrongAnswers, option]);
			}
		}
	};


	const handleStartStep = (step) => {
		setCurrentQuestionIndex(prev => prev + 1);
		setActiveStep(step.id);
		setWrongAnswers([]);
		setIsFinished(false);
		setCurrentQuestionIndex(0);

		if (step.type === 'theory') {
			setView('theory');
		} else {
			const index = step.id.includes('-') ? parseInt(step.id.split('-')[1]) : 0;
			const questions = step.type === 'final'
				? selectedLevel.final
				: selectedLevel.quizzes[index].questions;

			setCurrentQuestions(questions)
			setView('quiz');
		}
	};


	// Проверка сессии при загрузке
	useEffect(() => {
		getLevels().then(data => {
			setLevels(data);
			setLoading(false);
		});

	}, []);

	const saveProgress = async (stepId) => {
		const newProgress = { ...progress, [stepId]: true };
		setProgress(newProgress);

		try {
			const token = localStorage.getItem('token');
			await axios.post('http://localhost:5000/api/user/progress',
				{ levelId: selectedLevel.id, stepId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch (e) {
			console.error("Не удалось сохранить прогресс на сервере", e);
		}
	};

	const handleLogin = (userData) => {
		setUser(userData);
		setProgress(userData.progress || {});
		localStorage.setItem('user', JSON.stringify(userData));
		setView('map');
	};

	if (loading) return <div className="bg-[#020617] h-screen flex items-center justify-center text-white">ЗАГРУЗКА...</div>;

	if (!user) {
		return <AuthView onLogin={(userData) => {
			setUser(userData);
			setProgress(userData.progress || {}); // Загружаем прогресс из БД
			setView('map');
		}} />;
	}

	const completeTheory = () => {
		setProgress(prev => ({ ...prev, theory: true }));
		setView('topic_menu');
	};

	return (
		<div className="min-h-screen bg-slate-50">
			{/* 1. ЭКРАН КАРТЫ */}
			{view === 'map' && (
				<MapView
					levels={levels}
					onSelectLevel={handleSelectLevel}
					activePlanetId={activePlanetId}

					isModalOpened={isModalOpened}
					selectedLevel={selectedLevel}
					onCloseModal={handleCloseModal}
					onStartTopic={startTopic}
				/>
			)}

			{/* 2. МЕНЮ ТЕМЫ (Список шагов) */}
			{view === 'topic_menu' && (
				<>
					<TopicMenu
						level={selectedLevel}
						progress={progress}
						onBack={() => setView('map')}
						onStartStep={handleStartStep}
					/>
					<VictoryModal
						isOpen={showVictory}
						topicTitle={selectedLevel.title}
						onClose={() => {
							setShowVictory(false);
							setView('map'); // После победы выходим на карту
						}}
					/>
				</>

			)}

			{/* 3. ЭКРАН ТЕОРИИ */}
			{view === 'theory' && (
				<TheoryReader
					title={selectedLevel.title}
					slides={selectedLevel.theory}
					onFinish={completeTheory}
				/>
			)}
			{view === 'quiz' && selectedLevel && (
				<QuizView
					questionData={currentQuestions[currentQuestionIndex]}
					onAnswer={handleAnswer}
					wrongAnswers={wrongAnswers}
					isFinished={isFinished}
				/>
			)}
		</div>
	);

}

export default App;