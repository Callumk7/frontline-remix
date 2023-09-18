import { Prisma } from "@prisma/client";

export type IGDBImage =
	| "cover_small"
	| "screenshot_med"
	| "cover_big"
	| "logo_med"
	| "screenshot_big"
	| "screenshot_huge"
	| "thumb"
	| "micro"
	| "720p"
	| "1080p";

export const gameInclude = {
	cover: true,
	genres: {
		include: {
			genre: true,
		},
	},
} satisfies Prisma.GameInclude;

export type GameWithCoverAndGenres = Prisma.GameGetPayload<{
	include: typeof gameInclude;
}>;

export const gameFromCollectionInclude = {
	cover: true,
	genres: {
		include: {
			genre: true,
		},
	},
	users: true,
	playlists: {
		include: {
			playlist: true,
		},
	},
} satisfies Prisma.GameInclude;

export type GameFromCollectionWithPlaylists = Prisma.GameGetPayload<{
	include: typeof gameFromCollectionInclude;
}>;
