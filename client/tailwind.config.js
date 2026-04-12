/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	safelist: [
		'from-pink-500', 'to-purple-600',
		'from-orange-400', 'to-red-500',
		'from-green-400', 'to-emerald-600',
		'from-blue-400', 'to-cyan-500',
		// Добавь сюда все остальные цвета, которые используешь в данных
	],
	theme: {
		extend: {},
	},
	plugins: [],
}
