import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

export async function getUserPlaylists(userId: string) {
	const getPlaylists = await db.playlist.findMany({
		where: {
			userId,
		},
		include: userPlaylistsInclude,
	});

	return getPlaylists;
}

const userPlaylistsInclude = {
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
	include: typeof userPlaylistsInclude;
}>;

// WARNING: Not currently used, will probably remove
export async function getPlaylistWithGames(playlistId: number) {
	const playlist = await db.playlist.findFirst({
		where: {
			id: playlistId,
		},
		include: userPlaylistsInclude,
	});

	return playlist;
}

export async function getAllPlaylists() {
	const playlists = await db.playlist.findMany({
		include: allPlaylistsInclude,
	});
	return playlists;
}

const allPlaylistsInclude = {
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

export async function getPlaylistDetails(playlistId: number) {
	const playlist = await db.playlist.findFirst({
		where: {
			id: playlistId,
		},
		include: {
			user: true,
		},
	});

	return playlist;
}
