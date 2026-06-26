import DialogEngine from '../features/dialog/DialogEngine';
import { DIALOG_STEPS } from './dialog-steps';

const DialogPage = ({ onComplete }: { onComplete: () => void }) => (
	<DialogEngine
		steps={DIALOG_STEPS}
		backgroundSrc="/assets/levels/1/bg.jpeg"
		onComplete={onComplete}
	/>
);

export default DialogPage;