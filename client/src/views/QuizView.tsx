import QuizCard from '../components/QuizCard';
import ListeningCard from '../components/ListeningCard';
import FillInBlanksCard from '../components/FillInBlanksCard';
import MatchingCard, { type MatchingPair } from '../components/MatchingCard';
import CategorizationQuiz, { type CategorizationQuizTask } from '../components/CategorizationQuiz'
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

interface TestQuiz {
	type: 'test';
	taskText: string;
	question: string;
	options: string[];
	correctAnswer: string;
}
interface ListeningQuiz {
	type: 'listening';
	taskText: string;
	audioText: string;
	options: string[];
	correctAnswer: string;
}
interface FillInBlanksQuiz {
	type: 'blank';
	taskText: string;
	sentence: string;
	options: string[];
	correctAnswer: string;
}
interface MatchingQuiz {
	type: 'matching';
	pairs: MatchingPair[];
	correctAnswer: string;
}
interface ToneListeningQuizTask {
	type: 'tone_listening';
	questions: { correct: string; wrong: string; audioStart: number; audioDuration: number }[];
	audioSrc: string;
	characterSrc: string;
	backgroundSrc: string;
	introDialog: { speaker: string; text: string; emotion: string; bg: string }[];
}

type QuestionData = MatchingQuiz | TestQuiz | ListeningQuiz | FillInBlanksQuiz | CategorizationQuizTask | ToneListeningQuizTask;

const QuizView = ({ questionData, onAnswer, wrongAnswers, isFinished }: { questionData: QuestionData; onAnswer: () => void; wrongAnswers: string[]; isFinished: boolean }) => {
	const props = { ...questionData, onAnswer, wrongAnswers, isFinished };

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-center bg-cover bg-no-repeat" style={{
			backgroundImage: `url("/assets/levels/1/bg.jpeg")`,
		}}>
			{props.type === 'test' && <QuizCard {...props} />}
			{props.type === 'listening' && <ListeningCard {...props} />}
			{props.type === 'blank' && <FillInBlanksCard {...props} />}
			{props.type === 'matching' && (
				<MatchingCard
					pairs={props.pairs}
					onComplete={() => onAnswer()}
				/>
			)}
			{props.type === 'categorization' && (
				<CategorizationQuiz
					introDialog={dialog}
					quizData={props}
					onComplete={() => onAnswer()}
				/>
			)}
			{props.type === 'tone_listening' && (
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
