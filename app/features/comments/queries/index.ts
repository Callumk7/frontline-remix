import { db } from "@/util/db/db.server";
import { Prisma } from "@prisma/client";

export async function getPlaylistComments(playlistId: number) {
	const comments = await db.comment.findMany({
		where: {
			playlistId: playlistId,
		},
		include: playlistCommentsInclude,
	});

	return comments;
}

const playlistCommentsInclude = {
	author: true,
} satisfies Prisma.CommentInclude;

export type CommentWithAuthor = Prisma.CommentGetPayload<{
	include: typeof playlistCommentsInclude;
}>;
