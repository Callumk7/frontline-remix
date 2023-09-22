import { IGDBGame } from "@/features/search/igdb";
import { db } from "@/util/db/db.server";

const createPrismaArgs = (game: IGDBGame) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const args: any = {};
	args.gameId = game.id

}

export async function saveExternalGameToDB(game: IGDBGame) {
	try {
		const postGameToDatabase = await db.game.upsert({
			where: {
				gameId: game.id,
			},
			update: {
				aggregatedRating: game.aggregated_rating,
				aggregatedRatingCount: game.aggregated_rating_count,
				storyline: game.storyline ? game.storyline : null,
				releaseDate: game.first_release_date ? game.first_release_date : null,
			},
			create: {
				gameId: game.id,
				title: game.name,
				cover: {
					create: {
						imageId: game.cover.image_id,
					},
				},
				aggregatedRating: game.aggregated_rating,
				aggregatedRatingCount: game.aggregated_rating_count,
				storyline: game.storyline ? game.storyline : null,
				releaseDate: game.first_release_date ? game.first_release_date : null,
			},
		});

		console.log(`game saved: ${postGameToDatabase.title}`);
		// handle genres, if the game has associated genres
		if (game.genres) {
			if (game.genres.length > 0) {
				console.log("we have genres..");
				const promises = [];
				for (const genre of game.genres) {
					const upsertGenre = db.genre.upsert({
						where: {
							externalId: genre.id,
						},
						update: {},
						create: {
							externalId: genre.id,
							name: genre.name,
						},
						select: {
							id: true,
							externalId: true,
						},
					});

					promises.push(upsertGenre);
				}
				const results = await Promise.all(promises);

				const connectionPromises = [];
				for (const genre of results) {
					console.log(`${game.id} game id, ${genre.id} genre id`);
					const connectGenre = db.genresOnGames.upsert({
						where: {
							gameId_genreId: {
								gameId: game.id,
								genreId: genre.id,
							},
						},
						update: {
							gameId: game.id,
							genreId: genre.id,
						},
						create: {
							gameId: game.id,
							genreId: genre.id,
						},
					});

					connectionPromises.push(connectGenre);
					console.log(`genre connection promise made: ${genre.id}`);
				}
				const connectionResults = await Promise.all(connectionPromises);
				console.log(connectionResults);
				if (connectionResults.length === results.length) {
					console.log(
						"Good news everyone! It looks like all connections are completed",
					);
				} else {
					console.log("Something went wrong.. we have");
					console.log(`${results.length} genres processed, but only`);
					console.log(`${connectionResults.length} connections processed.. `);
					console.log(`${game.name}, id: ${game.id}`);
				}
			}
		}

		// handle artwork
		if (game.artworks) {
			console.log(`${game.artworks.length} artworks to process`);
			const promises = [];
			for (const artwork of game.artworks) {
				const upsertArtwork = db.artwork.upsert({
					where: {
						imageId: artwork.image_id,
					},
					update: {},
					create: {
						imageId: artwork.image_id,
						gameId: game.id,
					},
				});
				promises.push(upsertArtwork);
				console.log(`artwork promise to ${game.name}, id: ${artwork.id}`);
			}

			const results = await Promise.all(promises);
			console.log(`${results.length} promises completed: Artwork`);
		}

		if (game.screenshots) {
			console.log(`${game.screenshots.length} screenshots to process`);
			const promises = [];
			for (const screenshot of game.screenshots) {
				const upsertScreenshot = db.screenshot.upsert({
					where: {
						imageId: screenshot.image_id,
					},
					update: {},
					create: {
						imageId: screenshot.image_id,
						gameId: game.id,
					},
				});

				promises.push(upsertScreenshot);
				console.log(`screenshot posted to ${game.name}, id: ${screenshot.id}`);
			}
			const results = await Promise.all(promises);
			console.log(`${results.length} promises completed: Screenshots`);
		}

		return game;

	} catch (err) {
		throw new Error("Error during prisma run, unable to save game");
	}
}
