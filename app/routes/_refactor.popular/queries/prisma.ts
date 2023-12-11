import { db } from "@/util/db/db.server";

export const getPopularPlaylists = async () => {
	const popularPlaylists = await db.playlist.findMany({
		take: 10,
		orderBy: {
			followers: {
				_count: "desc",
			},
		},
	});
	return popularPlaylists;
};
