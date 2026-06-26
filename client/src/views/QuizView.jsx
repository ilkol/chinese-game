import QuizCard from '../components/QuizCard';
import ListeningCard from '../components/ListeningCard';
import FillInBlanksCard from '../components/FillInBlanksCard';
import MatchingCard from '../components/MatchingCard';
import CategorizationQuiz from '../components/CategorizationQuiz'
import ToneListeningQuiz from '../components/ToneListeningQuiz';

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

const QUESTIONS = [
	{ correct: 'ā', wrong: 'à', audioStart: 1, audioDuration: 2 },
	{ correct: 'ō', wrong: 'ǒ', audioStart: 7, audioDuration: 2 },
	{ correct: 'ì', wrong: 'í', audioStart: 13, audioDuration: 2 },
	{ correct: 'ù', wrong: 'ǔ', audioStart: 17, audioDuration: 2 },
	{ correct: 'è', wrong: 'ē', audioStart: 21, audioDuration: 2 },
	{ correct: 'ǘ', wrong: 'ǜ', audioStart: 26, audioDuration: 2 },
	{ correct: 'ī', wrong: 'ǐ', audioStart: 30, audioDuration: 2 },
	{ correct: 'ó', wrong: 'ò', audioStart: 33, audioDuration: 2 },
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
				<ToneListeningQuiz
					questions={QUESTIONS}
					audioSrc="/audio/levels/1/tones.mp3"
					characterSrc="/assets/chars/lun-lun/happy.png"
					backgroundSrc="/assets/bg/space.jpg"
					introDialog={[
						{
							speaker: 'Лун-Лун',
							text: 'Привет! Сейчас я буду произносить слоги с разными тонами.',
							emotion: '/assets/chars/lun-lun/happy.png',
							bg: 'violet',
						},
						{
							speaker: 'Лун-Лун',
							text: 'Послушай и выбери *правильное написание тона*. Удачи! 🎉',
							emotion: '/assets/chars/lun-lun/excited.png',
							bg: 'violet',
						},
					]}
					onComplete={(score, total) => console.log(score, total)}
				/>
			)}
		</div>
	);
};

export default QuizView;
