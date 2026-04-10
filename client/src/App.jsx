import { useState } from 'react';
import FillInBlanksCard from './components/FillInBlanksCard';
import MatchingCard from './components/MatchingCard';

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

  const matchingData = [
	{ id: 1, hanzi: '你好', pinyin: 'nǐ hǎo' },
	{ id: 2, hanzi: '谢谢', pinyin: 'xiè xie' },
	{ id: 3, hanzi: '再见', pinyin: 'zài jiàn' },
	{ id: 4, hanzi: '朋友', pinyin: 'péng yǒu' },
	];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <MatchingCard 
		pairs={matchingData} 
		onComplete={() => alert("Ура! Всё верно!")} 
		/>
    </div>
  );
}

export default App;
