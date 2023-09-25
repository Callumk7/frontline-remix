import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { useState } from "react";

export const useSearch = (games: GameFromCollectionWithPlaylists[]) => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	let output = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}


	const searchedGames = output;

	const handleSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};


	return {
		searchTerm,
		setSearchTerm,
		searchedGames,
		handleSearchTermChanged,
	};
};
