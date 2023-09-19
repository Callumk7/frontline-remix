import { PlaylistSidebar } from "@/features/playlists/components/PlaylistSidebar";
import { getUserPlaylists } from "@/features/playlists/fetching/get-playlists";
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const playlists = await getUserPlaylists(session.id);
  return typedjson({
    session,
    playlists,
  });
};

export default function CollectionPage() {
  const { session, playlists } = useTypedLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-5 flex w-4/5 flex-row justify-start gap-4 px-4 md:w-full">
      <div className="hidden md:block">
        <PlaylistSidebar
          playlists={playlists}
          userId={session.id}
          followedPlaylists={playlists}
        />
      </div>
      <div className="w-full self-stretch">
        <Outlet />
      </div>
    </div>
  );
}
