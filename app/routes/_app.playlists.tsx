import { db } from "@/util/db/db.server";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const userId = body.get("userId");
  const playlistName = body.get("playlistName");

  invariant(userId, "Expected userId");
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
};

export default function PlaylistsRoot() {
  return (
    <div>
      <h1>_app.playlists.tsx</h1>
      <Outlet />
    </div>
  );
}
