import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { useState } from "react";

export type SortOption =
	| "nameAsc"
	| "nameDesc"
	| "releaseDateAsc"
	| "releaseDateDesc"
	| "rating"
	| "dateAdded";

export const useSort = (
	DEFAULT_SORT_OPTION: SortOption,
	games: GameFromCollectionWithPlaylists[],
) => {
	const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION);

	const sortedGames = applySorting(games, sortOption);

	return {
		sortOption,
		setSortOption,
		sortedGames,
	};
};

const applySorting = (
	games: GameFromCollectionWithPlaylists[],
	sortOption: SortOption,
): GameFromCollectionWithPlaylists[] => {
	const sortedGames = [...games];
	switch (sortOption) {
		case "nameAsc":
			sortedGames.sort((a, b) =>
				a.title.toUpperCase().localeCompare(b.title.toUpperCase()),
			);
			break;

		case "nameDesc":
			sortedGames.sort((a, b) =>
				b.title.toUpperCase().localeCompare(a.title.toUpperCase()),
			);
			break;

		case "rating": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRating === null) {
					bRating = 0;
				} else {
					bRating = b.aggregatedRating;
				}

				if (a.aggregatedRating === null) {
					aRating = 0;
				} else {
					aRating = a.aggregatedRating;
				}
				return bRating - aRating;
			});
			break;
		}

		case "releaseDateAsc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.releaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.releaseDate.valueOf();
				}
				if (a.releaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.releaseDate.valueOf();
				}
				return aReleaseDate - bReleaseDate;
			});
			break;
		}
		case "releaseDateDesc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.releaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.releaseDate.valueOf();
				}
				if (a.releaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.releaseDate.valueOf();
				}
				return bReleaseDate - aReleaseDate;
			});
			break;
		}
		default:
			break;
	}
	return sortedGames;
};
