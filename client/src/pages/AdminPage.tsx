import { useState, useEffect } from 'react';
import {
	Plus, Trash2, ChevronRight, ChevronDown,
	Save, LogOut, GripVertical, X
} from 'lucide-react';
import * as API from '../services/api';
import type { DialogStepItem } from '../services/api';

// ---------- API helpers (добавить в api.ts) ----------
// export const createStep = ...
// export const updateStep = ...
// export const deleteStep = ...
// export const upsertDialog = ...

// ---------- StepTypeLabel ----------

const STEP_TYPE_LABELS: Record<string, string> = {
	theory: 'Теория',
	quiz: 'Квиз',
	final: 'Итоговый тест',
	dialog: 'Диалог',
	categorization: 'Категоризация',
	tone_listening: 'Тоны на слух',
	planet_click: 'Найди букву',
	planet_matching: 'Сопоставление',
};

const STEP_TYPE_COLORS: Record<string, string> = {
	theory: 'bg-blue-100 text-blue-700',
	quiz: 'bg-slate-100 text-slate-700',
	final: 'bg-amber-100 text-amber-700',
	dialog: 'bg-purple-100 text-purple-700',
	categorization: 'bg-green-100 text-green-700',
	tone_listening: 'bg-violet-100 text-violet-700',
	planet_click: 'bg-orange-100 text-orange-700',
	planet_matching: 'bg-pink-100 text-pink-700',
};

// ---------- DialogEditor ----------

