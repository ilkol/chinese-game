import QuizCard from '../components/QuizCard';
import ListeningCard from '../components/ListeningCard';
import FillInBlanksCard from '../components/FillInBlanksCard';
import MatchingCard from '../components/MatchingCard';

const QuizView = ({ questionData, onAnswer, wrongAnswers, isFinished }) => {
  const props = { ...questionData, onAnswer, wrongAnswers, isFinished };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {questionData.type === 'test' && <QuizCard {...props} />}
      {questionData.type === 'listening' && <ListeningCard {...props} />}
      {questionData.type === 'blank' && <FillInBlanksCard {...props} />}
      {questionData.type === 'matching' && (
        <MatchingCard 
          pairs={questionData.pairs} 
          onComplete={() => onAnswer(questionData.correctAnswer)} 
        />
      )}
    </div>
  );
};

export default QuizView;
