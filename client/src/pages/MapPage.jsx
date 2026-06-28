import { useEffect, useState } from "react";
import LevelModal from "../features/map/LevelModal";
import SpaceMap from "../features/map/SpaceMap";
import { AnimatePresence, motion } from "framer-motion";
import GameLoader from "../components/GameLoader";

import * as API from '../services/api';

function MapPage({ levels, activePlanetId, onSelectLevel, selectedLevel, isModalOpened, onCloseModal, onStartTopic, isLanding}) {
	
	const [completedLevelIds, setCompletedLevelIds] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const startTime = Date.now();
		const minLoadingTime = 1500;

		const finishLoading = () => {
			const elapsed = Date.now() - startTime;
			setTimeout(() => setLoading(false), Math.max(0, minLoadingTime - elapsed));
		};

		API.getCompletedLevelIDs()
			.then(data => {
				setCompletedLevelIds(data);
				finishLoading();
			})
			.catch(finishLoading);
	}, []);

	if (loading) {
		return (
			<AnimatePresence>
				<motion.div
					key="global-loader"
					exit={{ opacity: 0, scale: 1.1 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					className="fixed inset-0 z-[100]"
				>
					<GameLoader />
				</motion.div>
			</AnimatePresence>
		);
	}

	return (
		<>
			<SpaceMap
				levels={levels}
				completedLevelIds={completedLevelIds}
				onSelectLevel={onSelectLevel}
				activePlanetId={activePlanetId}
				isLanding={isLanding}
			/>
			<LevelModal
				isOpen={isModalOpened}
				level={selectedLevel}
				onClose={onCloseModal}
				onStart={onStartTopic}
			/>
		</>
	);
}

export default MapPage;
