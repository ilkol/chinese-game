import { useEffect, useState, useCallback } from 'react';
import * as API from './services/api';
import { useQuiz } from './hooks/useQuiz';

// Views & Components
import MapView from './views/MapView';
import QuizView from './views/QuizView';
import TopicMenu from './components/TopicMenu';
import TheoryReader from './components/TheoryReader';
import VictoryModal from './components/VictoryModal';
import AuthView from './views/AuthView';

function App() {
	// --- СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ И ДАННЫХ ---
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);

	// --- НАВИГАЦИЯ ---
	const [view, setView] = useState('map'); // 'map', 'topic_menu', 'theory', 'quiz'
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [activeStepId, setActiveStepId] = useState(null); // 'theory', 'quiz-0', etc.

	// --- СОСТОЯНИЕ ИГРЫ ---
	const [currentQuestions, setCurrentQuestions] = useState([]);
	const [showVictory, setShowVictory] = useState(false);

	const updateLocalProgress = useCallback((planetId, stepId) => {
		const currentPlanetProgress = user?.progress?.[planetId] || {
			theory: false,
			final: false,
			quizzes: []
		};

		let updatedPlanetProgress;

		if (stepId.startsWith('quiz-')) {
			// Извлекаем индекс из "quiz-0", "quiz-1"
			const index = parseInt(stepId.split('-')[1]);
			const newQuizzes = [...(currentPlanetProgress.quizzes || [])];
			newQuizzes[index] = true; // Ставим true для пройденного теста

			updatedPlanetProgress = {
				...currentPlanetProgress,
				quizzes: newQuizzes
			};
		} else {
			// Для 'theory' или 'final' просто ставим флаг
			updatedPlanetProgress = {
				...currentPlanetProgress,
				[stepId]: true
			};
		}

		const updatedUser = {
			...user,
			progress: {
				...user?.progress,
				[planetId]: updatedPlanetProgress
			}
		};

		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	}, [user]);

	// --- ЛОГИКА ТЕСТА (через кастомный хук) ---
	const quiz = useQuiz(currentQuestions, async () => {
		try {
			await API.saveUserProgress(selectedLevel.id, activeStepId);
			updateLocalProgress(selectedLevel.id, activeStepId);

			setView('topic_menu');
			if (activeStepId === 'final') {
				setTimeout(() => setShowVictory(true), 500);
			}
		} catch (e) {
			console.error("Ошибка при сохранении прогресса квиза:", e);
			setView('topic_menu');
		}
	});

	// --- ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ ---
	useEffect(() => {
		API.getLevels()
			.then(data => {
				setLevels(data);
				setLoading(false);
			})
			.catch(err => {
				console.error("Ошибка загрузки уровней:", err);
				setLoading(false);
			});
	}, []);

	// --- ОБРАБОТЧИКИ СОБЫТИЙ ---
	const handleLogin = (userData) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
		localStorage.setItem('token', userData.token); // Если токен приходит отдельно
		setView('map');
	};

	const handleStartStep = (step) => {
		setActiveStepId(step.id);
		quiz.resetQuiz();

		if (step.type === 'theory') {
			setView('theory');
		} else {
			// Защищенный парсинг индекса: quiz-0, quiz-1...
			const quizIndex = step.id.includes('-') ? parseInt(step.id.split('-')[1]) : 0;

			const questions = step.type === 'final'
				? selectedLevel.final
				: selectedLevel.quizzes?.[quizIndex]?.questions || [];

			if (questions.length === 0) {
				console.error("Вопросы не найдены для шага:", step.id);
				return;
			}

			setCurrentQuestions(questions);
			setView('quiz');
		}
	};

	const handleTheoryFinished = async () => {
		try {
			await API.saveUserProgress(selectedLevel.id, 'theory');
			updateLocalProgress(selectedLevel.id, 'theory');
			setView('topic_menu');
		} catch (e) {
			console.error("Ошибка сохранения теории:", e);
			setView('topic_menu');
		}
	};


	// --- РЕНДЕРИНГ ---
	if (loading) {
		return (
			<div className="h-screen bg-[#020617] flex items-center justify-center text-white font-bold tracking-widest">
				ЗАГРУЗКА ВСЕЛЕННОЙ...
			</div>
		);
	}

	if (!user) {
		return <AuthView onLogin={handleLogin} />;
	}

	console.log(user);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
			{/* 1. КАРТА МИРА */}
			{view === 'map' && (
				<MapView
					levels={levels}
					activePlanetId={activePlanetId}
					onSelectLevel={(lvl) => {
						setSelectedLevel(lvl);
						setActivePlanetId(lvl.id);
					}}
					isModalOpened={!!selectedLevel}
					selectedLevel={selectedLevel}
					onCloseModal={() => { setSelectedLevel(null); setActivePlanetId(null); }}
					onStartTopic={() => setView('topic_menu')}
				/>
			)}

			{/* 2. МЕНЮ ТЕМЫ */}
			{view === 'topic_menu' && (
				<>
					<TopicMenu
						level={selectedLevel}
						progress={user.progress[selectedLevel.id] || {}}
						onBack={() => setView('map')}
						onStartStep={handleStartStep}
					/>
					<VictoryModal
						isOpen={showVictory}
						topicTitle={selectedLevel?.title}
						onClose={() => setShowVictory(false)}
					/>
				</>
			)}

			{/* 3. ЧИТАЛКА ТЕОРИИ */}
			{view === 'theory' && (
				<TheoryReader
					title={selectedLevel?.title}
					slides={selectedLevel?.theory || []}
					onFinish={handleTheoryFinished}
				/>
			)}

			{/* 4. ИГРОВОЙ ЭКРАН (КВИЗ) */}
			{view === 'quiz' && (
				<QuizView
					questionData={currentQuestions[quiz.currentIndex]}
					currentIndex={quiz.currentIndex}
					totalQuestions={currentQuestions.length}
					onAnswer={quiz.handleAnswer}
					wrongAnswers={quiz.wrongAnswers}
					isFinished={quiz.isFinished}
				/>
			)}
		</div>
	);
}

export default App;
