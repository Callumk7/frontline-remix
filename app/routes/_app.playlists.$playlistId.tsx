import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { ProfileLink } from "@/components/navigation/ProfileLink";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Toggle } from "@/components/ui/toggle";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentView } from "@/features/comments/components/CommentView";
import { getPlaylistComments } from "@/features/comments/queries";
import { PlaylistControls } from "@/features/playlists/components/PlaylistGameControls";
import { getGamesFromPlaylist } from "@/features/playlists/queries/get-playlist-games";
import { getPlaylistDetails } from "@/features/playlists/queries/get-playlists";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, Outlet, useFetcher, useLocation } from "@remix-run/react";
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

  // Invalidate the cache: We are not updating the details here, just the games
  await invalidateCache(playlistId, ["playlist", "games"]);

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
      return json("Server failure, unable to post all games to playlist", {
        status: 500,
      });
    }
  } else {
    return json("Array is empty. Please send an array containing atleast one number.", {
      status: 400,
    });
  }
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlistId = Number(params.playlistId);
  invariant(playlistId, "Expected playlist id");

  const games = await getGamesFromPlaylist(session.id, playlistId);
  const comments = await getPlaylistComments(playlistId);

  const [playlist] = await Promise.all([
    cacheFetch(playlistId, ["playlist", "details"], getPlaylistDetails),
  ]);

  return typedjson({ games, playlist, playlistId, session, comments });
};

export default function PlaylistView() {
  const { games, playlist, playlistId, session, comments } =
    useTypedLoaderData<typeof loader>();

  const isOwner = playlist?.userId === session.id;
  const fetcher = useFetcher();
  const location = useLocation();
  const { isViewCard, handleToggleView } = useView();

  return (
    <div>
      <div className="flex w-full flex-col gap-7 px-6 py-8">
        <h1 className="font-cabin text-6xl font-black leading-none text-foreground">
          {playlist?.name}
        </h1>
        <h1>
          <span className="text-bold mr-3">Made by:</span>
          <ProfileLink userId={playlist!.userId} username={playlist!.user.username} />
        </h1>
        {isOwner ? (
          <div className="flex flex-row gap-5">
            {location.pathname.includes("/add") ? (
              <Button asChild size={"sm"} variant={"secondary"}>
                <Link to={`/playlists/${playlistId}`}>Close Menu</Link>
              </Button>
            ) : (
              <Button asChild size={"sm"}>
                <Link to={`/playlists/${playlistId}/add`}>Add Games..</Link>
              </Button>
            )}
            <Form method="delete" action="/playlists/">
              <input type="hidden" name="userId" value={session.id} />
              <input type="hidden" name="playlistId" value={playlist?.id} />
              <Button size={"sm"} variant={"secondary"}>
                Delete
              </Button>
            </Form>
          </div>
        ) : (
          <div className="flex flex-row gap-5">
            <fetcher.Form method="post" action="/playlists/following">
              <input type="hidden" name="userId" value={session.id} />
              <input type="hidden" name="playlistId" value={playlist?.id} />
              <Button size={"sm"} variant={"secondary"}>
                Follow
              </Button>
            </fetcher.Form>
            <Button size={"sm"} variant={"secondary"}>
              Rate Playlist
            </Button>
          </div>
        )}
      </div>
      {/*
      This was an experiment to add a form through nested routing,
      and I am not sure if I like it. 
      */}
      <Outlet />
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
              <PlaylistControls game={game} />
            </GameCardCover>
          ))}
        </GameViewCard>
      ) : (
        <GameViewList>
          {games.map((game) => (
            <GameListEntry key={game.id} game={game}>
              <PlaylistControls game={game} />
            </GameListEntry>
          ))}
        </GameViewList>
      )}
      <CommentView comments={comments} />
      <CommentForm playlistId={playlistId} userId={session.id} />
    </div>
  );
}
