import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Toggle } from "@/components/ui/toggle";
import { getGamesFromPlaylist } from "@/features/playlists/fetching/get-playlist-games";
import { getPlaylistDetails } from "@/features/playlists/fetching/get-playlists";
import { useView } from "@/hooks/view";
import { db } from "@/util/db/db.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

// This action is currently for adding (and eventually removing) games from a specific
// playlist. It takes a gameId as part of the request formData, and the playlistId is extracted
// from the url as a param
// TODO: Add remove game functionality
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const body = await request.json();
  console.log(body);

  const playlistId = params.playlistId;
  invariant(playlistId, "Expected a playlistId");

  // TODO: This stuff could be moved to zod, and it would probably be a lot cleaner to work with. Here, the body
  // variable is still an any, which is not ideal
  if (!Array.isArray(body)) {
    return new Response("Invalid input, must be an array of numbers.", { status: 400 });
  }

  if (!body.every((gameId) => typeof gameId === "number")) {
    return new Response("Invalid input, must be an array of numbers.", { status: 400 });
  }

  if (json.length >= 1) {
    try {
      const responseBody = [];
      for (const gameId of body) {
        const addedGame = await db.playlistsOnGames.create({
          data: {
            gameId,
            playlistId: Number(playlistId),
          },
        });

        responseBody.push(addedGame);
      }
      return json({ responseBody });
    } catch (err) {
      return new Response("Server failure, unable to post all games to playlist", {
        status: 500,
      });
    }
  } else {
    return new Response(
      "Array is empty. Please send an array containing atleast one number.",
      { status: 400 },
    );
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const playlistId = Number(params.playlistId);
  invariant(playlistId, "Expected playlist id");

  const [games, playlist] = await Promise.all([
    cacheFetch(playlistId, ["playlist", "games"], getGamesFromPlaylist),
    cacheFetch(playlistId, ["playlist", "details"], getPlaylistDetails),
  ]);

  return typedjson({ games, playlist });
};

export default function PlaylistView() {
  const { games, playlist } = useTypedLoaderData<typeof loader>();

  const { isViewCard, handleToggleView } = useView();

  // TODO: fix the types here, make sure that the type for the shared game view is the lowest common denominator
  return (
    <div>
      <div className="flex w-full flex-col gap-7 rounded-md border px-6 py-8">
        <h1 className="text-6xl font-black text-primary">
          {playlist?.name.toUpperCase()}
        </h1>
        <h1>
          <span className="mr-3">a playlist by</span>
          <Button size={"link"} variant={"link"}>
            {playlist?.user.username}
          </Button>
        </h1>
        <div className="flex flex-row gap-2">
          <Button size={"sm"} variant={"secondary"}>
            Follow
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            Message
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            Kudos
          </Button>
        </div>
      </div>
      <Toggle
        className="my-6"
        pressed={isViewCard}
        variant={"outline"}
        onPressedChange={handleToggleView}
        aria-label="view"
      >
        <MenuIcon />
      </Toggle>
      {isViewCard ? (
        <GameViewCard>
          {games.map((game) => (
            <GameCardCover key={game.id} game={game} isSelected={false}>
              <Controls />
            </GameCardCover>
          ))}
        </GameViewCard>
      ) : (
        <GameViewList>
          {games.map((game) => (
            <GameListEntry key={game.id} game={game}>
              <Controls />
            </GameListEntry>
          ))}
        </GameViewList>
      )}
    </div>
  );
}

function Controls() {
  return <div>controls</div>;
}
