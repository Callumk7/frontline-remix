import { db } from "@/util/db/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // comments, for playlists.
  const playlistId = Number(params.playlistId);
  const body = await request.formData();
  const commentBody = body.get("body")?.toString();
  const userId = body.get("userId")?.toString();

  invariant(playlistId, "Expected a playlist Id in the URL parameters");
  invariant(commentBody, "Expected a comment body in the request");
  invariant(userId, "Expected a userId in the request");

  const newComment = await db.comment.create({
    data: {
      authorId: userId,
      playlistId: playlistId,
      body: commentBody,
    },
  });

  console.log(`new comment posted on ${playlistId} by ${userId}`);
  console.log(newComment.body);

  return json(newComment);
};
