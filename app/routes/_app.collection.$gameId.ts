import { auth } from "@/features/auth/helper.server";
import { db } from "@/util/db/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";

// This is an action - only route. I should handle the case when someone might manually
// enter this route into the browser, but for now this is the case for handling patch requests
// for entries in a user's game collection
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await auth(request);
	const userId = session.id;

	const gameId = Number(params.gameId);

	const body = await request.formData();
	const played = body.get("played");
	const completed = body.get("completed");
	const starred = body.get("starred");

	if (!userId) {
		return json("No user was logged in, not authorised", { status: 401 });
	}

	const where = {
		userId_gameId: {
			userId,
			gameId,
		},
	};

	// TODO: This code is repeated and can be cleaned up - think about how to reuse a single prisma instance rather than
	// Copy pasting the same thing three times
	if (played) {
		console.log(played);
		let isPlayed = false;
		played === "true" ? (isPlayed = true) : (isPlayed = false);

		console.log(`PATCH REQUEST: PLAYED for: ${userId}`);
		console.log(`setting played to ${isPlayed}`);
		const updatePlayedGame = await db.userGameCollection.update({
			where,
			data: {
				played: isPlayed,
			},
		});

		return json(updatePlayedGame);
	}

	if (completed) {
		let isCompleted = false;
		completed === "true" ? (isCompleted = true) : (isCompleted = false);

		console.log(`PATCH REQUEST: COMPLETED for: ${userId}`);
		const updatePlayedGame = await db.userGameCollection.update({
			where,
			data: {
				completed: isCompleted,
			},
		});
		return json(updatePlayedGame);
	}

	if (starred) {
		let isStarred = false;
		starred === "true" ? (isStarred = true) : (isStarred = false);

		console.log(`PATCH REQUEST: COMPLETED for: ${userId}`);
		const updatePlayedGame = await db.userGameCollection.update({
			where,
			data: {
				starred: isStarred,
			},
		});
		return json(updatePlayedGame);
	}

	return json("insufficient data provided", { status: 400 });
};
