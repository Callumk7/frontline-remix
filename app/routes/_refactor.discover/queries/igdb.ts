import { IGDBGame, IGDBGameNoArtwork, IGDBGameNoArtworkSchema, IGDBGameNoArtworkSchemaArray } from "@/types/api/igdb";

const HEADERS = {
	"Client-ID": process.env.IGDB_CLIENT_ID!,
	Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
	"content-type": "text/plain",
};

export const getTopGamesFromGenreId = async (
	genreId: number,
): Promise<IGDBGameNoArtwork[]> => {
	const url = process.env.IGDB_URL!;
	const body = `fields name, rating, aggregated_rating, aggregated_rating_count, cover.image_id, genres.name; limit 10; where genres = ${genreId} & follows > 10; sort rating desc;`;

	let data = [];
	try {
		const res = await fetch(url, { method: "POST", headers: HEADERS, body });
		const json = await res.json();
		data = json;

	} catch (err) {
		console.error(err);
	}

	// I've added a zod check within the function, that will throw a zod error. This should
	// be moved outside this function really, that will follow.
	const parsedData = IGDBGameNoArtworkSchemaArray.parse(data);
	return parsedData;
};

type IGDBGameResponse = {
	id: number;
	created_at: number;
	name: string;
	slug: string;
	updated_at: number;
	url: string;
	checksum: string;
}[];

export const getGenres = async (genreIds?: number[]) => {
	const url = "https://api.igdb.com/v4/genres";
	let body = "fields *; limit 20;";
	if (genreIds) {
		const ids = genreIds.join(",");
		body += `where id = (${ids});`;
	} 
	const response = await fetch(url, { method: "POST", headers: HEADERS, body });
	const data = await response.json();

	return data as IGDBGameResponse;
};
