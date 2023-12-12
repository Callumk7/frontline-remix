import { IGDBGame, IGDBGameSchema } from "@/types/api/igdb";

export const getPopularGames = async () => {
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

export const getGenres = async () => {
  const url = "https://api.igdb.com/v4/genres";
  const headers = {
    "Client-ID": process.env.IGDB_CLIENT_ID!,
    Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
    "content-type": "text/plain",
  };
  const body = "fields *; limit 50;";
  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();

  return data as { id: number; name: string }[];
};

export const getPlatforms = async () => {
  const url = "https://api.igdb.com/v4/platforms";
  const headers = {
    "Client-ID": process.env.IGDB_CLIENT_ID!,
    Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
    "content-type": "text/plain",
  };
  const body = "fields *; limit 50;";
  const response = await fetch(url, { method: "POST", headers, body });
  const data = await response.json();

  return data as { id: number; name: string }[];
};
