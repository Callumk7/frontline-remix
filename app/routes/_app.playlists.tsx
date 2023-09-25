import { db } from "@/util/db/db.server";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const userId = body.get("userId");
  invariant(userId, "Expected userId");

  // Post Request: New Playlist
  if (request.method === "POST") {
    const playlistName = body.get("playlistName");

    invariant(playlistName, "Expected userId");

    const newPlaylist = await db.playlist.create({
      data: {
        name: playlistName.toString(),
        userId: userId.toString(),
      },
    });

    if (newPlaylist) {
      await invalidateCache(userId, ["playlists"]);
      await invalidateCache(userId, ["playlists", "games"]);
    }

    return json({ newPlaylist });
  }

  // Delete request: Remove playlist
  if (request.method === "DELETE") {
    const playlistId = Number(body.get("playlistId"));

    invariant(playlistId, "Expected a playlist id");

    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    if (deletedPlaylist) {
      await invalidateCache(userId, ["playlists"]);
      await invalidateCache(userId, ["playlists", "games"]);
    }

    return json(deletedPlaylist)
  }
};

export default function PlaylistsRoot() {
  return (
    <div className="mx-5">
      <Outlet />
    </div>
  );
}
