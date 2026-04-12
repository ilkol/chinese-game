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
import { AnimatePresence, motion } from "framer-motion";
import GameLoader from "./components/GameLoader";

function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLanding, setIsLanding] = useState(false);

	const game = useGameSession(user, setUser);

	const quiz = useQuiz(game.currentQuestions, async () => {
		// Если играет УЧИТЕЛЬ
		if (user.role === 'teacher') {
			game.setView('topic_menu');
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


	if (loading) return <GameLoader />;
	if (!user)
		return <AuthView onLogin={(data) => {
			setUser(data);
			localStorage.setItem('user', JSON.stringify(data));
			if (data.role === 'teacher') {
				game.setView('teacher_panel');
			} else {
				game.setView('map');
			}
		}} />;

	return (
		<div className="min-h-screen bg-slate-50">

			<AnimatePresence mode="wait">

				{game.view === 'map' && (
					<motion.div
						key="map"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 1.2 }} // Карта чуть увеличивается при исчезновении
						transition={{ duration: 0.5 }}
					>

						<div className="relative h-screen">
							<MapView
								levels={levels}
								isLanding={isLanding}
								activePlanetId={game.activePlanetId}
								onSelectLevel={(lvl) => {
									game.setSelectedLevel(lvl);
									game.setActivePlanetId(lvl.id);
									setIsModalOpen(true);
								}}
								isModalOpened={isModalOpen}
								selectedLevel={game.selectedLevel}
								onCloseModal={() => {
									game.setSelectedLevel(null); game.setActivePlanetId(null);
									setIsModalOpen(false);
								}}
								onStartTopic={() => {
									setIsModalOpen(false);

									setIsLanding(true);

									setTimeout(() => {
										game.setView('topic_menu');
										setIsLanding(false); 
									}, 200);
								}}
							/>

							{user.role === 'teacher' && (
								<div className="absolute top-6 left-6 z-50">
									<button
										onClick={() => game.setView('teacher_panel')}
										className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:bg-blue-700 transition-all active:scale-95"
									>
										<LayoutDashboard size={20} />
										Вернуться в панель
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}

				{(game.view === 'topic_menu') && (
					<motion.div
						initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
						animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="min-h-screen bg-white"
					>
						<TopicMenu
							level={game.selectedLevel}
							// Если учитель — передаем "фейковый" прогресс, где всё true, 
							// чтобы кнопки были активны. Если ученик — реальный.
							progress={user.role === 'teacher'
								? { theory: true, quiz1: true, quiz2: true, final: true, quizzes: [true, true, true, true] }
								: (user.progress[game.selectedLevel.id] || {})
							}
							onBack={() => {
								game.setView('map');
								game.setSelectedLevel(null);
								game.setActivePlanetId(null);
							}}
							onStartStep={handleStartStep}
							isTeacher={user.role === 'teacher'}
						/>
						<VictoryModal
							isOpen={game.showVictory}
							topicTitle={game.selectedLevel?.title}
							onClose={() => game.setShowVictory(false)}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 2. ПАНЕЛЬ УЧИТЕЛЯ */}
			{user.role === 'teacher' && game.view === 'teacher_panel' && (
				<TeacherView
					levels={levels}
					onStartActivity={handleStartStep}
					onOpenMap={() => game.setView('map')}
				/>
			)}

			{/* 4. ОБЩИЕ ИГРОВЫЕ ЭКРАНЫ (Теория и Квиз) */}
			{game.view === 'theory' && (
				<TheoryReader
					title={game.selectedLevel?.title}
					slides={game.selectedLevel?.theory}
					onFinish={() => game.setView('topic_menu')}
				/>
			)}

			{game.view === 'quiz' && (
				<QuizView
					questionData={game.currentQuestions[quiz.currentIndex]}
					{...quiz}
				/>
			)}

			{/* МОДАЛКА ПОБЕДЫ */}
			<VictoryModal
				isOpen={game.showVictory}
				topicTitle={game.selectedLevel?.title}
				onClose={() => game.setShowVictory(false)}
			/>
		</div>
	);

}

export default App;