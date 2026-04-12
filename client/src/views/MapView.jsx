import LevelModal from "../components/LevelModal";
import SpaceMap from "../components/SpaceMap";

function MapView({ levels, activePlanetId, onSelectLevel, selectedLevel, isModalOpened, onCloseModal, onStartTopic, isLanding}) {
	
	return (
		<>
			<SpaceMap
				levels={levels}
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

export default MapView;
