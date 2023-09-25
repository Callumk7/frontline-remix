import { auth } from "@/features/auth/helper.server";
import { db } from "@/util/db/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

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
	const rating = body.get("rating");

	if (!userId) {
		return json("No user was logged in, not authorised", { status: 401 });
	}

	if (request.method === "PATCH") {
		const where = {
			userId_gameId: {
				userId,
				gameId,
			},
		};

		let data: object = {};
		if (played) {
			console.log(played);
			let isPlayed = false;
			played === "true" ? (isPlayed = true) : (isPlayed = false);
			data = {
				played: isPlayed,
			};
		}

		if (completed) {
			let isCompleted = false;
			completed === "true" ? (isCompleted = true) : (isCompleted = false);
			data = {
				completed: isCompleted,
			};
		}

		if (starred) {
			let isStarred = false;
			starred === "true" ? (isStarred = true) : (isStarred = false);
			data = {
				starred: isStarred,
			};
		}

		if (rating) {
			data = {
				playerRating: Number(rating),
			};
		}

		if (played || starred || completed || rating) {
			const updateGame = await db.userGameCollection.update({
				where: where,
				data: data,
			});

			if (updateGame) {
				return json(updateGame);
			}
		}
	}

	if (request.method === "DELETE") {
		console.log("delete request");
		const deleteRequestUserId = body.get("userId");
		invariant(deleteRequestUserId, "Expected a user Id to be passed in the body");

		if (deleteRequestUserId !== userId) {
			return json("UserId does not match session, unauthorized delete", {
				status: 401,
			});
		}

		const deleteGame = await db.userGameCollection.delete({
			where: {
				userId_gameId: {
					userId: deleteRequestUserId,
					gameId: gameId,
				},
			},
		});

		return json(deleteGame);
	}

	return json("insufficient data provided", { status: 400 });
};
