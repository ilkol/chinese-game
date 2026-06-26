import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroDialog, { type DialogStep } from './TaskIntroDialog';

interface WithIntroProps {
	introDialog?: DialogStep[];
	children: React.ReactNode;
}

const WithIntro: React.FC<WithIntroProps> = ({ introDialog, children }) => {
	const [showIntro, setShowIntro] = useState(!!introDialog?.length);

	return (
		<>
			<AnimatePresence>
				{showIntro && introDialog?.length && (
					<IntroDialog steps={introDialog} onFinish={() => setShowIntro(false)} />
				)}
			</AnimatePresence>
			{children}
		</>
	);
};

export default WithIntro;