import { useState } from "react";

export const useView = () => {
	const [isViewCard, setIsViewCard] = useState<boolean>(true);
	const handleToggleView = () => {
		setIsViewCard(!isViewCard);
	};

	return {
		isViewCard,
		handleToggleView,
	};
};
