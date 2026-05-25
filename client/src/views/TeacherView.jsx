import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Users, LayoutDashboard, LogOut, Trophy, MapIcon } from 'lucide-react';
import * as API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

const TeacherView = ({ levels, onStartActivity, onOpenMap, user }) => {
	const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' или 'students'
	const [students, setStudents] = useState([]);

	// Загружаем список учеников, если открыта вкладка "Класс"
	useEffect(() => {
		if (activeTab === 'students') {
			API.getStudentsProgress().then((data) => {
				setStudents(data)
			}).catch(console.error);
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
								onStart={(step) => onStartActivity(step, level)}
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

const getStepsCountForm = (count) => {
	if (count >= 11 && count <= 14) {
		return "этапов"
	}
	const last = count % 10;
	if (last == 1) {
		return "этап"
	}
	if (last == 2 || last == 3 || last == 4) {
		return "этапа"
	}
	return "этапов"
}

const LevelControlCard = ({ level, onStart }) => (
	<div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col h-full">
		<div className="flex items-center gap-4 mb-6">
			<div className={`text-4xl w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${level.color} shadow-lg shrink-0`}>
				{level.icon}
			</div>
			<div>
				<h3 className="text-xl font-bold text-slate-800 leading-tight">{level.title}</h3>
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
					{level.steps.length} {`${getStepsCountForm(level.steps.length)}`}
				</p>
			</div>
		</div>

		<div className="space-y-3 flex-1">

			{/* ПРОМЕЖУТОЧНЫЕ ТЕСТЫ */}
			{level.steps.map((quiz, idx) => {
				if (quiz.type === "final") {
					return (
						<button
							key={idx}
							onClick={() => onStart(quiz)}
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
					)
				}
				if (quiz.type === "theory") {
					return (
						<button
							key={idx}
							onClick={() => onStart(quiz)}
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
					)
				}

				return (
					<button
						key={idx}
						onClick={() => onStart(quiz)}
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
				)
			})}
		</div>
	</div>
);

// Вспомогательный компонент: Таблица учеников
const StudentsTable = ({ students }) => {
	const [showQR, setShowQR] = useState(false);
	const [inviteCode, setInviteCode] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.getInviteCode().then(code => {			
			setInviteCode(code);
			setLoading(false)
		}).catch(() => {
		});
	})

	return (
		<div className="space-y-4">
			{/* Верхняя панель с кнопкой */}
			<div className="flex justify-between items-center px-2">
				<h2 className="text-xl font-bold text-slate-800">Список студентов</h2>
				<button
					disabled={loading}
					onClick={() => {
						setShowQR(true)
					}}
					className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					Пригласить класс
				</button>
			</div>

			{/* Основная таблица */}
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

			{/* Модальное окно с QR-кодом */}
			{showQR && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
					<div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-300">
						<button
							onClick={() => setShowQR(false)}
							className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<h3 className="text-2xl font-black text-slate-800 mb-2">Вход в игру</h3>
						<p className="text-slate-500 mb-8 text-sm font-medium">Отсканируйте код, чтобы присоединиться</p>

						<div className="bg-slate-50 p-6 rounded-[32px] inline-block mb-6 border border-slate-100">
							<QRCodeSVG
								value={inviteCode}
								size={200}
								level={"H"}
								includeMargin={false}
								className="mx-auto"
							/>
						</div>

						<div className="space-y-1">
							<p className="text-xs text-slate-400 uppercase font-black tracking-tighter">Код приглашения</p>
							<p className="text-3xl font-black text-blue-600 tracking-widest">{inviteCode}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeacherView;
