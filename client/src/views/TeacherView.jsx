import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Users, LayoutDashboard, LogOut, Trophy, MapIcon } from 'lucide-react';
import * as API from '../services/api';

const TeacherView = ({ levels, onStartActivity, onOpenMap }) => {
	const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' или 'students'
	const [students, setStudents] = useState([]);

	// Загружаем список учеников, если открыта вкладка "Класс"
	useEffect(() => {
		if (activeTab === 'students') {
			API.getStudentsProgress().then(setStudents).catch(console.error);
		}
	}, [activeTab]);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Верхняя панель управления */}
			<header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="bg-blue-600 p-3 rounded-2xl text-white">
							<LayoutDashboard size={24} />
						</div>
						<div>
							<h1 className="text-xl font-black uppercase tracking-tight">Кабинет учителя</h1>
							<p className="text-xs text-slate-400 font-bold uppercase">Управление классом</p>
						</div>
					</div>

					<nav className="flex bg-slate-100 p-1 rounded-2xl">
						<button
							onClick={() => setActiveTab('lessons')}
							className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'lessons' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
						>
							<PlayCircle size={18} /> Урок
						</button>
						<button
							onClick={() => setActiveTab('students')}
							className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
						>
							<Users size={18} /> Класс
						</button>
						<button
							onClick={onOpenMap}
							className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-600 transition-all"
						>
							<MapIcon size={18} />
							Карта курса
						</button>
					</nav>



					<button
						onClick={() => { localStorage.clear(); window.location.reload(); }}
						className="p-3 text-slate-400 hover:text-red-500 transition-colors"
					>
						<LogOut size={24} />
					</button>
				</div>
			</header>

			<main className="flex-1 max-w-7xl mx-auto w-full p-6">
				{activeTab === 'lessons' ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{levels.map((level) => (
							<LevelControlCard
								key={level.id}
								level={level}
								onStart={(stepId, type) => onStartActivity({ id: stepId, type: type }, level)}
							/>
						))}
					</div>
				) : (
					<StudentsTable students={students} levels={levels} />
				)}
			</main>
		</div>
	);
};

const LevelControlCard = ({ level, onStart }) => (
	<div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col h-full">
		<div className="flex items-center gap-4 mb-6">
			<div className={`text-4xl w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${level.color} shadow-lg shrink-0`}>
				{level.icon}
			</div>
			<div>
				<h3 className="text-xl font-bold text-slate-800 leading-tight">{level.title}</h3>
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
					{level.quizzes?.length + 2} этапа
				</p>
			</div>
		</div>

		<div className="space-y-3 flex-1">
			{/* ТЕОРИЯ */}
			<button
				onClick={() => onStart('theory', 'theory')}
				className="w-full group flex items-center p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left"
			>
				<div className="bg-blue-100 text-blue-600 p-2 rounded-xl mr-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
					<BookOpen size={20} />
				</div>
				<div className="flex-1">
					<h4 className="font-bold text-sm uppercase tracking-tight">Теория</h4>
					<p className="text-[10px] opacity-70 leading-tight">Показать обучающие слайды на доске</p>
				</div>
			</button>

			{/* ПРОМЕЖУТОЧНЫЕ ТЕСТЫ */}
			{level.quizzes?.map((quiz, idx) => (
				<button
					key={idx}
					onClick={() => onStart(`quiz-${idx}`, 'quiz')}
					className="w-full group flex items-center p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-800 hover:text-white transition-all text-left"
				>
					<div className="bg-slate-200 text-slate-500 p-2 rounded-xl mr-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
						<PlayCircle size={20} />
					</div>
					<div className="flex-1">
						<h4 className="font-bold text-sm uppercase tracking-tight">
							{quiz.title || `Тест ${idx + 1}`}
						</h4>
						{quiz.description && (
							<p className="text-[10px] opacity-60 leading-tight">{quiz.description}</p>
						)}
					</div>
				</button>
			))}

			{/* ФИНАЛЬНЫЙ ТЕСТ */}
			{level.final && (
				<button
					onClick={() => onStart('final', 'final')}
					className="w-full group flex items-center p-4 bg-amber-50 text-amber-700 rounded-2xl hover:bg-amber-500 hover:text-white transition-all text-left border border-amber-100"
				>
					<div className="bg-amber-100 text-amber-600 p-2 rounded-xl mr-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
						<Trophy size={20} />
					</div>
					<div className="flex-1">
						<h4 className="font-bold text-sm uppercase tracking-tight">Итоговый тест</h4>
						<p className="text-[10px] opacity-70 leading-tight">Проверка всех знаний по теме</p>
					</div>
				</button>
			)}
		</div>
	</div>
);

// Вспомогательный компонент: Таблица учеников
const StudentsTable = ({ students }) => (
	<div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
		<table className="w-full border-collapse">
			<thead className="bg-slate-50 border-b border-slate-100">
				<tr className="text-left text-slate-400 text-[10px] uppercase font-black tracking-widest">
					<th className="p-6">Студент</th>
					<th className="p-6">Прогресс</th>
					<th className="p-6 text-center">Очки</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-slate-100">
				{students.map(s => (
					<tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
						<td className="p-6 font-bold text-slate-700">{s.username}</td>
						<td className="p-6">
							<div className="flex gap-1.5 flex-wrap">
								{Object.keys(s.progress || {}).map(id => (
									<span key={id} className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold">Тема {id}</span>
								))}
							</div>
						</td>
						<td className="p-6 text-center font-black text-blue-600">{s.score || 0}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default TeacherView;
