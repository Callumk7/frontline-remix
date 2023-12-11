import { IGDBGame, IGDBGameSchema } from "@/features/search/types";

const HEADERS = {
	"Client-ID": process.env.IGDB_CLIENT_ID!,
	Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
	"content-type": "text/plain",
};

export const getTopGamesFromGenreId = async (genreId: number) => {
	const url = process.env.IGDB_URL!;
	const body = `fields name, rating, cover.image_id, genres.name; limit 10; where genres = ${genreId} & follows > 10; sort rating desc;`;
	const response = await fetch(url, { method: "POST", headers: HEADERS, body });
	const data = await response.json();

	return data as {
		id: number;
		name: string;
		rating: number;
		cover: { image_id: string };
		genres: { name: string }[];
	}[];
};

type IGDBGameResponse = {
	id: number,
    created_at: number,
    name: string,
    slug: string,
    updated_at: number,
    url: string,
    checksum: string,
}[]

export const getGenres = async () => {
	const url = "https://api.igdb.com/v4/genres";
	const body = "fields *; limit 5;";
	const response = await fetch(url, { method: "POST", headers: HEADERS, body });
	const data = await response.json();

	return data as IGDBGameResponse;
}
