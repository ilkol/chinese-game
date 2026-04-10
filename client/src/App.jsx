import { useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';
import SpaceMap from './components/SpaceMap';

function App() {
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Наш текущий вопрос (теперь это объект)
  const currentQuestion = {
    sentence: "Какой-то [___] вопрос",
    options: ["Сложный", "2", "3", "4"],
    correctAnswer: "Сложный",
    taskText: "Вставте правильное слово"
  };

  const handleAnswer = (option) => {
    // ВАЖНО: проверяем относительно текущего вопроса
    if (option === currentQuestion.correctAnswer) {
      setIsFinished(true);
    } else {
      if (!wrongAnswers.includes(option)) {
        setWrongAnswers([...wrongAnswers, option]);
      }
    }
  };

  const matchingData = [
	{ id: 1, hanzi: '1', pinyin: '1' },
	{ id: 2, hanzi: '2', pinyin: '2' },
	{ id: 3, hanzi: '3', pinyin: '3' },
	{ id: 4, hanzi: '4', pinyin: '4' },
	];

	const levels = [
	{ id: 1, title: 'Приветствие', color: 'from-pink-500 to-purple-600', icon: '👋' },
	{ id: 2, title: 'Числа', color: 'from-orange-400 to-red-500', icon: '🔢' },
	{ id: 3, title: 'Еда', color: 'from-green-400 to-emerald-600', icon: '🍱' },
	{ id: 4, title: 'Семья', color: 'from-blue-400 to-cyan-500', icon: '👨‍👩‍👧' },
	];
	const [currentView, setCurrentView] = useState('map'); // 'map' или 'game'
	if (currentView === 'map') {
	return <SpaceMap levels={levels} onSelectLevel={(level) => console.log('Selected:', level)} />;
	} else {

		return (
		  <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
			{/* <MatchingCard 
			  pairs={matchingData} 
			  onComplete={() => alert("Ура! Всё верно!")} 
			  /> */}
			  <FillInBlanksCard 
			  taskText={currentQuestion.taskText}
			  sentence={currentQuestion.sentence}
			  options={currentQuestion.options}
			  correctAnswer={currentQuestion.correctAnswer} // Передаем правильный ответ
			  onAnswer={handleAnswer}
			  wrongAnswers={wrongAnswers}
			  isFinished={isFinished}
			/>
		  </div>
		);
	}

}

export default App;
