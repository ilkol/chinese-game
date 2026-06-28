import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.API_URL ?? 'http://localhost:5000/api'; // chinese-game-backend.onrender.com

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

function prepareLoginResponse(data: any): LoginResponse {
	const token = data.token
	const decoded = jwtDecode(token)
	return {
		token,
		role: (decoded as any).role
	}
}

export const ErrorMessages: Record<string, string> = {
	invalid_credentials: "Неверный логин или пароль",
	internal_server_error: "Проблемы на сервере, попробуйте позже",
	user_already_exists: "Это имя уже занято"
}

export const getErrorMessage = (key: string): string => {
	console.log(key)
	return ErrorMessages[key] || "Неизвестная ошибка";
}

export const getLevels = (withSteps: boolean = false) => API.get(`/level?with_steps=${withSteps}`).then(res => res.data as Level[]);
export const getLevel = (id: number) => API.get(`/level/${id}`).then(res => res.data as Level);
export const loginUser = (credentials: UserLoginData) => API.post('/auth/login', credentials).then(res => {
	return prepareLoginResponse(res.data)
});
export const registerUser = (credentials: UserRegisterData) => API.post('/auth/register', credentials).then(res => {
	return prepareLoginResponse(res.data)
});
export const saveUserProgress = (stepId: number) =>
	API.post('/progress', { step_id: stepId }).then(() => true);

export const getStudentsProgress = () => API.get('/teacher/students').then(res => res.data);
export const getInviteCode = () => API.get(`/teacher/invite-code`).then(res => res.data as string);
export const joinStudentToTeacher = (code: string) => API.post(`/user/join`, { invite_code: code} ).then(res => res.data.status as string);

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

export interface LoginResponse {
	token: string;
	role: UserRole;
}

export interface UserLoginData {
	username: string;
	password: string;
}
export interface UserRegisterData extends UserLoginData {
	invite_code: string;
}

export interface Level {
	id: number;
	title: string;
	color: string;
	icon: string;
	created_at: string;
	order_index: number;
	steps: null | LevelStep[];
	background_src: string;
}

export enum LevelStepType {
	Theory = "theory",
	Quiz = "quiz",
	FinalTest = "final",
	Dialog = "dialog",
	ToneListening = "tone_listening",
	Categorization = "categorization",
	PlanetClick = "planet_click",
	PlanetMatching = "planet_matching",
}

export interface DialogStepItem {
	speaker?: string;
	text: string;
	emotion?: string;
	bg?: string;
}

export interface LevelStep {
	id: number;
	is_completed: boolean;
	level_id: number;
	order_index: number;
	title: string;
	type: LevelStepType;
	content: StepContent[];
	description: string;
	dialog: DialogStepItem[];
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

export interface PlanetQuestion {
	correct: string;
	audioSrc: string;
}

export interface MatchingPlanetPair {
	id: string;
	label: string;
	audioSrc?: string;
}