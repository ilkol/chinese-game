import { useEffect, useState } from "react";
import { useGameSession } from "./hooks/useGameSession";
import useQuiz from "./hooks/useQuiz";
import * as API from './services/api';


import TopicMenu from "./pages/TopicMenuPage";
import MapView from "./pages/MapPage";
import TheoryReader from "./features/theory/TheoryReader";
import QuizView from "./pages/LessonPage";
import VictoryModal from "./components/VictoryModal";
import AuthView from "./pages/AuthPage";
import TeacherView from "./pages/TeacherPage";
import IntroView from "./views/IntroView";
import { LayoutDashboard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import GameLoader from "./components/GameLoader";
import spaceBg from './assets/space.webp';
import OnboardingView from "./pages/OnboardingPage";
import DialogView from "./pages/DialogPage";
import PuzzleMap from "./views/CollectionView";

function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLanding, setIsLanding] = useState(false);
	const [navigationSource, setNavigationSource] = useState(null);

	const game = useGameSession(user, setUser);

	const handleFinishActivity = () => {
		if (user.role === 'teacher') {
			game.setView(navigationSource === 'map' ? 'topic_menu' : 'teacher_panel');
		} else {
			game.setView('topic_menu');
		}
	};

	const quiz = useQuiz(game.currentQuestions, async () => {
		if (user.role === 'teacher') {
			handleFinishActivity();
			game.setCurrentQuestions([]);
			return;
		}

		try {
			await API.saveUserProgress(game.activeStepId);
			game.updateLocalProgress(game.selectedLevel.id, game.activeStepId);

			if (game.selectedLevelStep.type === 'final') {
				game.setView('topic_menu');
				setTimeout(() => game.setShowVictory(true), 500);
			} else {
				game.setView('topic_menu');
			}
		} catch (e) {
			console.error("Ошибка сохранения:", e);
			game.setView('topic_menu');
		}
		game.setSelectedLevelStep(null)
	});


	useEffect(() => {
		const startTime = Date.now();
		const minLoadingTime = 1500; // Минимальное время показа лоадера в мс

		const finishLoading = () => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTime;
			const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

			// Ждем остаток времени, чтобы лоадер не мерцал
			setTimeout(() => {
				setLoading(false);
			}, remainingTime);
		};

		if(user) {
			// 1. Загружаем уровни
			API.getLevels(user.role === 'teacher').then(data => {
				setLevels(data);
	
				const img = new Image();
				img.src = spaceBg;
				img.onload = finishLoading;
				img.onerror = finishLoading; // На случай ошибки всё равно убираем лоадер
			}).catch(finishLoading);
		} else {
			finishLoading();
		}
	}, [user]);

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
			setNavigationSource('teacher_panel');
		}

		game.setActiveStepId(step.id);
		quiz.resetQuiz();

		game.setSelectedLevelStep(step)
		if (step.type === 'theory' || step.type === 'dialog') {
			game.setView(step.type);
		} else {
			const questions = step.content;

			game.setCurrentQuestions(questions);
			game.setView('quiz');
			
		}
	};


	return (
		<>
			<AnimatePresence>
				{loading && (
					<motion.div
						key="global-loader"
						exit={{ opacity: 0, scale: 1.1 }} // Плавное растворение с легким увеличением
						transition={{ duration: 0.8, ease: "easeInOut" }}
						className="fixed inset-0 z-[100]" // Всегда поверх всего
					>
						<GameLoader />
					</motion.div>
				)}
			</AnimatePresence>

			{!loading && !user && (
				<AuthView onLogin={(data, isNewUser) => {
					setUser(data);
					localStorage.setItem('user', JSON.stringify(data));
					if (data.role === 'teacher') {
						game.setView('teacher_panel');
					} else {
						if (isNewUser) {
							game.setView('intro');
						} else {
							game.setView('map');
						}
					}
				}} />
			)}

			{!loading && user && (
				<div className="min-h-screen bg-slate-50">

					<div className="min-h-screen bg-slate-50">

						<AnimatePresence mode="wait">

							{game.view === 'map' && (
								<motion.div
									key="map"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, scale: 1.1 }} // Карта плавно исчезает при входе в тему
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
												game.setSelectedLevel(null); 
												game.setActivePlanetId(null);
												setIsModalOpen(false);
											}}
											onStartTopic={() => {
												setNavigationSource('map');
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
								// <PuzzleMap />
							)}

							{game.view === 'intro' && (
								<IntroView onFinish={() => game.setView('onboarding')} />
							)}

							{game.view === 'onboarding' && (
								<OnboardingView onComplete={() => game.setView('map')} />
							)}
							{game.view === 'dialog' && (
								<DialogView onComplete={async () => {
									try {
										await API.saveUserProgress(game.activeStepId);

										game.updateLocalProgress(game.selectedLevelStep.id, game.activeStepId);
									} catch (e) {
										console.error("Ошибка сохранения:", e);
									} finally {
										handleFinishActivity();
									}

								}} color="purple-300" />
							)}

							{(game.view === 'topic_menu') && (
								<motion.div
									key="topic_menu"
									initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }} // Эффект влета
									animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
									exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }} // Эффект вылета (уменьшение)
									transition={{ duration: 0.5 }}
								>
									<TopicMenu
										level={game.selectedLevel}
										onBack={() => {
											game.setView('map');
											game.setSelectedLevel(null);
											game.setActivePlanetId(null);
										}}
										onStartStep={handleStartStep}
										isTeacher={user.role === 'teacher'}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* 2. ПАНЕЛЬ УЧИТЕЛЯ */}
						{user.role === 'teacher' && game.view === 'teacher_panel' && (
							<TeacherView
								user={user}
								levels={levels}
								onStartActivity={handleStartStep}
								onOpenMap={() => game.setView('map')}
							/>
						)}

						{/* 4. ОБЩИЕ ИГРОВЫЕ ЭКРАНЫ (Теория и Квиз) */}
						{game.view === 'theory' && (
							<TheoryReader
								title={game.selectedLevel?.title}
								slides={game.selectedLevelStep.content}
								onFinish={async () => {
									try {
										await API.saveUserProgress(game.activeStepId);

										game.updateLocalProgress(game.selectedLevelStep.id, game.activeStepId);
									} catch (e) {
										console.error("Ошибка сохранения:", e);
									} finally {
										handleFinishActivity();
									}

								}}
							/>
						)}

						{game.view === 'quiz' && (
							<QuizView
								stepDialog={game.selectedLevelStep?.dialog}
								questionData={game.currentQuestions[quiz.currentIndex]}
								{...quiz}
							/>
						)}

						{/* МОДАЛКА ПОБЕДЫ */}
						<VictoryModal
							isOpen={game.showVictory}
							topicTitle={game.selectedLevel?.title}
							onClose={() => {
								game.setShowVictory(false);
								game.setView('map');
							}}
						/>
					</div>
				</div>
			)}
		</>
	);

}

export default App;