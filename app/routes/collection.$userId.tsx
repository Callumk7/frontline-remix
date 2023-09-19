import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { CollectionEntryControls } from "@/features/collection/components/CollectionGameControls";
import { getUserCollection } from "@/features/collection/fetching/get-collection";
import { getUserPlaylists } from "@/features/playlists/fetching/get-playlists";
import { useView } from "@/hooks/view";
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
  const { isViewCard, handleToggleView } = useView();
  //WARNING: Types are all wrong for this shared component, need to take them back to basics
  return (
    <div>
      {isViewCard ? (
        <GameViewCard>
          {games.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <div>controls</div>
            </GameCardCover>
          ))}
        </GameViewCard>
      ) : (
        <GameViewList>
          {games.map((game) => (
            <GameListEntry key={game.id} game={game}>
              <div>controls</div>
            </GameListEntry>
          ))}
        </GameViewList>
      )}
    </div>
  );
}
