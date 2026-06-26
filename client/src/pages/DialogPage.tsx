import DialogEngine from '../features/dialog/DialogEngine';
import { DIALOG_STEPS } from './dialog-steps';

const DialogPage = ({ onComplete, backgroundSrc }: { onComplete: () => void, backgroundSrc?: string; }) => (
	<DialogEngine
		steps={DIALOG_STEPS}
		backgroundSrc={backgroundSrc}
		onComplete={onComplete}
	/>
);

export default DialogPage;