import { GameView } from "@/components/games/GameView";
import { CollectionEntryControls } from "@/features/collection/components/CollectionGameControls";
import { getUserCollection } from "@/features/collection/fetching/get-collection";
import { getUserPlaylists } from "@/features/playlists/fetching/get-playlists";
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlists = await getUserPlaylists(session.id);
  const pageUserId = params.userId;
  if (!pageUserId) {
    return typedjson({ games: [], session, playlists });
  }
  const games = await getUserCollection(pageUserId);
  return typedjson({ games, session, playlists });
};

export default function CollectionView() {
  const { games, session, playlists } = useTypedLoaderData<typeof loader>();
  //WARNING: Types are all wrong for this shared component, need to take them back to basics
  return (
    <GameView
      games={games}
      ControlComponent={CollectionEntryControls}
      selectedGames={[]}
      controlProps={{
        playlists,
        selectedGames: [],
      }}
    />
  );
}
