import { type DialogStep } from '../features/dialog/TaskIntroDialog';
import QuizCard from '../features/quiz/QuizCard';
import ListeningCard from '../features/quiz/ListeningCard';
import FillInBlanksCard from '../features/quiz/FillInBlanksCard';
import MatchingCard, { type MatchingPair } from '../features/quiz/MatchingCard';
import CategorizationQuiz, { type CategorizationQuizTask } from '../features/quiz/CategorizationQuiz';
import ToneListeningQuiz from '../features/quiz/ToneListeningQuiz';
import WithIntro from '../features/dialog/WithIntro';

// Добавляем introDialog в каждый тип
interface BaseQuiz {
	type: string;
}
interface TestQuiz extends BaseQuiz {
	type: 'test';
	taskText: string;
	question: string;
	options: string[];
	correctAnswer: string;
}
interface ListeningQuiz extends BaseQuiz {
	type: 'listening';
	taskText: string;
	audioText: string;
	options: string[];
	correctAnswer: string;
}
interface FillInBlanksQuiz extends BaseQuiz {
	type: 'blank';
	taskText: string;
	sentence: string;
	options: string[];
	correctAnswer: string;
}
interface MatchingQuiz extends BaseQuiz {
	type: 'matching';
	pairs: MatchingPair[];
}
interface ToneListeningQuizTask extends BaseQuiz {
	type: 'tone_listening';
	questions: { correct: string; wrong: string; audioStart: number; audioDuration: number }[];
	audioSrc: string;
	characterSrc: string;
	backgroundSrc: string;
}

type QuestionData = TestQuiz | ListeningQuiz | FillInBlanksQuiz | MatchingQuiz | CategorizationQuizTask & BaseQuiz | ToneListeningQuizTask;

const QuizView = ({ questionData, onAnswer, wrongAnswers, isFinished, stepDialog }: {
	questionData: QuestionData;
	onAnswer: () => void;
	wrongAnswers: string[];
	isFinished: boolean;
	stepDialog?: DialogStep[];
}) => {
	const props = { ...questionData, onAnswer, wrongAnswers, isFinished };

	return (
		<div
			className="min-h-screen flex items-center justify-center p-4 bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: `url("/assets/levels/1/bg.jpeg")` }}
		>
			<WithIntro introDialog={stepDialog}>
				{props.type === 'test' && <QuizCard {...props} />}
				{props.type === 'listening' && <ListeningCard {...props} />}
				{props.type === 'blank' && <FillInBlanksCard {...props} />}
				{props.type === 'matching' && <MatchingCard pairs={props.pairs} onComplete={onAnswer} />}
				{props.type === 'categorization' && <CategorizationQuiz quizData={props} onComplete={onAnswer} />}
				{props.type === 'tone_listening' && (
					<ToneListeningQuiz
						questions={props.questions}
						audioSrc={props.audioSrc}
						characterSrc={props.characterSrc}
						backgroundSrc={props.backgroundSrc}
						onComplete={(score, total) => { console.log(score, total); onAnswer(); }}
					/>
				)}
			</WithIntro>
		</div>
	);
};

export default QuizView;