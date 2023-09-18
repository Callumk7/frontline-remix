import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

// NOTE: every fetch for playlists should include user data that can be displayed in the ui
export async function getUserPlaylists(userId: string) {
	const getPlaylists = await db.playlist.findMany({
		where: {
			userId,
		},
		include: playlistInclude,
	});

	return getPlaylists;
}

const playlistInclude = {
	games: {
		include: {
			game: {
				include: {
					cover: true,
				},
			},
		},
	},
	user: true,
} satisfies Prisma.PlaylistInclude;

export type PlaylistWithGames = Prisma.PlaylistGetPayload<{
	include: typeof playlistInclude;
}>;
