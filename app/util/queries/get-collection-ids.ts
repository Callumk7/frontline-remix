import { db } from "../db/db.server";

export async function getCollectionGameIds(userId: string): Promise<number[]> {
	const findCollection = await db.userGameCollection.findMany({
		where: {
			userId,
		},
		select: {
			gameId: true,
		},
	});

	const results = [];
	for (const result of findCollection) {
		results.push(result.gameId);
	}

	return results;
}
