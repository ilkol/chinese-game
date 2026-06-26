import { motion, AnimatePresence } from 'framer-motion';
import coinImg from '../assets/cosmoney.png';
import DialogEngine from '../features/dialog/DialogEngine';
import GoldRain from '../features/onboarding/GoldRain';
import RocketGallery from '../features/onboarding/RocketGallery';
import SuitGallery from '../features/onboarding/SuitGallery';
import { ONBOARDING_STEPS, type OnboardingStep } from './onboarding-steps';

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => (
	<DialogEngine
		steps={ONBOARDING_STEPS}
		onComplete={onComplete}
		getBgClass={(step) => (step as OnboardingStep).bgClass}
		children={(step) => {
			const s = step as OnboardingStep;
			return (
				<>
					{s.showCoins && (
						<AnimatePresence>
							<motion.div exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
								<GoldRain />
							</motion.div>
						</AnimatePresence>
					)}
					{s.showRockets && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute inset-0 flex items-end justify-center pb-32 pointer-events-none"
						>
							<RocketGallery />
						</motion.div>
					)}
					{s.showShop && (
						<div className="absolute inset-0 flex items-end justify-center pb-32 pointer-events-none">
							<SuitGallery />
						</div>
					)}
					{s.showCoins && s.emotion && (
						<>
							<div className="absolute left-1/2 -translate-x-1/2 -translate-y-[180px] w-32 h-32 bg-yellow-500/80 blur-3xl rounded-full z-10" />
							<motion.img
								src={coinImg}
								initial={{ opacity: 0, y: -220, scale: 0 }}
								animate={{ opacity: 1, y: -220, scale: 0.8, rotateY: 360 }}
								exit={{ opacity: 0, transition: { duration: 0.2 } }}
								transition={{ duration: 0.8, rotateY: { repeat: Infinity, duration: 3, ease: 'linear' } }}
								style={{ transformStyle: 'preserve-3d' }}
								className="absolute left-1/2 -translate-x-1/2 z-20"
							/>
						</>
					)}
				</>
			);
		}}
	/>
);

export default OnboardingPage;