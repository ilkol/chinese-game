import { motion } from "framer-motion";

const GameLoader = () => (
	<div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
		<div className="relative">
			{/* Внешнее кольцо */}
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
				className="w-32 h-32 border-4 border-dashed border-blue-500/30 rounded-full"
			/>
			{/* Внутренний иероглиф */}
			<motion.div
				animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
				transition={{ repeat: Infinity, duration: 2 }}
				className="absolute inset-0 flex items-center justify-center text-4xl text-blue-400 font-bold"
			>
				龙
			</motion.div>
		</div>
		<motion.p
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.5 }}
			className="mt-8 text-blue-200/50 uppercase tracking-[0.3em] text-xs font-black"
		>
			Подготовка экспедиции...
		</motion.p>
	</div>
);

export default GameLoader;