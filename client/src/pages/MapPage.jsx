import LevelModal from "../features/map/LevelModal";
import SpaceMap from "../features/map/SpaceMap";

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
