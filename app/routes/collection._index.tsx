import { GameView } from "@/components/games/GameView";
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
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlists = await getUserPlaylists(session.id);
  const games = await getUserCollection(session.id);
  const genres = await getUserGenres(session.id);
  return typedjson({ games, session, playlists, genres });
};

const DEFAULT_SORT_OPTION: SortOption = "rating";

export default function CollectionView() {
  const { games, session, playlists, genres } = useTypedLoaderData<typeof loader>();

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
          viewIsCard={true}
          handleToggleView={() => console.log("toggle")}
        />
        <GameViewSort sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      <GameView
        games={sortedGames}
        ControlComponent={CollectionEntryControls}
        selectedGames={selectedGames}
        controlProps={{
          handleSelectedToggled,
          playlists,
          selectedGames,
        }}
      />
    </div>
  );
}