const DialogEditor = ({ stepId, initialSteps }: { stepId: number; initialSteps: API.DialogStepItem[] }) => {
	const [steps, setSteps] = useState<API.DialogStepItem[]>(
		initialSteps?.length ? initialSteps : []
	);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	const addStep = () => {
		setSteps(prev => [...prev, { speaker: 'Лун-Лун', text: '', emotion: '', bg: 'blue' }]);
	};

	const removeStep = (i: number) => {
		setSteps(prev => prev.filter((_, idx) => idx !== i));
	};

	const updateStep = (i: number, field: keyof DialogStepItem, value: string) => {
		setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
	};

	const moveStep = (i: number, dir: -1 | 1) => {
		const next = i + dir;
		if (next < 0 || next >= steps.length) return;
		const arr = [...steps];
		[arr[i], arr[next]] = [arr[next], arr[i]];
		setSteps(arr);
	};

	const save = async () => {
		setSaving(true);
		try {
			await API.upsertDialog(stepId, steps);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest">Диалог</h3>
				<div className="flex gap-2">
					<button
						onClick={addStep}
						className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all"
					>
						<Plus size={14} /> Добавить реплику
					</button>
					<button
						onClick={save}
						disabled={saving}
						className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-green-100 text-green-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
					>
						<Save size={14} /> {saved ? 'Сохранено!' : saving ? 'Сохраняю...' : 'Сохранить'}
					</button>
				</div>
			</div>

			{steps.length === 0 && (
				<div className="text-slate-400 text-sm text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
					Нет реплик. Нажми «Добавить реплику»
				</div>
			)}

			{steps.map((step, i) => (
				<div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
								<ChevronDown size={16} className="rotate-180" />
							</button>
							<button onClick={() => moveStep(i, 1)} disabled={i === steps.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
								<ChevronDown size={16} />
							</button>
							<span className="text-xs font-black text-slate-400 uppercase">Реплика {i + 1}</span>
						</div>
						<button onClick={() => removeStep(i)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
							<X size={16} />
						</button>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Спикер</label>
							<input
								value={step.speaker}
								onChange={e => updateStep(i, 'speaker', e.target.value)}
								className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
								placeholder="Лун-Лун"
							/>
						</div>
						<div>
							<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Цвет (bg)</label>
							<select
								value={step.bg}
								onChange={e => updateStep(i, 'bg', e.target.value)}
								className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
							>
								{['blue', 'purple', 'violet', 'green', 'amber', 'red', 'pink'].map(c => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						</div>
					</div>

					<div>
						<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
							Текст <span className="normal-case font-normal">(* для жирного *)</span>
						</label>
						<textarea
							value={step.text}
							onChange={e => updateStep(i, 'text', e.target.value)}
							rows={3}
							className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
							placeholder="Текст реплики..."
						/>
					</div>

					<div>
						<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Путь к картинке персонажа</label>
						<input
							value={step.emotion}
							onChange={e => updateStep(i, 'emotion', e.target.value)}
							className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
							placeholder="/assets/chars/lun-lun/happy.png"
						/>
					</div>

					{/* Превью текста */}
					{step.text && (
						<div className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600 leading-relaxed">
							{step.text.split(/(\*[^*]+\*)/g).map((part, j) =>
								part.startsWith('*') && part.endsWith('*')
									? <strong key={j} className={`text-${step.bg}-600`}>{part.slice(1, -1)}</strong>
									: part
							)}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

// ---------- StepEditor ----------

const StepEditor = ({ step, levelId, onSaved, onDeleted }: {
	step: API.LevelStep;
	levelId: number;
	onSaved: (updated: API.LevelStep) => void;
	onDeleted: () => void;
}) => {
	const [title, setTitle] = useState(step.title ?? '');
	const [description, setDescription] = useState(step.description ?? '');
	const [type, setType] = useState(step.type);
	const [orderIndex, setOrderIndex] = useState(step.order_index);
	const [contentJson, setContentJson] = useState(
		step.content ? JSON.stringify(step.content, null, 2) : '[]'
	);
	const [jsonError, setJsonError] = useState('');
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	const save = async () => {
		let parsedContent;
		try {
			parsedContent = JSON.parse(contentJson);
			setJsonError('');
		} catch {
			setJsonError('Невалидный JSON');
			return;
		}

		setSaving(true);
		try {
			await API.updateStep(levelId, step.id, {
				type,
				title,
				description,
				order_index: orderIndex,
				content: parsedContent,
			});
			setSaved(true);
			onSaved({ ...step, type, title, description, order_index: orderIndex, content: parsedContent });
			setTimeout(() => setSaved(false), 2000);
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!confirmDelete) { setConfirmDelete(true); return; }
		try {
			await API.deleteStep(levelId, step.id);
			onDeleted();
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Мета-поля */}
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Тип</label>
					<select
						value={type}
						onChange={e => setType(e.target.value as API.LevelStepType)}
						className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
					>
						{Object.entries(STEP_TYPE_LABELS).map(([v, l]) => (
							<option key={v} value={v}>{l}</option>
						))}
					</select>
				</div>
				<div>
					<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Порядок</label>
					<input
						type="number"
						value={orderIndex}
						onChange={e => setOrderIndex(Number(e.target.value))}
						className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
					/>
				</div>
				<div className="col-span-2">
					<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Название</label>
					<input
						value={title}
						onChange={e => setTitle(e.target.value)}
						className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
						placeholder="Название этапа"
					/>
				</div>
				<div className="col-span-2">
					<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Описание</label>
					<input
						value={description}
						onChange={e => setDescription(e.target.value)}
						className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
						placeholder="Короткое описание"
					/>
				</div>
			</div>

			{/* JSON редактор контента */}
			<div>
				<label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
					Контент (JSON)
				</label>
				<textarea
					value={contentJson}
					onChange={e => { setContentJson(e.target.value); setJsonError(''); }}
					rows={10}
					spellCheck={false}
					className={`w-full mt-1 px-3 py-2 bg-slate-900 text-green-400 font-mono text-xs border rounded-xl focus:outline-none resize-none ${jsonError ? 'border-red-400' : 'border-slate-700'}`}
				/>
				{jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
			</div>

			{/* Редактор диалога */}
			<div className="border-t border-slate-100 pt-6">
				<DialogEditor stepId={step.id} initialSteps={step.dialog ?? []} />
			</div>

			{/* Кнопки */}
			<div className="flex gap-3 pt-2 border-t border-slate-100">
				<button
					onClick={save}
					disabled={saving}
					className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
				>
					<Save size={16} /> {saved ? 'Сохранено!' : saving ? 'Сохраняю...' : 'Сохранить этап'}
				</button>
				<button
					onClick={handleDelete}
					className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all ${confirmDelete ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
				>
					{confirmDelete ? 'Точно удалить?' : <Trash2 size={16} />}
				</button>
			</div>
		</div>
	);
};

// ---------- AdminPage ----------

const AdminPage = ({ onLogout }: { onLogout: () => void }) => {
	const [levels, setLevels] = useState<API.Level[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<API.Level | null>(null);
	const [selectedStep, setSelectedStep] = useState<API.LevelStep | null>(null);
	const [loading, setLoading] = useState(true);
	const [creatingStep, setCreatingStep] = useState(false);

	useEffect(() => {
		API.getLevels(true).then(data => {
			setLevels(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);

	const handleSelectLevel = (level: API.Level) => {
		setSelectedLevel(level);
		setSelectedStep(null);
	};

	const handleStepSaved = (updated: API.LevelStep) => {
		setLevels(prev => prev.map(l =>
			l.id === selectedLevel?.id
				? { ...l, steps: l.steps?.map(s => s.id === updated.id ? updated : s) ?? [] }
				: l
		));
		setSelectedStep(updated);
	};

	const handleStepDeleted = () => {
		setLevels(prev => prev.map(l =>
			l.id === selectedLevel?.id
				? { ...l, steps: l.steps?.filter(s => s.id !== selectedStep?.id) ?? [] }
				: l
		));
		setSelectedStep(null);
	};

	const handleCreateStep = async () => {
		if (!selectedLevel) return;
		setCreatingStep(true);
		try {
			const newStep = await API.createStep(selectedLevel.id, {
				type: API.LevelStepType.Quiz,
				title: 'Новый этап',
				description: '',
				content: [],
			});
			setLevels(prev => prev.map(l =>
				l.id === selectedLevel.id
					? { ...l, steps: [...(l.steps ?? []), newStep] }
					: l
			));
			setSelectedStep(newStep);
		} catch (e) {
			console.error(e);
		} finally {
			setCreatingStep(false);
		}
	};

	const currentLevel = levels.find(l => l.id === selectedLevel?.id);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Header */}
			<header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
				<div className="flex items-center gap-3">
					<div className="bg-violet-600 p-2 rounded-xl text-white">
						<GripVertical size={20} />
					</div>
					<div>
						<h1 className="font-black text-slate-800 uppercase tracking-tight leading-none">Админ-панель</h1>
						<p className="text-[10px] text-slate-400 font-bold uppercase">Редактор уровней</p>
					</div>
				</div>
				<button
					onClick={onLogout}
					className="p-2 text-slate-400 hover:text-red-500 transition-colors"
				>
					<LogOut size={20} />
				</button>
			</header>

			<div className="flex flex-1 overflow-hidden">

				{/* Левая колонка — уровни */}
				<aside className="w-64 bg-white border-r border-slate-100 flex flex-col overflow-y-auto">
					<div className="p-4 border-b border-slate-100">
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Уровни</p>
					</div>
					{loading ? (
						<div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Загрузка...</div>
					) : (
						<div className="flex flex-col p-2 gap-1">
							{levels.map(level => (
								<button
									key={level.id}
									onClick={() => handleSelectLevel(level)}
									className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${selectedLevel?.id === level.id ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50 text-slate-700'}`}
								>
									<span className="text-2xl">{level.icon}</span>
									<div className="flex-1 min-w-0">
										<p className="font-bold text-sm truncate">{level.title}</p>
										<p className="text-[10px] text-slate-400">{level.steps?.length ?? 0} этапов</p>
									</div>
									{selectedLevel?.id === level.id && <ChevronRight size={16} className="text-violet-400 shrink-0" />}
								</button>
							))}
						</div>
					)}
				</aside>

				{/* Средняя колонка — этапы */}
				<aside className="w-72 bg-slate-50 border-r border-slate-100 flex flex-col overflow-y-auto">
					{!selectedLevel ? (
						<div className="flex-1 flex items-center justify-center text-slate-400 text-sm p-8 text-center">
							Выбери уровень слева
						</div>
					) : (
						<>
							<div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Этапы</p>
								<button
									onClick={handleCreateStep}
									disabled={creatingStep}
									className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-500 transition-all"
								>
									<Plus size={14} /> {creatingStep ? '...' : 'Добавить'}
								</button>
							</div>
							<div className="flex flex-col p-2 gap-1">
								{(currentLevel?.steps ?? []).map(step => (
									<button
										key={step.id}
										onClick={() => setSelectedStep(step)}
										className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${selectedStep?.id === step.id ? 'bg-white shadow-sm border border-slate-100' : 'hover:bg-white/60'}`}
									>
										<span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ${STEP_TYPE_COLORS[step.type] ?? 'bg-slate-100 text-slate-600'}`}>
											{STEP_TYPE_LABELS[step.type] ?? step.type}
										</span>
										<div className="flex-1 min-w-0">
											<p className="font-bold text-sm text-slate-700 truncate">{step.title || '—'}</p>
											<p className="text-[10px] text-slate-400">#{step.order_index} · id {step.id}</p>
										</div>
									</button>
								))}
							</div>
						</>
					)}
				</aside>

				{/* Правая колонка — редактор */}
				<main className="flex-1 overflow-y-auto p-6">
					{!selectedStep ? (
						<div className="h-full flex items-center justify-center text-slate-400 text-sm">
							Выбери этап для редактирования
						</div>
					) : (
						<div className="max-w-2xl mx-auto">
							<div className="flex items-center gap-3 mb-6">
								<span className={`text-xs font-black px-3 py-1 rounded-xl ${STEP_TYPE_COLORS[selectedStep.type] ?? 'bg-slate-100 text-slate-600'}`}>
									{STEP_TYPE_LABELS[selectedStep.type] ?? selectedStep.type}
								</span>
								<h2 className="font-black text-slate-800 text-lg">{selectedStep.title || 'Без названия'}</h2>
							</div>
							<StepEditor
								key={selectedStep.id}
								step={selectedStep}
								levelId={selectedLevel!.id}
								onSaved={handleStepSaved}
								onDeleted={handleStepDeleted}
							/>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default AdminPage;