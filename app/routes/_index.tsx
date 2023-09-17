import { GameCardCover } from "@/components/games/GameCard";
import { gameInclude } from "@/components/games/types";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "This is the way" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const games = await db.game.findMany({
    include: gameInclude,
  });

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return typedjson({ games, session });
};

export default function Index() {
  const data = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h2>user information</h2>
        <p>username:</p>
        <p>{data.session.username}</p>
        <p>{data.session.id}</p>
      </div>
      {data.games.map((game, i) => (
        <GameCardCover key={i} game={game} isSelected={false}>
          <div>children</div>
        </GameCardCover>
      ))}
    </div>
  );
}
