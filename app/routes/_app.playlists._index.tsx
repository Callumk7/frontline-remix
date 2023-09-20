import { PlaylistCard } from "@/features/playlists/components/PlaylistCard";
import {
  getAllPlaylists,
  getUserPlaylists,
} from "@/features/playlists/fetching/get-playlists";
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlists = await getAllPlaylists();
  return typedjson({
    session,
    playlists,
  });
};

export default function CollectionIndex() {
  const { session, playlists } = useTypedLoaderData<typeof loader>();
  return (
    <main className="mx-auto grid grid-cols-3 items-center gap-16 p-24 animate-in">
      {playlists.map((playlist, index) => (
        <PlaylistCard key={index} playlist={playlist} />
      ))}
    </main>
  );
}
