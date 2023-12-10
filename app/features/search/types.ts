import { z } from "zod";

// zod validation, primarily for data returned from IGDB.
const genreType = z.object({
	id: z.number(),
	name: z.string(),
});

const coverType = z.object({
	id: z.number(),
	image_id: z.string(),
});

const screenshotType = z.object({
	id: z.number(),
	image_id: z.string(),
});

const artworkType = z.object({
	id: z.number(),
	image_id: z.string(),
});

export const IGDBGameSchema = z.object({
	id: z.number(),
	genres: z.array(genreType).optional(),
	name: z.string(),
	cover: coverType,
	storyline: z.string().optional(),
	screenshots: z.array(screenshotType).optional(),
	artworks: z.array(artworkType),
	rating: z.number().optional(),
	aggregated_rating: z.number().optional(),
	aggregated_rating_count: z.number().optional(),
	involved_companies: z.array(z.number()).optional(),
	first_release_date: z.number().optional(),
});

export type IGDBGame = z.infer<typeof IGDBGameSchema>;
