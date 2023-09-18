import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { useState } from "react";

export const useSelectGames = (games: GameFromCollectionWithPlaylists[]) => {
	const [selectedGames, setSelectedGames] = useState<number[]>([]);

	const handleSelectedToggled = (gameId: number) => {
		if (selectedGames.includes(gameId)) {
			setSelectedGames(selectedGames.filter((game) => game !== gameId));
		} else {
			setSelectedGames([...selectedGames, gameId]);
		}
	};

	const handleSelectAll = () => {
		const gameIds = games.map((game) => game.gameId);
		console.log(gameIds);
		setSelectedGames(gameIds);
	};

	const handleUnselectAll = () => {
		setSelectedGames([]);
	};

	return {
		selectedGames,
		setSelectedGames,
		handleSelectedToggled,
		handleSelectAll,
		handleUnselectAll,
	};
};
