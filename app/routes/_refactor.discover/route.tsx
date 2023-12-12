import { Container } from "@/components/ui/layout/containers";
import { getGenres } from "./queries/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { fetchGamesFromIGDB } from "@/lib/igdb";
import {
  IGDBGame,
  IGDBGameNoArtwork,
  IGDBGameNoArtworkSchemaArray,
} from "@/types/api/igdb";
import { useLoaderData } from "@remix-run/react";
import { ExternalGameCardCover } from "@/components/games/ExternalGameCard";

const URL = process.env.IGDB_URL!;

export const loader = async (_args: LoaderFunctionArgs) => {
  // get all genres from IGDB. Not sure how to prioritise genres based on popularity, so we'll just get them all
  const genres = await getGenres([4, 5, 8, 10, 11, 13, 14, 15, 16]);
  console.log(genres);

  // we store games by their genre, so we can display them easily in the UI
  const gamesByGenre: Record<string, IGDBGameNoArtwork[]> = {};

  // Each request is now a Promise in this array
  // We have lost a try/catch, but we do have a .catch where we just log an error and don't break the app
  const genrePromises = genres.map(
    (genre) =>
      fetchGamesFromIGDB(URL, {
        fields: "full",
        limit: 10,
        sort: ["rating desc"],
        filters: [
          `genres = ${genre.id}`,
          "cover != null",
          "rating != null",
          "rating > 50",
          "follows > 10",
          "parent_game = null",
          "version_parent = null",
          "themes != (42)"
          // "first_release_date >= 1577836800"
        ],
      })
        .then((gamesFromGenre) => IGDBGameNoArtworkSchemaArray.parseAsync(gamesFromGenre))
        .then((parsedGames) => {
          gamesByGenre[genre.name] = parsedGames;
        })
        .then(() => console.log(`Parsed ${genre.name}`))
        .catch((err) => console.error("Error parsing games from IGDB", err)), // TODO: research better error handling for zod errors
  );

  await Promise.all(genrePromises);
  return json({ gamesByGenre });
};

export default function DiscoverRoute() {
  const { gamesByGenre } = useLoaderData<typeof loader>();
  return (
    <Container>
      <div className="w-full border p-5 rounded-md">
        MENU
      </div>
      <div className="flex flex-col gap-y-8">
        {Object.entries(gamesByGenre).map(([genreName, games]) => (
          <div key={genreName}>
            <h2 className="text-2xl font-bold">{genreName}</h2>
            <div className="flex flex-row gap-4">
              {games.map((game) => (
                <ExternalGameCardCover key={game.id} game={game} isSelected={false}>
                  <div>
                    <span>Rating: </span>
                    <span>{Math.floor(game.rating!)}</span>
                  </div>
                </ExternalGameCardCover>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
