import { useState } from 'react';
import QuizCard from './components/QuizCard';
import ListeningCard from './components/ListeningCard';

function App() {
  // Храним массив ответов, на которые уже нажали
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const sampleQuestion = {
	task: "Выберите правильный перевод",
    question: "你好",
    options: ["Привет", "Пока", "Спасибо", "Друг"],
    correctAnswer: "Привет"
  };

  const handleAnswer = (option) => {
    if (option === sampleQuestion.correctAnswer) {
      setIsFinished(true); // Победа!
      // Здесь можно будет переключить вопрос через секунду
    } else {
      // Добавляем неверный вариант в список "битых"
      if (!wrongAnswers.includes(option)) {
        setWrongAnswers([...wrongAnswers, option]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <ListeningCard
	 	taskText={sampleQuestion.task}
        audioText={sampleQuestion.question}
        options={sampleQuestion.options}
        correctAnswer={sampleQuestion.correctAnswer}
        onAnswer={handleAnswer}
        wrongAnswers={wrongAnswers} // Передаем массив ошибок
        isFinished={isFinished}     // Передаем статус успеха
      />
    </div>
  );
}

export default App;
