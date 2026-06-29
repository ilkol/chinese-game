import { useState, useCallback } from 'react';
import * as API from '../services/api';

export const useGameSession = (user, setUser) => {
	const [view, setView] = useState('map');
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [selectedLevelStep, setSelectedLevelStep] = useState(null);
	const [activePlanetId, setActivePlanetId] = useState(1);
	const [activeStepId, setActiveStepId] = useState(null);
	const [currentQuestions, setCurrentQuestions] = useState([]);
	const [showVictory, setShowVictory] = useState(false);

	const updateLocalProgress = useCallback((levelId, stepId) => {
		// TODO: обновить когда будет готова структура прогресса
	}, []);

	const completeStep = useCallback(async () => {
		try {
			await API.saveUserProgress(activeStepId);
			updateLocalProgress(selectedLevel?.id, activeStepId);

			if (selectedLevelStep?.type === 'final') {
				setTimeout(() => setShowVictory(true), 500);
			}
			window.history.back();
		} catch (e) {
			console.error('Ошибка сохранения прогресса:', e);
			window.history.back();
		}
	}, [activeStepId, selectedLevel, selectedLevelStep]);

	return {
		view, setView,
		selectedLevel, setSelectedLevel,
		selectedLevelStep, setSelectedLevelStep,
		activePlanetId, setActivePlanetId,
		activeStepId, setActiveStepId,
		currentQuestions, setCurrentQuestions,
		showVictory, setShowVictory,
		completeStep,
		updateLocalProgress,
	};
};