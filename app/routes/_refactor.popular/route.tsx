import { Button } from "@/components/ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGenres, getPlatforms, getPopularGames } from "./queries/igdb";
import { getPopularPlaylists } from "./queries/prisma";

// Starting to experiment with getting data from IGDB that is useful for discovery.
// Lets start this experiment with popular games.
export const loader = async ({ request }: LoaderFunctionArgs) => {

  const [popularGames, genres, platforms, popularPlaylists] = await Promise.all([
    getPopularGames(),
    getGenres(),
    getPlatforms(),
    getPopularPlaylists(),
  ]);

  return json({ popularGames, genres, platforms, popularPlaylists });
};

export default function PopularPage() {
  const { popularGames, genres, platforms, popularPlaylists } = useLoaderData<typeof loader>();
  return (
    <div className="w-4/5 mx-auto mt-10">
      <div>
        {popularPlaylists.map(playlist => (
          <div key={playlist.id}>{playlist.name}</div>
        ))}
      </div>
      <div className="grid grid-cols-4">
      </div>
      <FilterMenu genres={genres} platforms={platforms} />
      <div className="mx-auto mt-10 flex w-10/12 justify-stretch gap-6">
        <div className="flex w-1/2 flex-col gap-4">
          {popularGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between gap-10 rounded-md border p-2"
            >
              <div className="flex w-full justify-between">
                <h2 className="font-bold">{game.name}</h2>
                <p>
                  <span>Rating: </span>
                  {game.rating && <span>{Math.floor(game.rating)}</span>}
                </p>
              </div>
              <Button>Save to collection</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



interface FilterMenuProps {
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
}

function FilterMenu({ genres, platforms }: FilterMenuProps) {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Genre</MenubarTrigger>
        <MenubarContent>
          {genres.map((genre) => (
            <MenubarItem key={genre.id}>{genre.name}</MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Platform</MenubarTrigger>
        <MenubarContent>
          {platforms.map((platform) => (
            <MenubarItem key={platform.id}>{platform.name}</MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
