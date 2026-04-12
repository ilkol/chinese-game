import { BookOpen, PlayCircle, Trophy } from 'lucide-react';

const ClassroomMode = ({ levels, onStartActivity }) => {
	return (
		<div className="p-8 max-w-6xl mx-auto">
			<h2 className="text-3xl font-black mb-8 text-slate-800">Управление уроком</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{levels.map(level => (
					<div key={level.id} className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
						<div className="flex items-center gap-4 mb-6">
							<div className={`text-4xl p-4 rounded-2xl bg-gradient-to-br ${level.color}`}>
								{level.icon}
							</div>
							<h3 className="text-xl font-bold">{level.title}</h3>
						</div>

						<div className="space-y-3">
							<button
								onClick={() => onStartActivity(level, 'theory')}
								className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors"
							>
								<span className="font-bold flex items-center gap-2"><BookOpen size={20} /> Теория</span>
								<span className="text-xs uppercase font-black">Запустить</span>
							</button>

							{level.quizzes.map((q, idx) => (
								<button
									key={idx}
									onClick={() => onStartActivity(level, `quiz-${idx}`)}
									className="w-full flex items-center justify-between p-4 bg-slate-50 text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
								>
									<span className="font-bold flex items-center gap-2"><PlayCircle size={20} /> Тест {idx + 1}</span>
									<span className="text-xs uppercase font-black">На доску</span>
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ClassroomMode;