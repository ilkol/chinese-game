import DialogEngine, { type DialogStep } from '../features/dialog/DialogEngine';

const DialogPage = ({ onComplete, backgroundSrc, dialog }: { onComplete: () => void, backgroundSrc?: string; dialog: DialogStep[]; }) => (
	<DialogEngine
		steps={dialog}
		backgroundSrc={backgroundSrc}
		onComplete={onComplete}
	/>
);

export default DialogPage;