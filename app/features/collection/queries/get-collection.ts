import { db } from "@/util/db/db.server";

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
					userId,
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
