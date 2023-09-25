import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

export async function getUserCollection(userId: string) {
	const games = await db.game.findMany({
		where: {
			users: {
				some: {
					userId,
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
			playlists: {
				include: {
					playlist: true,
				},
			},
		},
	});

	return games;
}

const gameFromCollectionInclude = {
	cover: true,
	genres: {
		include: {
			genre: true,
		},
	},
	users: {
		where: {
			userId: {
				equals: "userId",
			},
		},
	},
	playlists: {
		include: {
			playlist: true,
		},
	},
} satisfies Prisma.GameInclude;

export type GameFromCollection = Prisma.GameGetPayload<{
	include: typeof gameFromCollectionInclude;
}>;
