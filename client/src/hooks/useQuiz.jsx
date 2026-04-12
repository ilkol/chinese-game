import { useState } from 'react';

const useQuiz = (questions, onComplete) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [wrongAnswers, setWrongAnswers] = useState([]);
	const [isFinished, setIsFinished] = useState(false);

	const handleAnswer = (option) => {
		const currentQ = questions[currentIndex];
		if (!currentQ) return;

		if (option === currentQ.correctAnswer) {
			setIsFinished(true);
			setTimeout(() => {
				if (currentIndex < questions.length - 1) {
					setCurrentIndex(prev => prev + 1);
					setWrongAnswers([]);
					setIsFinished(false);
				} else {
					onComplete();
				}
			}, 1500);
		} else if (!wrongAnswers.includes(option)) {
			setWrongAnswers(prev => [...prev, option]);
		}
	};

	const resetQuiz = () => {
		setCurrentIndex(0);
		setWrongAnswers([]);
		setIsFinished(false);
	};

	return { currentIndex, wrongAnswers, isFinished, onAnswer: handleAnswer, resetQuiz };
};

export default useQuiz;