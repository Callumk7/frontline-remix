import { Button } from "@/components/ui/button";
import { auth } from "@/features/auth/helper.server";
import { IGDBGame, IGDBGameSchema } from "@/features/search/types";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Starting to experiment with getting data from IGDB that is useful for discovery.
// Lets start this experiment with popular games.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const popularGames = await getPopularGames();

  return json({ session, popularGames });
};

export default function PopularPage() {
  const { session, popularGames } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-4/5">
      <div className="flex flex-col gap-4">
        {popularGames.map((game) => (
          <div key={game.id} className="flex justify-between gap-10 items-center border rounded-md p-2">
            <div className="flex justify-between w-full">
              <h2 className="font-bold">{game.name}</h2>
              <p>
                <span>Rating: </span>
                {game.rating && <span>{Math.floor(game.rating)}</span>}
              </p>
            </div>
            <Button>Save to collection</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const getPopularGames = async () => {
  const url = "https://api.igdb.com/v4/games";
  const headers = {
    "Client-ID": process.env.IGDB_CLIENT_ID!,
    Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
    "content-type": "text/plain",
  };
  const body = `fields name, artworks.image_id, screenshots.image_id, aggregated_rating, aggregated_rating_count, cover.image_id, storyline, rating, first_release_date, genres.name; limit 40; where artworks != null & cover.image_id != null & rating > 80 & follows >= 100; sort follows desc;`;
  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();

  const results: IGDBGame[] = [];
  for (const result of data) {
    const validResult = IGDBGameSchema.parse(result);
    results.push(validResult);
  }
  console.log(`${results.length} valid results`);
  return results;
};
