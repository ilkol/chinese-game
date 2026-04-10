export type QuestionType = 'test' | 'listening' | 'blank' | 'matching';

export interface BaseQuestion {
	id: string;
	type: QuestionType;
	taskText: string;
}

export interface QuizQuestion extends BaseQuestion {
	type: 'test';
	question: string;
	options: string[];
	correctAnswer: string;
}

export interface ListeningQuestion extends BaseQuestion {
	type: 'listening';
	audioText: string;
	options: string[];
	correctAnswer: string;
}

export interface BlankQuestion extends BaseQuestion {
	type: 'blank';
	sentence: string;
	options: string[];
	correctAnswer: string;
}

export interface MatchingPair {
	id: number;
	hanzi: string;
	pinyin: string;
}

export interface MatchingQuestion extends BaseQuestion {
	type: 'matching';
	pairs: MatchingPair[];
}

// Объединяем все типы вопросов в один Union тип
export type Question = QuizQuestion | ListeningQuestion | BlankQuestion | MatchingQuestion;

export interface TheorySlide {
	type: 'text' | 'hanzi' | 'video' | 'image';
	header?: string;
	content?: string;
	char?: string;
	pinyin?: string;
	translation?: string;
	url?: string;
	caption?: string;
}

export interface Level {
	id: number;
	title: string;
	color: string;
	icon: string;
	theory: TheorySlide[];
	quiz1: Question[];
	quiz2: Question[];
	final: Question[];
}
