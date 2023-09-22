import { auth } from "@/features/auth/helper.server";
import {
  followPlaylist,
  getFollowedPlaylists,
} from "@/features/playlists/queries/following/follow-playlist";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const userId = body.get("userId");
  const playlistId = body.get("playlistId");

  invariant(userId, "Expected userId");
  invariant(playlistId, "Expected playlistId");

  try {
    const follow = await followPlaylist(userId.toString(), Number(playlistId.toString()));
    return json({ follow });
  } catch (err) {
    console.error("Error: prisma failed to write follow", err);
    return json("Unable to process follow request", { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const followedPlaylists = await getFollowedPlaylists(session.id);

  return json({ followedPlaylists });
};

export default function FollowingPage() {
  const { followedPlaylists } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>The playlists you are following</h1>
      {followedPlaylists.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </div>
  );
}
