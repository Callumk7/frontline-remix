import { Container } from "@/components/ui/layout/containers";
import { auth } from "@/features/auth/helper.server";
import { PlaylistSidebar } from "@/features/playlists/components/PlaylistSidebar";
import { getFollowedPlaylists } from "@/features/playlists/queries/following/follow-playlist";
import { getUserPlaylists } from "@/features/playlists/queries/get-playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const playlists = await getUserPlaylists(session.id);

  const followedPlaylists = await getFollowedPlaylists(session.id);
  return typedjson({
    session,
    playlists,
    followedPlaylists,
  });
};

export default function AppLayout() {
  const { session, playlists, followedPlaylists } =
    useTypedLoaderData<typeof loader>();

  return (
    <div className="relative grid grid-cols-7 gap-4">
      <div className="w-full col-span-1">
        <PlaylistSidebar
          playlists={playlists}
          userId={session.id}
          followedPlaylists={followedPlaylists}
        />
      </div>
      <div className="col-span-6">
        <Outlet />
      </div>
    </div>
  );
}
