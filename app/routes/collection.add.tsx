import { db } from "@/util/db/db.server";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

// collection/add route, for POST requests saving games from the database to a users
// collection, by creating a gameId -> userId record
export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const gameId = body.get("gameId");
  const userId = body.get("userId");

  if (!userId) {
    return new Response("not logged in, missing user id", { status: 401 });
  }

  // TODO: decide how to handle responses vs. errors
  invariant(gameId, "No game id found");

  try {
    const createCollection = await db.userGameCollection.create({
      data: {
        userId: userId.toString(),
        gameId: Number(gameId),
      },
    });

    if (createCollection) {
      console.log(
        `added collection ${createCollection.userId}, ${createCollection.gameId}`,
      );

      await invalidateCache(userId.toString(), "collection");
    }

    const resBody = JSON.stringify(createCollection);
    return new Response(resBody, { status: 200 });
  } catch (err) {
    return new Response("Game already in collection", {
      status: 409,
      statusText: "Conflict",
    });
  }
};
