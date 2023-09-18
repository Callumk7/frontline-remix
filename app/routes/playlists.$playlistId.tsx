import { GameView } from "@/components/games/GameView";
import { getGamesFromPlaylist } from "@/features/playlists/fetching/get-playlist-games";
import { db } from "@/util/db/db.server";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

// This action is currently for adding (and eventually removing) games from a specific
// playlist. It takes a gameId as part of the request formData, and the playlistId is extracted
// from the url as a param
// TODO: Add remove game functionality
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const gameId = body.get("gameId");
  const playlistId = params.playlistId;

  invariant(gameId, "Expected a gameId");
  invariant(playlistId, "Expected a playlistId");

  const addedGame = await db.playlistsOnGames.create({
    data: {
      gameId: Number(gameId),
      playlistId: Number(playlistId),
    },
  });

  return json({ addedGame });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const playlistId = Number(params.playlistId);
  invariant(playlistId, "Expected playlist id");

  const games = await getGamesFromPlaylist(playlistId);

  return typedjson({ games });
};

export default function PlaylistView() {
  const { games } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <GameView
        games={games}
        selectedGames={[]}
        ControlComponent={Controls}
        controlProps={{}}
      />
    </div>
  );
}

function Controls() {
  return <div>controls</div>;
}
