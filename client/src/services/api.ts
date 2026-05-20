import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const API = axios.create({
	baseURL: API_URL,
});
API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


export const getLevels = () => API.get('/level').then(res => res.data as Level[]);
export const getLevel = (id: number) => API.get(`/level/${id}`).then(res => res.data as Level);
export const loginUser = (credentials: UserLoginData) => API.post('/auth/login', credentials).then(res => res.data as User);
export const registerUser = (credentials: UserLoginData) => API.post('/auth/register', credentials).then(res => res.data as User);
export const saveUserProgress = (levelId: number, stepId: number) =>
	API.post('/progress', { levelId, stepId }).then(res => {
		res.data
		return true;
	});

export const getStudentsProgress = () => API.post('/user/getStudents').then(res => res.data);

export default API;

export enum UserRole {
	Teacher = "teacher",
	Admin = "Admin",
	Student = "student"
}

export interface User {
	token: string;
	role: UserRole
}

export interface UserLoginData {
	username: string;
	password: string;
}

export interface Level {
	id: number;
	title: string;
	color: string;
	icon: string;
	created_at: string;
	order_index: number;
	steps: null | LevelStep[];
}

export enum LevelStepType {
	Theory = "theory",
	Test = "quiz",
	FinalTest = "final"
}

export interface LevelStep {
	id: number;
	is_completed: boolean;
	level_id: number;
	order_index: number;
	title: string;
	type: LevelStepType;
	content: StepContent[];
}

export enum TheoryContentType {
	Text = "text",
	Hanzi = "hanzi"
}

export interface TheoryContentText {
	conent: string;
	header: string;
	type: TheoryContentType.Text
}

export interface TheoryContentHanzi {
	char: string;
	pinyin: string;
	translation: string
	type: TheoryContentType.Hanzi
}

export type TheoryStepContent = TheoryContentText | TheoryContentHanzi;

export enum TestContentType {
	Test = "test",
	Listening = "listening"
}


export interface TestContentTest {
	correctAnswer: string;
	options: string[];
	question: string;
	type: TestContentType.Test
}

export interface TestContentListening {
	correctAnswer: string;
	options: string[];
	audioText: string;
	type: TestContentType.Listening
}

export type TestStepContent = TestContentTest | TestContentListening;

export type StepContent = TheoryStepContent | TestStepContent;