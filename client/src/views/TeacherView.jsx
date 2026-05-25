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
				console.log(data)
			}).catch(console.error);
		}
	}, [activeTab]);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Верхняя панель управления */}
			<header className="bg-white border-b border-slate-200 p-3 md:p-4 sticky top-0 z-20">
				<div className="max-w-7xl mx-auto flex items-center justify-between gap-2">

					{/* Лого: уменьшаем отступы и скрываем текст на совсем маленьких экранах */}
					<div className="flex items-center gap-2 md:gap-4">
						<div className="bg-blue-600 p-2 md:p-3 rounded-xl md:rounded-2xl text-white shrink-0">
							<LayoutDashboard size={20} className="md:w-6 md:h-6" />
						</div>
						<div className="hidden sm:block"> {/* Скрываем на мобилках до 640px */}
							<h1 className="text-sm md:text-xl font-black uppercase tracking-tight leading-none">Кабинет</h1>
							<p className="text-[10px] text-slate-400 font-bold uppercase">Учитель</p>
						</div>
					</div>

					{/* Навигация: адаптируем под узкий экран */}
					<nav className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl overflow-x-auto">
						<button
							onClick={() => setActiveTab('lessons')}
							className={`flex items-center justify-center gap-2 px-3 md:px-6 py-2 rounded-lg md:rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'lessons' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
						>
							<PlayCircle size={18} />
							<span className="hidden md:inline">Урок</span> {/* Текст только на десктопе */}
						</button>

						<button
							onClick={() => setActiveTab('students')}
							className={`flex items-center justify-center gap-2 px-3 md:px-6 py-2 rounded-lg md:rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'students' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
						>
							<Users size={18} />
							<span className="hidden md:inline">Класс</span>
						</button>

						<button
							onClick={onOpenMap}
							className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-slate-600 font-bold whitespace-nowrap"
						>
							<MapIcon size={18} />
							<span className="hidden md:inline">Карта</span>
						</button>
					</nav>

					<button
						onClick={() => { localStorage.clear(); window.location.reload(); }}
						className="p-2 md:p-3 text-slate-400 hover:text-red-500 shrink-0"
					>
						<LogOut size={20} md:size={24} />
					</button>
				</div>
			</header>

			{/* Контент: уменьшаем падинги для мобилок */}
			<main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
				{activeTab === 'lessons' ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{levels.map((level) => (
							<LevelControlCard
								key={level.id}
								level={level}
								onStart={(step) => onStartActivity(step, level)}
							/>
						))}
					</div>
				) : (
					<div className="overflow-x-hidden"> {/* Чтобы таблица класса не распирала экран */}
						<ClassPanel students={students} levels={levels} />
					</div>
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
	<div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 shadow-xl border border-slate-100 flex flex-col h-full">
		{/* Шапка карточки */}
		<div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
			{/* Иконка: уменьшили размер для мобилок */}
			<div className={`text-2xl md:text-4xl w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br ${level.color} shadow-lg shrink-0`}>
				{level.icon}
			</div>
			<div>
				<h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">{level.title}</h3>
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">
					{level.steps.length} {`${getStepsCountForm(level.steps.length)}`}
				</p>
			</div>
		</div>

		<div className="space-y-2 md:space-y-3 flex-1">
			{level.steps.map((quiz, idx) => {
				// Базовые стили для всех кнопок (вынес для удобства чтения)
				const baseBtnClass = "w-full group flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl transition-all text-left border";
				const iconBoxClass = "p-2 rounded-lg md:rounded-xl mr-3 md:mr-4 group-hover:bg-white/20 group-hover:text-white transition-colors";

				if (quiz.type === "final") {
					return (
						<button
							key={idx}
							onClick={() => onStart(quiz)}
							className={`${baseBtnClass} bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-500 hover:text-white`}
						>
							<div className={`${iconBoxClass} bg-amber-100 text-amber-600`}>
								<Trophy size={18} className="md:w-5 md:h-5" />
							</div>
							<div className="flex-1">
								<h4 className="font-bold text-xs md:text-sm uppercase tracking-tight">Итоговый тест</h4>
								<p className="text-[9px] md:text-[10px] opacity-70 leading-tight">Проверка всех знаний</p>
							</div>
						</button>
					)
				}

				if (quiz.type === "theory") {
					return (
						<button
							key={idx}
							onClick={() => onStart(quiz)}
							className={`${baseBtnClass} bg-blue-50 text-blue-700 border-transparent hover:bg-blue-600 hover:text-white`}
						>
							<div className={`${iconBoxClass} bg-blue-100 text-blue-600`}>
								<BookOpen size={18} className="md:w-5 md:h-5" />
							</div>
							<div className="flex-1">
								<h4 className="font-bold text-xs md:text-sm uppercase tracking-tight">Теория</h4>
								<p className="text-[9px] md:text-[10px] opacity-70 leading-tight">Слайды на доску</p>
							</div>
						</button>
					)
				}

				return (
					<button
						key={idx}
						onClick={() => onStart(quiz)}
						className={`${baseBtnClass} bg-slate-50 text-slate-600 border-transparent hover:bg-slate-800 hover:text-white`}
					>
						<div className={`${iconBoxClass} bg-slate-200 text-slate-500`}>
							<PlayCircle size={18} className="md:w-5 md:h-5" />
						</div>
						<div className="flex-1">
							<h4 className="font-bold text-xs md:text-sm uppercase tracking-tight line-clamp-1">
								{quiz.title || `Тест ${idx + 1}`}
							</h4>
							{quiz.description && (
								<p className="text-[9px] md:text-[10px] opacity-60 leading-tight line-clamp-1">{quiz.description}</p>
							)}
						</div>
					</button>
				)
			})}
		</div>
	</div>

);

// Вспомогательный компонент: Таблица учеников
const ClassPanel = ({ students }) => {
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
		<div className="space-y-4 md:space-y-6">
			{/* Верхняя панель: на мобилках в колонку, на десктопе в ряд */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
				<h2 className="text-xl md:text-2xl font-bold text-slate-800">Список студентов</h2>
				<button
					disabled={loading}
					onClick={() => setShowQR(true)}
					className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					Пригласить класс
				</button>
			</div>

			{/* Обертка для таблицы, чтобы был скролл при переполнении */}
			<div className="overflow-x-auto -mx-2 px-2 pb-4">
				<StudentsTable students={students} />
			</div>

			{/* Модальное окно */}
			{showQR && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
					{/* Ограничили высоту max-h-full и добавили скролл на случай очень маленьких экранов */}
					<div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] shadow-2xl max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
						<button
							onClick={() => setShowQR(false)}
							className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-slate-600 transition-colors p-2"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1 md:mb-2">Вход в игру</h3>
						<p className="text-slate-500 mb-4 md:mb-8 text-xs md:text-sm font-medium">Отсканируйте код</p>

						{/* Адаптивный размер QR-кода */}
						<div className="bg-slate-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] inline-block mb-4 md:mb-6 border border-slate-100">
							<QRCodeSVG
								value={inviteCode}
								size={160} // Немного уменьшили базу
								level={"H"}
								includeMargin={false}
								className="mx-auto w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
							/>
						</div>

						<div className="space-y-1">
							<p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Код приглашения</p>
							<p className="text-2xl md:text-3xl font-black text-blue-600 tracking-widest">{inviteCode}</p>
						</div>
					</div>
				</div>
			)}
		</div>

	);
};

