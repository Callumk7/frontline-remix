import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { GameViewSort } from "@/components/games/GameViewSort";
import { CollectionEntryControls } from "@/features/collection/components/CollectionGameControls";
import { CollectionViewMenu } from "@/features/collection/components/CollectionViewMenu";
import { GenreFilter } from "@/features/collection/components/GenreFilter";
import { getUserCollection } from "@/features/collection/fetching/get-collection";
import { getUserGenres } from "@/features/collection/fetching/get-genres";
import { useFilter } from "@/features/collection/hooks/filtering";
import { useSelectGames } from "@/features/collection/hooks/select";
import { SortOption, useSort } from "@/features/collection/hooks/sorting";
import { getUserPlaylists } from "@/features/playlists/fetching/get-playlists";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  // redis cache
  const [games, playlists, genres] = await Promise.all([
    cacheFetch(session.id, ["collection"], getUserCollection),
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
  const {
    searchTerm,
    genreFilter,
    filteredGames,
    handleSearchTermChanged,
    handleGenreToggled,
    handleToggleAllGenres,
  } = useFilter(games, genres);

  // sorting options
  const { sortOption, setSortOption, sortedGames } = useSort(
    DEFAULT_SORT_OPTION,
    filteredGames,
  );

  // select game functions
  // NOTE: selected games is used in menubars for bulk editing games where needed
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
      </div>
      {isViewCard ? (
        <GameViewCard>
          {sortedGames.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <CollectionEntryControls
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
