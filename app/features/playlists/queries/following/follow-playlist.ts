import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

export async function followPlaylist(userId: string, playlistId: number) {
	const follow = await db.followersOnPlaylists.create({
		data: {
			userId,
			playlistId,
		}
	})

	return follow;
}

export async function getFollowedPlaylists(userId: string) {
	const playlists = await db.playlist.findMany({
		where: {
			followers: {
				some: {
					userId,
				}
			}
		},
		include: playlistInclude
	})

	return playlists
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
