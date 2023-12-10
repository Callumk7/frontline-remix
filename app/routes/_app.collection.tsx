import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { GameViewSort } from "@/components/games/GameViewSort";
import { CollectionEntryControls } from "@/features/collection/components/CollectionGameControls";
import { CollectionViewMenu } from "@/features/collection/components/CollectionViewMenu";
import { GenreFilter } from "@/features/collection/components/GenreFilter";
import { getUserCollection } from "@/features/collection/queries/get-collection";
import { getUserGenres } from "@/features/collection/queries/get-genres";
import { useSelectGames } from "@/features/collection/hooks/select";
import { SortOption, useSort } from "@/features/collection/hooks/sorting";
import { getUserPlaylists } from "@/features/playlists/queries/get-playlists";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { GameViewFilter } from "@/components/games/GameViewFilter";
import { useSearch } from "@/features/collection/hooks/search";
import { useFilter } from "@/features/collection/hooks/filter";

// NOTE: -------------------------------
// I SHOULD try and co-locate the actions (for adding and removing stuff),
// with the view (for displaying stuff) as much as possible.
// For example here, this is the main collection view for a user.
// This means that this action SHOULD handle adding and removing games from the collection.
// Any form that does this elsewhere in the application Should either submit, fetcher, or Form to here.
// -------------------------------------

// TODO: ADD REMOVE GAME ACTION TO THIS ROUTE
export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const gameId = body.get("gameId");
  const userId = body.get("userId");

  if (!userId) {
    return json("not logged in, missing user id", { status: 401 });
  }

  // TODO: decide how to handle responses vs. errors
  invariant(gameId, "No game id found");

  try {
    const createCollection = await db.userGameCollection.create({
      data: {
        userId: userId.toString(),
        gameId: Number(gameId),
      },
    });

    if (createCollection) {
      console.log(
        `added collection ${createCollection.userId}, ${createCollection.gameId}`,
      );

      await invalidateCache(userId.toString(), ["collection"]);
    }

    const resBody = JSON.stringify(createCollection);
    return json(resBody, { status: 200 });
  } catch (err) {
    return json("Game already in collection", {
      status: 409,
      statusText: "Conflict",
    });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const [games, playlists, genres] = await Promise.all([
    getUserCollection(session.id),
    // WARN: I think the cache function was not finished. This should be reviewed.
    cacheFetch(session.id, ["playlists"], getUserPlaylists),
    cacheFetch(session.id, ["genres"], getUserGenres),
  ]);

  return typedjson({ games, session, playlists, genres });
};

const DEFAULT_SORT_OPTION: SortOption = "rating";

export default function CollectionView() {
  const { games, session, playlists, genres } = useTypedLoaderData<typeof loader>();

  const { isViewCard, handleToggleView } = useView();

  // filter controls
  const { searchTerm, searchedGames, handleSearchTermChanged } = useSearch(games);

  const {
    genreFilter,
    handleGenreToggled,
    handleToggleAllGenres,
    filteredGames,
    filterOnPlayed,
    filterOnCompleted,
    filterOnStarred,
    filterOnRated,
    filterOnUnrated,
    handleToggleFilterOnPlayed,
    handleToggleFilterOnCompleted,
    handleToggleFilterOnStarred,
    handleToggleFilterOnRated,
    handleToggleFilterOnUnrated,
  } = useFilter(searchedGames, genres);

  // sorting options
  const { sortOption, setSortOption, sortedGames } = useSort(
    DEFAULT_SORT_OPTION,
    filteredGames,
  );

  // select game functions
  const { selectedGames, handleSelectedToggled, handleSelectAll, handleUnselectAll } =
    useSelectGames(sortedGames);

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-10">
      <GenreFilter
        genres={genres}
        genreFilter={genreFilter}
        handleGenreToggled={handleGenreToggled}
        handleToggleAllGenres={handleToggleAllGenres}
      />
      <div className="flex flex-row gap-6">
        <CollectionViewMenu
          userId={session.id}
          selectedGames={selectedGames}
          playlists={playlists}
          searchTerm={searchTerm}
          handleSelectAll={handleSelectAll}
          handleUnselectAll={handleUnselectAll}
          handleSearchTermChanged={handleSearchTermChanged}
          viewIsCard={isViewCard}
          handleToggleView={handleToggleView}
        />
        <GameViewSort sortOption={sortOption} setSortOption={setSortOption} />
        <GameViewFilter
          filterOnPlayed={filterOnPlayed}
          filterOnCompleted={filterOnCompleted}
          filterOnStarred={filterOnStarred}
          filterOnRated={filterOnRated}
          filterOnUnrated={filterOnUnrated}
          handleToggleFilterOnPlayed={handleToggleFilterOnPlayed}
          handleToggleFilterOnCompleted={handleToggleFilterOnCompleted}
          handleToggleFilterOnStarred={handleToggleFilterOnStarred}
          handleToggleFilterOnRated={handleToggleFilterOnRated}
          handleToggleFilterOnUnrated={handleToggleFilterOnUnrated}
        />
      </div>
      {isViewCard ? (
        <GameViewCard>
          {sortedGames.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <CollectionEntryControls
                userId={session.id}
                game={game}
                playlists={playlists}
                selectedGames={selectedGames}
                handleSelectedToggled={handleSelectedToggled}
              />
            </GameCardCover>
          ))}
        </GameViewCard>
      ) : (
        <GameViewList>
          {sortedGames.map((game) => (
            <GameListEntry key={game.id} game={game}>
              <CollectionEntryControls
                userId={session.id}
                game={game}
                playlists={playlists}
                selectedGames={selectedGames}
                handleSelectedToggled={handleSelectedToggled}
              />
            </GameListEntry>
          ))}
        </GameViewList>
      )}
    </div>
  );
}
