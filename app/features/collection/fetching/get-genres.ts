import { db } from "@/util/db/db.server";

export async function getUserGenres(userId: string): Promise<string[]> {
	const findUserGames = await db.userGameCollection.findMany({
		where: {
			userId: {
				equals: userId,
			},
		},
		select: {
			gameId: true,
		},
	});

	const gameIds = findUserGames.map((ug) => ug.gameId);

	const findUserGenres = await db.genre.findMany({
		where: {
			games: {
				some: {
					gameId: {
						in: gameIds,
					},
				},
			},
		},
		select: {
			name: true,
		},
	});

	// return a string array of genre names
	const genreArray = findUserGenres.map((g) => g.name);
	return genreArray;
}
