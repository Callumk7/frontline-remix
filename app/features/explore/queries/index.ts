import { gameInclude } from "@/components/games/types";
import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

// popular: games that are in the most playlists
export async function getPopularGames(count: number): Promise<PopularGame[]> {
	const games = await db.game.findMany({
		include: popularGamesInclude,
		orderBy: {
			playlists: {
				_count: "desc",
			},
		},
		take: count,
	});

	return games;
}

const popularGamesInclude = {
	cover: true,
	_count: {
		select: {
			playlists: true,
			users: true,
		},
	},
} satisfies Prisma.GameInclude;

export type PopularGame = Prisma.GameGetPayload<{
	include: typeof popularGamesInclude;
}>;

export async function getTopRatedGames(count: number) {
	const games = await db.game.findMany({
		where: {
			aggregatedRatingCount: {
				gt: 3
			}
		},
		orderBy: {
			aggregatedRating: "desc",
		},
		take: count,
		include: gameInclude
	})

	return games
}
