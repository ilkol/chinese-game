import { useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';

function App() {
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Наш текущий вопрос (теперь это объект)
  const currentQuestion = {
    sentence: "我喜欢 [___] 音乐",
    options: ["中国", "汉语", "漂亮", "快"],
    correctAnswer: "中国",
    taskText: "Выберите правильное слово"
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

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
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

export default App;
