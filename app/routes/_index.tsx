import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import {
  GameFromCollectionWithPlaylists,
  gameFromCollectionInclude,
} from "@/components/games/types";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Toggle } from "@/components/ui/toggle";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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
  const games = await db.game.findMany({
    include: gameFromCollectionInclude,
  });

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return typedjson({ games, session });
};

export default function Index() {
  const { games, session } = useTypedLoaderData<typeof loader>();
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
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <HomeControlComponent game={game} userId={session.id} />
            </GameCardCover>
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
  userId,
}: {
  game: GameFromCollectionWithPlaylists;
  userId: string;
}) {
  const fetcher = useFetcher();
  return (
    <div className="flex flex-row justify-between">
      <fetcher.Form method="post" action="/collection/add">
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="gameId" value={game.gameId} />
        <Button type="submit" variant={"secondary"}>
          Save to Collection
        </Button>
      </fetcher.Form>
      {fetcher.state}
    </div>
  );
}
