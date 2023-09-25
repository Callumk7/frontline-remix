import { GameCardCoverPopular } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Toggle } from "@/components/ui/toggle";
import { getRecentGames } from "@/features/explore/queries";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { getCollectionGameIds } from "@/util/queries/get-collection-ids";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "This is the way" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const gameId = body.get("id");
  console.log(gameId);
  return gameId;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const games = await getRecentGames(10);

  let gameIds: number[] = [];
  if (session) {
    gameIds = await getCollectionGameIds(session.id);
  }

  return typedjson({ games, gameIds, session });
};

export default function Index() {
  const { games, gameIds, session } = useTypedLoaderData<typeof loader>();
  const { isViewCard, handleToggleView } = useView();

  return (
    <>
      <Toggle
        className="my-6"
        pressed={!isViewCard}
        variant={"outline"}
        onPressedChange={handleToggleView}
        aria-label="view"
      >
        <MenuIcon />
      </Toggle>
      {isViewCard ? (
        <GameViewCard>
          {games.map((game) => (
            <GameCardCoverPopular key={game.id} game={game} isSelected={false}>
              <HomeControlComponent
                game={game}
                inCollection={gameIds.includes(game.gameId)}
                userId={session.id}
              />
            </GameCardCoverPopular>
          ))}
        </GameViewCard>
      ) : (
        <GameViewList>
          {games.map((game) => (
            <GameListEntry key={game.id} game={game}>
              <HomeControlComponent game={game} userId={session.id} />
            </GameListEntry>
          ))}
        </GameViewList>
      )}
    </>
  );
}

function HomeControlComponent({
  game,
  inCollection,
  userId,
}: {
  game: GameFromCollectionWithPlaylists;
  inCollection: boolean;
  userId: string;
}) {
  const [isInCollection, setIsInCollection] = useState<boolean>(inCollection);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      setIsInCollection(true);
    }
  }, [setIsInCollection, fetcher]);
  return (
    <div className="flex flex-row justify-between">
      {isInCollection ? (
        <Button
          className="animate-in slide-in-from-bottom-3"
          variant={"outline"}
          size={"bubble"}
        >
          In your collection
        </Button>
      ) : (
        <fetcher.Form method="post" action="/collection">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="gameId" value={game.gameId} />
          <Button type="submit" variant={"secondary"}>
            {fetcher.state === "submitting" ? "saving..." : "save game"}
          </Button>
        </fetcher.Form>
      )}
    </div>
  );
}
