import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { useState } from "react";

export const useFilter = (games: GameFromCollectionWithPlaylists[], genres: string[]) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [genreFilter, setGenreFilter] = useState<string[]>([]);

	let output = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}

	output = output.filter((game) => {
		if (game.genres.length === 0) {
			return true;
		}

		if (
			genreFilter.every((filterGenre) =>
				game.genres.some((gameGenre) => gameGenre.genre.name === filterGenre),
			)
		) {
			return true;
		}
	});

	const filteredGames = output;

	const handleSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleGenreToggled = (genre: string) => {
		// handle genre toggled
		setGenreFilter((prevGenreFilter) =>
			prevGenreFilter.includes(genre)
				? prevGenreFilter.filter((g) => g !== genre)
				: [...prevGenreFilter, genre],
		);
	};

	const handleToggleAllGenres = () => {
		if (genres.length > genreFilter.length) {
			setGenreFilter(genres);
		} else {
			setGenreFilter([]);
		}
	};

	return {
		searchTerm,
		setSearchTerm,
		genreFilter,
		setGenreFilter,
		filteredGames,
		handleSearchTermChanged,
		handleGenreToggled,
		handleToggleAllGenres,
	};
};
