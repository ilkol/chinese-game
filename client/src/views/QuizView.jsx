import QuizCard from '../components/QuizCard';
import ListeningCard from '../components/ListeningCard';
import FillInBlanksCard from '../components/FillInBlanksCard';
import MatchingCard from '../components/MatchingCard';
import CategorizationQuiz from '../components/CategorizationQuiz'

const dialog = [
	{
		speaker: 'Лун-Лун',
		text: 'Кто-то навел беспорядок и перемешал все тона! Помоги мне расставить все на свои места. Перед тобой 4 колонки, каждая из которых является названием тона.',
		emotion: '/assets/chars/lun-lun/shy.png',
		bg: 'purple',
	},
	{
		speaker: 'Лун-Лун',
		text: 'Твоя задача – разложить гласные буквы с тоновыми значками по этим колонкам. Вот смотри: у буквы ā первый тон! Её нужно перетащить в колонку «1 тон». А буквы á второй тон, её место во второй колонке. И так далее.',
		emotion: '/assets/chars/lun-lun/shy.png',
		bg: 'purple',
	},
];

const QuizView = ({ questionData, onAnswer, wrongAnswers, isFinished }) => {
	const props = { ...questionData, onAnswer, wrongAnswers, isFinished };

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-center bg-cover bg-no-repeat" style={{
			backgroundImage: `url("/assets/levels/1/bg.jpeg")`,
		}}>
			{questionData.type === 'test' && <QuizCard {...props} />}
			{questionData.type === 'listening' && <ListeningCard {...props} />}
			{questionData.type === 'blank' && <FillInBlanksCard {...props} />}
			{questionData.type === 'matching' && (
				<MatchingCard
					pairs={questionData.pairs}
					onComplete={() => onAnswer(questionData.correctAnswer)}
				/>
			)}
			{questionData.type === 'categorization' && (
				<CategorizationQuiz
					introDialog={dialog}
					quizData={questionData}
					onComplete={() => onAnswer(questionData.correctAnswer)}
				/>
			)}
		</div>
	);
};

export default QuizView;
