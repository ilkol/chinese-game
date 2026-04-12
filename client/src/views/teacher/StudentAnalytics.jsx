const StudentAnalytics = ({ students }) => {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-black mb-8">Успеваемость класса</h2>
			<div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100">
				<table className="w-full text-left">
					<thead className="bg-slate-50 text-slate-400 uppercase text-xs font-black">
						<tr>
							<th className="p-6">Ученик</th>
							<th className="p-6">Прогресс по темам</th>
							<th className="p-6 text-center">Очки</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{students.map(student => (
							<tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
								<td className="p-6 font-bold text-slate-700">{student.username}</td>
								<td className="p-6">
									<div className="flex gap-2">
										{/* Визуальные индикаторы пройденных планет */}
										{Object.keys(student.progress).map(planetId => (
											<div key={planetId} className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold" title={`Планета ${planetId}`}>
												{planetId}
											</div>
										))}
									</div>
								</td>
								<td className="p-6 text-center font-black text-blue-600">
									{student.score || 0}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StudentAnalytics;