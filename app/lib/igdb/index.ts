// We need something like..
// try {
//  getGames();
//  validateGames();
// } catch (err) {
// console.error(err); //  describe what the error was from
// (but continue without game data)
// }

import { IGDBGame, IGDBGameSchemaArray } from "@/types/api/igdb";

// This function validates an array into the IGDBGameSchemaArray type.
// It will throw a zod error if there are any discrepancies.
export const validateGameArray = (games: unknown[]): IGDBGame[] => {
	const parsedGames = IGDBGameSchemaArray.parse(games);
	return parsedGames;
};

// I want a fetch function that has some ability to take options as an arg:
// fields or shape, as I might want to limit to a certain shape
// limit: 10, 20, 50, etc
// filters: where, sort, etc.

interface FetchOptions {
	fields?: string[] | "full";
	limit?: number;
	filters?: string[];
	sort?: string[];
}

export const fetchGamesFromIGDB = async (
	baseUrl: string,
	options: FetchOptions,
	headersOverride?: Record<string, string>,
): Promise<unknown[]> => {
	let body = "";

	if (options.fields) {
		if (options.fields === "full") {
			body +=
				"fields name, artworks.image_id, screenshots.image_id, aggregated_rating, aggregated_rating_count, cover.image_id, storyline, first_release_date, genres.name, follows, involved_companies, rating;";
		} else {
			body += `fields ${options.fields.join(", ")};`;
		}
	}

	if (options.limit) {
		body += `limit ${options.limit};`;
	}

	if (options.filters) {
		body += `where ${options.filters.join("& ")};`;
	}
	console.log(body);

	if (options.sort) {
		body += `sort ${options.sort.join(", ")};`;
	}

	// TODO: Add pagination

	let headers: Record<string, string> = {
		"Client-ID": process.env.IGDB_CLIENT_ID!,
		Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
		"content-type": "text/plain",
	};

	if (headersOverride) {
		headers = headersOverride;
	}

	try {
		const res = await fetch(baseUrl, { method: "POST", headers, body });
		const json = await res.json();
		return json as unknown;
	} catch (e) {
		console.error(e);
		throw new Error("Error fetching games from IGDB");
	}
};
