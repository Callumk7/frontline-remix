import { PlaylistSidebar } from "@/features/playlists/components/PlaylistSidebar";
import { getUserPlaylists } from "@/features/playlists/fetching/get-playlists";
import { authenticator } from "@/services/auth.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlists = await cacheFetch(
    session.id,
    ["playlists", "games"],
    getUserPlaylists,
  );
  return typedjson({
    session,
    playlists,
  });
};

// NOTE: This is the route layout for the main app functionality - Mostly this is used for nesting the sidebar
// for the collection route and the playlist route.

export default function AppLayout() {
  const { session, playlists } = useTypedLoaderData<typeof loader>();

  return (
    <div className="relative top-16 flex w-full flex-row justify-start gap-4">
      <div className="hidden md:block">
        <PlaylistSidebar
          playlists={playlists}
          userId={session.id}
          followedPlaylists={playlists}
        />
      </div>
      <div className="mt-10 w-full self-stretch">
        <Outlet />
      </div>
    </div>
  );
}
