import { GameCardCover } from "@/components/games/GameCard";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { Button } from "@/components/ui/button";
import { auth } from "@/features/auth/helper.server";
import {
  ExploreSection,
  TopRatedLink,
} from "@/features/explore/components/ExploreSection";
import { getTopRatedGames } from "@/features/explore/queries";
import { saveExternalGameToDB } from "@/features/explore/queries/save-to-db";
import { IGDBGameSchema } from "@/features/search/igdb";
import { getCollectionGameIds } from "@/util/queries/get-collection-ids";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { toast } from "sonner";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const payload = JSON.parse(body.get("json")!.toString());

  try {
    const game = IGDBGameSchema.parse(payload);
    const savedGame = await saveExternalGameToDB(game);

    return json({ savedGame });
  } catch (err) {
    console.error("Error: Problem saving game to external database", err);

    return json("Error saving game to database..", { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const games = await getTopRatedGames(10);

  let gameIds: number[] = [];
  if (session) {
    gameIds = await getCollectionGameIds(session.id);
  }

  return typedjson({ games, gameIds, session });
};

export default function ExplorePage() {
  const { games, gameIds, session } = useTypedLoaderData<typeof loader>();

  return (
    <div className="relative top-16 flex flex-col gap-28">
      <ExploreSection
        title="Top Rated Games"
        subtitle="How many have you played?"
        link={TopRatedLink()}
      >
        <GameViewCard>
          {games.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <HomeControlComponent
                game={game}
                inCollection={gameIds.includes(game.gameId)}
                userId={session.id}
              />
            </GameCardCover>
          ))}
        </GameViewCard>
      </ExploreSection>
      <ExploreSection
        title="Most Popular"
        subtitle="How many have you played?"
        link={TopRatedLink()}
      >
        <GameViewCard>
          {games.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <HomeControlComponent
                game={game}
                inCollection={gameIds.includes(game.gameId)}
                userId={session.id}
              />
            </GameCardCover>
          ))}
        </GameViewCard>
      </ExploreSection>
    </div>
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
      toast.success("Saved to collection");
    }
  }, [setIsInCollection, fetcher.data]);

  return (
    <div className="flex flex-row justify-between">
      {isInCollection ? (
        <>
          <Button
            className="animate-in slide-in-from-bottom-3"
            variant={"outline"}
            size={"bubble"}
          >
            In your collection
          </Button>
        </>
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
