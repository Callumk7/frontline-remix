import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

export async function getGamesFromPlaylist(
	userId: string,
	playlistId: number,
) {
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
			users: {
				where: {
					userId: {
						equals: userId,
					},
				},
			},
		},
	});

	return getGames;
}

const gamesFromPlaylistInclude = {
	cover: true,
	genres: {
		include: {
			genre: true,
		},
	},
	users: {
		where: {
			userId: {
				equals: "string",
			},
		},
	},
} satisfies Prisma.GameInclude;

export type GameFromPlaylist = Prisma.GameGetPayload<{
	include: typeof gamesFromPlaylistInclude;
}>;

// NOTE: I can add types, through the satisfies method to all the prisma functions I create and use them through the app
// Which might be a nice way to get those colocated with the functions that they are supposed to be around
