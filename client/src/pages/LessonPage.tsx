import { type DialogStep } from '../features/dialog/TaskIntroDialog';
import QuizCard from '../features/quiz/QuizCard';
import ListeningCard from '../features/quiz/ListeningCard';
import FillInBlanksCard from '../features/quiz/FillInBlanksCard';
import MatchingCard, { type MatchingPair } from '../features/quiz/MatchingCard';
import CategorizationQuiz, { type CategorizationQuizTask } from '../features/quiz/CategorizationQuiz';
import ToneListeningQuiz from '../features/quiz/ToneListeningQuiz';
import WithIntro from '../features/dialog/WithIntro';
import PlanetClickQuiz from '../features/quiz/PlanetClickQuiz';

const ALL_LETTERS = ['q', 'w', 'r', 't', 'y', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'b', 'n', 'm', 'zh', 'ch', 'sh'];

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

interface PlanetClickTask extends BaseQuiz {
	type: 'planet_click';
	questions: { correct: string; audioSrc: string }[];
}

type QuestionData =
	TestQuiz | ListeningQuiz | FillInBlanksQuiz |
	MatchingQuiz | CategorizationQuizTask & BaseQuiz | ToneListeningQuizTask | PlanetClickTask
	;

const QuizView = ({ questionData, onAnswer, wrongAnswers, isFinished, stepDialog, backgroundSrc }: {
	questionData: QuestionData;
	onAnswer: () => void;
	wrongAnswers: string[];
	isFinished: boolean;
	stepDialog?: DialogStep[];
	backgroundSrc?: string;
}) => {
	const props = { ...questionData, onAnswer, wrongAnswers, isFinished };

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat"
			style={{ backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined }}
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
				{props.type === 'planet_click' && (
					<PlanetClickQuiz
						questions={props.questions}
						allLetters={ALL_LETTERS}
						characterSrc="/assets/chars/lun-lun/happy.png"
						onComplete={(score, total) => { console.log(score, total); onAnswer(); }}
					/>
				)}
			</WithIntro>
		</div>
	);
};

export default QuizView;