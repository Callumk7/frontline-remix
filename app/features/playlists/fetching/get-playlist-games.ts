import { GameWithCoverAndGenres } from "@/components/games/types";
import { db } from "@/util/db/db.server";

export async function getGamesFromPlaylist(
	playlistId: number,
): Promise<GameWithCoverAndGenres[]> {
	const getGames = await db.game.findMany({
		where: {
			playlists: {
				some: {
					playlistId: playlistId,
				},
			},
		},
		include: {
			cover: true,
			genres: {
				include: {
					genre: true,
				},
			},
		},
	});

	return getGames;
}

// NOTE: I can add types, through the satisfies method to all the prisma functions I create and use them through the app
// Which might be a nice way to get those colocated with the functions that they are supposed to be around
