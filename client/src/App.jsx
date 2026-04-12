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

function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);

	const game = useGameSession(user, setUser);

	const quiz = useQuiz(game.currentQuestions, () => game.completeStep(game.activeStepId));

	useEffect(() => {
		API.getLevels().then(data => { setLevels(data); setLoading(false); });
	}, []);

	const handleStartStep = (step, levelFromTeacher = null) => {
		if (levelFromTeacher) {
			game.setSelectedLevel(levelFromTeacher);
		}
		game.setActiveStepId(step.id);
		quiz.resetQuiz();
		if (step.type === 'theory') {
			game.setView('theory');
		} else {
			const idx = step.id.includes('-') ? parseInt(step.id.split('-')[1]) : 0;
			game.setCurrentQuestions(step.type === 'final' ? game.selectedLevel.final : game.selectedLevel.quizzes?.[idx]?.questions || []);
			game.setView('quiz');
		}
	};

	if (loading) return <div className="loader">ЗАГРУЗКА...</div>;
	if (!user) return <AuthView onLogin={(data) => { setUser(data); localStorage.setItem('user', JSON.stringify(data)); }} />;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* ЛОГИКА УЧИТЕЛЯ */}
			{user.role === 'teacher' && game.view === 'map' && (
				<TeacherView
					levels={levels}
					onStartActivity={handleStartStep} // Используем ту же функцию запуска, что и у ученика
				/>
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