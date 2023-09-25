import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { DragHandle } from "@/components/ui/icons/DragHandle";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/features/auth/helper.server";
import { db } from "@/util/db/db.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const playlistId = Number(params.playlistId);
  const session = await auth(request);

  const games = await db.game.findMany({
    where: {
      users: {
        some: {
          userId: session.id,
        },
      },
    },
  });

  return json({ session, games, playlistId });
};

export default function AddGamesPage() {
  const { session, games, playlistId } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredGames, setFilteredGames] = useState<typeof games>(games);
  const fetcher = useFetcher();

  useEffect(() => {
    let output = [...games];
    if (searchTerm !== "") {
      output = output.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredGames(output);
  }, [searchTerm, games]);

  const handleAddToPlaylist = (playlistId: number, gameId: number) => {
    const payload = JSON.stringify([gameId]);
    fetcher.submit(payload, {
      method: "post",
      action: `/playlists/${playlistId}`,
      encType: "application/json",
    });
  };

  return (
    <div className="m-4 w-4/5 rounded-md border bg-background-menu p-4">
      <Input
        type="text"
        id="search"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredGames.map((game) => (
        <div key={game.id}>
          <div className="relative flex w-full flex-row items-center justify-between rounded-md p-3 hover:bg-accent">
            <div className="flex flex-row items-center gap-x-2">
              <DragHandle />
              <p>{game.title}</p>
            </div>
            <Button
              variant={"secondary"}
              onClick={() => handleAddToPlaylist(playlistId, game.gameId)}
            >
              Add
            </Button>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
}
