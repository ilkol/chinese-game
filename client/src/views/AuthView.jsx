import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lock, User, ArrowRight } from 'lucide-react';
import spaceBg from '../assets/space.webp';
import { loginUser, registerUser } from '../services/api';

const AuthView = ({ onLogin }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');


		try {
			const data = await (isLogin ? loginUser : registerUser)(formData);

			localStorage.setItem('token', data.token);
			onLogin(data, !isLogin);
			
		} catch (err) {
			setError(err.response?.data?.error || err.message || 'Ошибка системы');
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center p-4 bg-[#020617]">
			<div className="fixed inset-0 z-0 opacity-40 bg-[#020617]" style={
				{
					backgroundImage: `url(${spaceBg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center'
				}
			} />

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 shadow-2xl"
			>
				<div className="text-center mb-8">
					<div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
						<Rocket className="text-white" size={40} />
					</div>
					<h2 className="text-3xl font-black text-white uppercase tracking-tight">
						{isLogin ? 'Вход в систему' : 'Регистрация'}
					</h2>
					<p className="text-white/50 text-sm mt-2">Путь к знаниям начинается здесь</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="relative">
						<User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
						<input
							type="text"
							placeholder="Имя пользователя"
							className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all"
							value={formData.username}
							onChange={(e) => setFormData({ ...formData, username: e.target.value })}
							required
						/>
					</div>

					<div className="relative">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
						<input
							type="password"
							placeholder="Пароль"
							className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							required
						/>
					</div>

					{error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

					<button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
						{isLogin ? 'ВОЙТИ' : 'СОЗДАТЬ АККАУНТ'} <ArrowRight size={20} />
					</button>
				</form>

				<button
					onClick={() => setIsLogin(!isLogin)}
					className="w-full mt-6 text-white/40 text-sm hover:text-white transition-colors"
				>
					{isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
				</button>
			</motion.div>
		</div>
	);
};

export default AuthView;