const StudentsTable = ({ students }) => {
	// Функция для определения цвета в зависимости от прогресса
	const getProgressColor = (current, total) => {
		const percentage = (current / total) * 100;
		if (percentage >= 100) return 'bg-emerald-500';
		if (percentage >= 50) return 'bg-amber-500';
		return 'bg-rose-500';
	};

	const getProgressBg = (current, total) => {
		const percentage = (current / total) * 100;
		if (percentage >= 100) return 'bg-emerald-50';
		if (percentage >= 50) return 'bg-amber-50';
		return 'bg-rose-50';
	};

	return (
		<div className="bg-white rounded-2xl md:rounded-[32px] shadow-xl md:shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
			{/* ДЕСКТОПНАЯ ТАБЛИЦА (скрыта на мобилках через hidden md:table) */}
			<table className="hidden md:table w-full border-collapse">
				<thead>
					<tr className="bg-slate-50/50 border-b border-slate-100 text-left text-slate-400 text-[11px] uppercase font-black tracking-[0.15em]">
						<th className="p-6">Студент</th>
						<th className="p-6">Текущий прогресс</th>
						<th className="p-6">Активность</th>
						<th className="p-6 text-right">Очки</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-50">
					{(students || []).map((s) => {
						const percentage = Math.round((s.completedSteps / s.totalSteps) * 100) || 0;
						const date = new Date(s.updatedAt).toLocaleDateString('ru-RU', {
							day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
						});

						return (
							<tr key={s.id} className="group hover:bg-slate-50/80 transition-all duration-300">
								<td className="p-6">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
											{s.username.charAt(0).toUpperCase()}
										</div>
										<span className="font-bold text-slate-700 text-base">{s.username}</span>
									</div>
								</td>
								<td className="p-6">
									<div className="flex flex-col gap-2 min-w-[200px]">
										<div className="flex justify-between items-end">
											<span className="text-xs font-black text-slate-400 uppercase tracking-wide">{s.lastLevelTitle}</span>
											<span className={`text-xs font-black ${percentage === 100 ? 'text-emerald-500' : 'text-slate-600'}`}>
												{s.completedSteps} / {s.totalSteps}
											</span>
										</div>
										<div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
											<div
												className={`h-full rounded-full transition-all duration-1000 shadow-sm ${getProgressColor(s.completedSteps, s.totalSteps)}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								</td>
								<td className="p-6">
									<div className="flex flex-col text-sm font-bold text-slate-600">{date}</div>
								</td>
								<td className="p-6 text-right">
									<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
										<span className="text-lg font-black text-blue-600 leading-none">{s.coins}</span>
										<span className="text-[10px]">💰</span>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* МОБИЛЬНЫЙ СПИСОК КАРТОЧЕК (виден только на мобилках через block md:hidden) */}
			<div className="block md:hidden divide-y divide-slate-100">
				{(students || []).map((s) => {
					const percentage = Math.round((s.completedSteps / s.totalSteps) * 100) || 0;
					return (
						<div key={s.id} className="p-4 space-y-4">
							{/* Верх: Имя и Очки */}
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
										{s.username.charAt(0).toUpperCase()}
									</div>
									<span className="font-bold text-slate-800">{s.username}</span>
								</div>
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
									<span className="text-sm font-black text-blue-600">{s.coins}</span>
									<span className="text-[10px]">💰</span>
								</div>
							</div>

							{/* Центр: Прогресс */}
							<div className="space-y-1.5">
								<div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
									<span className="text-slate-400 truncate max-w-[70%]">{s.lastLevelTitle}</span>
									<span className={percentage === 100 ? 'text-emerald-500' : 'text-slate-600'}>
										{s.completedSteps}/{s.totalSteps}
									</span>
								</div>
								<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(s.completedSteps, s.totalSteps)}`}
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>

	);
};

export default TeacherView;
