import { Container } from "@/components/ui/layout/containers";
import { getGenres, getTopGamesFromGenreId } from "./queries/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type GameCollection = {
  name: string;
  games: any[];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const genres = await getGenres();
  // for each genre, we want to create a collection
  
  const collections: GameCollection[] = [];
  for (const genre of genres) {
    const games = await getTopGamesFromGenreId(genre.id);
    collections.push({ name: genre.name, games });
  }

  console.log(collections);

  return json({ collections });
};


export default function DiscoverRoute() {
  // lets start this off with a series of views for best games
  // of each popular genre.
  const { collections } = useLoaderData<typeof loader>();
  return (
    <Container>
      <div className="flex flex-col gap-10">
        {collections.map(collection => (
          <div key={collection.name}>
            <h2 className="text-lg font-bold">{collection.name}</h2>
            {collection.games.map(game => (
              <div key={game.id}>{game.name}</div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  )
}
