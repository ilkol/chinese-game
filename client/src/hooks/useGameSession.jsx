import { useState, useCallback } from 'react';
import * as API from '../services/api';

export const useGameSession = (user, setUser) => {
	const [view, setView] = useState('map');
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [activeStepId, setActiveStepId] = useState(null);
	const [currentQuestions, setCurrentQuestions] = useState([]);
	const [showVictory, setShowVictory] = useState(false);

	const updateLocalProgress = useCallback((planetId, stepId) => {
		const currentPlanetProgress = user?.progress?.[planetId] || { theory: false, final: false, quizzes: [] };
		let updatedPlanetProgress;

		if (stepId.startsWith('quiz-')) {
			const index = parseInt(stepId.split('-')[1]);
			const newQuizzes = [...(currentPlanetProgress.quizzes || [])];
			newQuizzes[index] = true;
			updatedPlanetProgress = { ...currentPlanetProgress, quizzes: newQuizzes };
		} else {
			updatedPlanetProgress = { ...currentPlanetProgress, [stepId]: true };
		}

		const updatedUser = { ...user, progress: { ...user?.progress, [planetId]: updatedPlanetProgress } };
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	}, [user, setUser]);

	const completeStep = async (stepId) => {
		try {
			await API.saveUserProgress(selectedLevel.id, stepId);
			updateLocalProgress(selectedLevel.id, stepId);
			setView('topic_menu');
			if (stepId === 'final') setTimeout(() => setShowVictory(true), 500);
		} catch (e) {
			console.error("Save error:", e);
			setView('topic_menu');
		}
	};

	return {
		view, setView,
		selectedLevel, setSelectedLevel,
		activePlanetId, setActivePlanetId,
		activeStepId, setActiveStepId,
		currentQuestions, setCurrentQuestions,
		showVictory, setShowVictory,
		completeStep,
		updateLocalProgress
	};
};
