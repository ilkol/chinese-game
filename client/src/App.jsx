import { useEffect, useState } from "react";
import { useGameSession } from "./hooks/useGameSession";
import useQuiz from "./hooks/useQuiz";
import * as API from './services/api';

import MapView from "./views/MapView";
import TopicMenu from "./components/TopicMenu";
import TheoryReader from "./components/TheoryReader";
import QuizView from "./views/QuizView";
import VictoryModal from "./components/VictoryModal";
import AuthView from "./views/AuthView";
import TeacherView from "./views/TeacherView";
import { LayoutDashboard } from "lucide-react";

function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);

	const game = useGameSession(user, setUser);

	const quiz = useQuiz(game.currentQuestions, async () => {
		// Если играет УЧИТЕЛЬ
		if (user.role === 'teacher') {
			game.setView('map'); // Возвращаем в админку
			game.setCurrentQuestions([]); // Чистим вопросы
			return;
		}

		// Если играет УЧЕНИК (твоя текущая логика)
		try {
			await API.saveUserProgress(game.selectedLevel.id, game.activeStepId);
			game.updateLocalProgress(game.selectedLevel.id, game.activeStepId);

			if (game.activeStepId === 'final') {
				game.setView('topic_menu');
				setTimeout(() => game.setShowVictory(true), 500);
			} else {
				game.setView('topic_menu');
			}
		} catch (e) {
			console.error("Ошибка сохранения:", e);
			game.setView('topic_menu');
		}
	});


	useEffect(() => {
		API.getLevels().then(data => { setLevels(data); setLoading(false); });
	}, []);

	// App.jsx
	const handleStartStep = (step, levelFromTeacher = null) => {
		// Берем уровень либо из аргумента (учитель), либо из стейта (ученик)
		const targetLevel = levelFromTeacher || game.selectedLevel;

		if (!targetLevel) {
			console.error("Уровень не определен");
			return;
		}

		// Если это учитель, обновляем стейт уровня, чтобы TheoryReader его увидел
		if (levelFromTeacher) {
			game.setSelectedLevel(levelFromTeacher);
		}

		game.setActiveStepId(step.id);
		quiz.resetQuiz();

		if (step.type === 'theory') {
			game.setView('theory');
		} else {
			// Парсим индекс: из "quiz-0" получаем 0
			const idx = step.id.includes('-') ? parseInt(step.id.split('-')[1]) : 0;

			const questions = step.id === 'final'
				? targetLevel.final
				: targetLevel.quizzes?.[idx]?.questions || [];

			game.setCurrentQuestions(questions);
			game.setView('quiz');
		}
	};


	if (loading) return <div className="loader">ЗАГРУЗКА...</div>;
	if (!user) return <AuthView onLogin={(data) => { setUser(data); localStorage.setItem('user', JSON.stringify(data)); }} />;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* ЛОГИКА УЧИТЕЛЯ */}
			{user.role === 'teacher' && (
				<>
					{/* Если режим 'map' — показываем карту с кнопкой возврата в панель */}
					{game.view === 'map' && (
						<div className="relative h-screen">
							<MapView
								levels={levels}
								activePlanetId={game.activePlanetId}
								onSelectLevel={(lvl) => { game.setSelectedLevel(lvl); game.setActivePlanetId(lvl.id); }}
								isModalOpened={!!game.selectedLevel}
								selectedLevel={game.selectedLevel}
								onCloseModal={() => { game.setSelectedLevel(null); game.setActivePlanetId(null); }}
								onStartTopic={() => game.setView('topic_menu')}
							/>

							{/* Кнопка возврата в панель учителя поверх карты */}
							<div className="absolute top-6 left-6 z-50">
								<button
									onClick={() => game.setView('teacher_panel')}
									className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:bg-blue-700 transition-all active:scale-95"
								>
									<LayoutDashboard size={20} />
									Вернуться в панель
								</button>
							</div>
						</div>
					)}

					{/* Если режим 'teacher_panel' — показываем твою TeacherView */}
					{game.view === 'teacher_panel' && (
						<TeacherView
							levels={levels}
							onStartActivity={handleStartStep}
							onOpenMap={() => game.setView('map')} // Передаем функцию открытия карты
						/>
					)}
				</>
			)}

			{/* ОБЩИЕ ИГРОВЫЕ ЭКРАНЫ (доступны и ученику, и учителю для показа на доске) */}
			{game.view === 'theory' && (
				<TheoryReader
					title={game.selectedLevel?.title}
					slides={game.selectedLevel?.theory}
					onFinish={() => game.setView(user.role === 'teacher' ? 'map' : 'topic_menu')}
				/>
			)}

			{game.view === 'quiz' && (
				<QuizView
					questionData={game.currentQuestions[quiz.currentIndex]}
					{...quiz}
				/>
			)}

			{/* ЛОГИКА УЧЕНИКА (Карта и Меню темы) */}
			{user.role === 'student' && (
				<>
					{game.view === 'map' && (
						<MapView
							levels={levels}
							activePlanetId={game.activePlanetId}
							onSelectLevel={(lvl) => { game.setSelectedLevel(lvl); game.setActivePlanetId(lvl.id); }}
							isModalOpened={!!game.selectedLevel}
							selectedLevel={game.selectedLevel}
							onCloseModal={() => { game.setSelectedLevel(null); game.setActivePlanetId(null); }}
							onStartTopic={() => game.setView('topic_menu')}
						/>
					)}

					{game.view === 'topic_menu' && (
						<TopicMenu
							level={game.selectedLevel}
							progress={user.progress[game.selectedLevel.id] || {}}
							onBack={() => game.setView('map')}
							onStartStep={handleStartStep}
						/>
					)}
				</>
			)}

			<VictoryModal
				isOpen={game.showVictory}
				topicTitle={game.selectedLevel?.title}
				onClose={() => game.setShowVictory(false)}
			/>
		</div>
	);
}

export default App;