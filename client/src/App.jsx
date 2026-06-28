import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

import { useGameSession } from "./hooks/useGameSession";
import useQuiz from "./hooks/useQuiz";
import * as API from './services/api';
import spaceBg from '/assets/space.webp';

import AuthPage from "./pages/AuthPage";
import MapPage from "./pages/MapPage";
import TopicMenuPage from "./pages/TopicMenuPage";
import LessonPage from "./pages/LessonPage";
import DialogPage from "./pages/DialogPage";
import OnboardingPage from "./pages/OnboardingPage";
import TeacherPage from "./pages/TeacherPage";
import IntroPage from "./pages/IntroPage";
import AdminPage from "./pages/AdminPage";

import TheoryReader from "./features/theory/TheoryReader";
import GameLoader from "./components/GameLoader";
import VictoryModal from "./components/VictoryModal";

function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLanding, setIsLanding] = useState(false);
	const [navigationSource, setNavigationSource] = useState(null);

	const game = useGameSession(user, setUser);

	const quiz = useQuiz(game.currentQuestions, async () => {
		if (!user) {
			return;
		}
		if (user.role === 'teacher') {
			game.setCurrentQuestions([]);
			game.setView(navigationSource === 'map' ? 'topic_menu' : 'teacher_panel');
			return;
		}
		await game.completeStep();
	});

	useEffect(() => {
		const startTime = Date.now();
		const minLoadingTime = 1500;

		const finishLoading = () => {
			const elapsed = Date.now() - startTime;
			setTimeout(() => setLoading(false), Math.max(0, minLoadingTime - elapsed));
		};

		if (user) {
			API.getLevels(user.role === 'teacher')
				.then(data => {
					setLevels(data);
					const img = new Image();
					img.src = spaceBg;
					img.onload = finishLoading;
					img.onerror = finishLoading;
				})
				.catch(finishLoading);
		} else {
			finishLoading();
		}
	}, [user]);

	useEffect(() => {
		if (loading || !user) return;

		const stateToPush = {
			view: game.view,
			selectedLevel: game.selectedLevel,
			selectedLevelStep: game.selectedLevelStep,
			currentQuestions: game.currentQuestions,
			activePlanetId: game.activePlanetId,
			navigationSource: navigationSource
		};

		if (!window.history.state || window.history.state.view !== game.view) {
			window.history.pushState(stateToPush, '', `#${game.view}`);
		}
	}, [game.view, loading, user]);

	useEffect(() => {
		const handlePopState = (event) => {
			if (event.state && event.state.view) {
				const saved = event.state;

				game.setView(saved.view);
				game.setSelectedLevel(saved.selectedLevel);
				game.setSelectedLevelStep(saved.selectedLevelStep);
				game.setCurrentQuestions(saved.currentQuestions || []);
				game.setActivePlanetId(saved.activePlanetId);
				setNavigationSource(saved.navigationSource);
			} else {
				if (user) {
					if (user.role === 'admin') game.setView('admin_panel');
					else if (user.role === 'teacher') game.setView('teacher_panel');
					else game.setView('map');
				}
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [user]);

	const handleStartStep = (step, levelFromTeacher = null) => {
		const targetLevel = levelFromTeacher || game.selectedLevel;
		if (!targetLevel) return;

		if (levelFromTeacher) {
			game.setSelectedLevel(levelFromTeacher);
			setNavigationSource('teacher_panel');
		}

		game.setActiveStepId(step.id);
		game.setSelectedLevelStep(step);
		quiz.resetQuiz();

		if (step.type === 'theory' || step.type === 'dialog') {
			game.setView(step.type);
		} else {
			game.setCurrentQuestions(step.content);
			game.setView('quiz');
		}
	};

	const handleLogin = (data, isNewUser) => {
		setUser(data);
		localStorage.setItem('user', JSON.stringify(data));

		if (data.role === 'admin') {
			game.setView('admin_panel');
		} else if (data.role === 'teacher') {
			game.setView('teacher_panel');
		} else {
			game.setView(isNewUser ? 'intro' : 'map');
		}
	};

	const handleBackToMenu = () => {
		if (user.role === 'teacher') {
			game.setView(navigationSource === 'map' ? 'topic_menu' : 'teacher_panel');
		} else {
			window.history.back();
		}
	};

	if (loading) {
		return (
			<AnimatePresence>
				<motion.div
					key="global-loader"
					exit={{ opacity: 0, scale: 1.1 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					className="fixed inset-0 z-[100]"
				>
					<GameLoader />
				</motion.div>
			</AnimatePresence>
		);
	}

	if (!user) {
		return <AuthPage onLogin={handleLogin} />;
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<AnimatePresence mode="wait">

				{game.view === 'intro' && (
					<IntroPage key="intro" onFinish={() => game.setView('onboarding')} />
				)}

				{game.view === 'onboarding' && (
					<OnboardingPage key="onboarding" onComplete={() => game.setView('map')} />
				)}

				{game.view === 'map' && (
					<motion.div
						key="map"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 1.1 }}
						transition={{ duration: 0.5 }}
						className="relative h-screen"
					>
						<MapPage
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
						{user.role === 'admin' && (
							<div className="absolute top-6 left-6 z-50">
								<button
									onClick={() => game.setView('admin_panel')}
									className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:bg-red-700 transition-all active:scale-95"
								>
									<LayoutDashboard size={20} />
									Админка
								</button>
							</div>
						)}
					</motion.div>
				)}

				{game.view === 'topic_menu' && (
					<motion.div
						key="topic_menu"
						initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
						animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
						transition={{ duration: 0.5 }}
					>
						<TopicMenuPage
							level={game.selectedLevel}
							onBack={() => {
								window.history.back();
							}}
							onStartStep={handleStartStep}
							isTeacher={user.role === 'teacher'}
							backgroundSrc={game.selectedLevel?.background_src}
						/>
					</motion.div>
				)}

				{game.view === 'teacher_panel' && (
					<TeacherPage
						key="teacher_panel"
						user={user}
						levels={levels}
						onStartActivity={handleStartStep}
						onOpenMap={() => game.setView('map')}
					/>
				)}
				{game.view === 'admin_panel' && (
					<AdminPage
						key="admin_panel"
						onLogout={() => {
							localStorage.clear();
							window.location.reload();
						}}
					/>
				)}

				{game.view === 'dialog' && (
					<DialogPage
						key="dialog"
						onComplete={game.completeStep}
						backgroundSrc={game.selectedLevel?.background_src}
						dialog={game.selectedLevelStep?.content}
					/>
				)}

				{game.view === 'theory' && (
					<TheoryReader
						key="theory"
						title={game.selectedLevel?.title}
						slides={game.selectedLevelStep?.content}
						onFinish={game.completeStep}
						backgroundSrc={game.selectedLevel?.background_src}
					/>
				)}

				{game.view === 'quiz' && (
					<LessonPage
						key="quiz"
						backgroundSrc={game.selectedLevel?.background_src}
						stepDialog={game.selectedLevelStep?.dialog}
						questionData={game.currentQuestions[quiz.currentIndex]}
						{...quiz}
					/>
				)}

			</AnimatePresence>

			<VictoryModal
				isOpen={game.showVictory}
				topicTitle={game.selectedLevel?.title}
				onClose={() => {
					game.setShowVictory(false);
					game.setView('map');
				}}
			/>
		</div>
	);
}

export default App;