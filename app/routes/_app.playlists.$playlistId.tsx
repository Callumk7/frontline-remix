import { GameCardCover } from "@/components/games/GameCard";
import { GameListEntry } from "@/components/games/GameList";
import { GameViewCard, GameViewList } from "@/components/games/GameView";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Toggle } from "@/components/ui/toggle";
import { CommentType, CommentView } from "@/features/comments/components/CommentView";
import { getGamesFromPlaylist } from "@/features/playlists/fetching/get-playlist-games";
import { getPlaylistDetails } from "@/features/playlists/fetching/get-playlists";
import { useView } from "@/hooks/view";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { cacheFetch } from "@/util/redis/cache-fetch";
import { invalidateCache } from "@/util/redis/invalidate-cache";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const playlistId = Number(params.playlistId);
  invariant(playlistId, "Expected playlist id");

  const [games, playlist] = await Promise.all([
    cacheFetch(playlistId, ["playlist", "games"], getGamesFromPlaylist),
    cacheFetch(playlistId, ["playlist", "details"], getPlaylistDetails),
  ]);

  return typedjson({ games, playlist, session });
};

const comments: CommentType[] = [
  {
    id: 1,
    user: {
      name: "Thierry Henry",
      title: "Former Striker",
      imageUrl:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F69%2Fdd%2Fd0%2F69ddd0aaf2d8072294f8076c1bbbc0a8.jpg&f=1&nofb=1&ipt=6ccb33bf112453974b8c1a1f743b1432a42dcb4fbd4f7345b6deaed215dec7f6&ipo=images",
    },
    body: "I enjoyed playing 'FIFA'. Just like when Arsenal used to dominate Tottenham, orchestrating precise attacks to score goals in this game brings back memories. It's a reminder of good times. Tottenham are shit.",
  },
  {
    id: 2,
    user: {
      name: "Patrick Vieira",
      title: "Former Midfielder",
      imageUrl:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftmssl.akamaized.net%2Fimages%2Fportrait%2Foriginals%2F3183-1458213441.jpg&f=1&nofb=1&ipt=8b92b0782d94349504aa55b62c32c59817debf3f81b13f13d74cfa86262079d8&ipo=images",
    },
    body: "In 'Call of Duty', the tactical decisions made under pressure mirrors the spirit of a North London derby. Every victory, just like at Arsenal against Tottenham, feels hard-earned and rewarding. Tottenham are shit.",
  },
  {
    id: 3,
    user: {
      name: "Dennis Bergkamp",
      title: "Former Striker",
      imageUrl:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.daznservices.com%2Fdi%2Flibrary%2Fgoal_uk%2F55%2F6%2Fdennis-bergkamp-arsenal_v7q8iysxgst51n0n1bt5fjdu9.jpg%3Ft%3D-279420448%26quality%3D100&f=1&nofb=1&ipt=0ba654bf2d80574b530331fde08f15dcfa696ec5b64cfed7e0ceaa519ac69310&ipo=images",
    },
    body: "Playing 'World of Warcraft' has been an epic experience where victory demands teamwork and strategy, much like Arsenal's memorable wins over Tottenham. Those raid bosses falling felt like winning the derby matches. Tottenham are shit.",
  },
  {
    id: 4,
    user: {
      name: "Robert Pires",
      title: "Former Midfielder",
      imageUrl:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.V7QWw8GzF5TriZJgYGiU7wHaE6%26pid%3DApi&f=1&ipt=90b84fb71c96c96b13fb7601fcc651d627d871b92b3264971ccc5e47ac7db862&ipo=images",
    },
    body: "Super Mario Brothers, just like many Arsenal games, starts easy but gets challenging. Getting past those tricky levels reminds me of how we had to overcome Tottenham's defenses on the pitch. Tottenham are shit.",
  },
  {
    id: 5,
    user: {
      name: "Freddie Ljungberg",
      title: "Former Winger",
      imageUrl:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fs-media-cache-ak0.pinimg.com%2F736x%2F0a%2F92%2F68%2F0a9268dcfe3c909a2dfde108432700e4.jpg&f=1&nofb=1&ipt=184c16cbce20830600f48b7b67a02c4fa898619c8ca87dcf871467c293bbe167&ipo=images",
    },
    body: "Mastering 'Skyrim', with its intricate tales and vast world, feels like preparing for a North London derby. The triumph over dragons is as sweet as those victories over Tottenham. Tottenham are shit.",
  },
];
export default function PlaylistView() {
  const { games, playlist, session } = useTypedLoaderData<typeof loader>();

  const isOwner = playlist?.userId === session.id;

  const fetcher = useFetcher();

  const { isViewCard, handleToggleView } = useView();

  // TODO: fix the types here, make sure that the type for the shared game view is the lowest common denominator
  return (
    <div>
      <div className="flex w-full flex-col gap-7 px-6 py-8">
        <h1 className="text-title font-cabin font-black leading-none text-foreground">
          {playlist?.name}
        </h1>
        <h1>
          <span className="mr-3">a playlist by</span>
          <Button size={"link"} variant={"link"}>
            {playlist?.user.username}
          </Button>
        </h1>
        {isOwner ? (
          <div>nice</div>
        ) : (
          <div className="flex flex-row gap-2">
            <fetcher.Form method="post" action="/playlists/follow">
              <Button size={"sm"} variant={"secondary"}>
                Follow
              </Button>
            </fetcher.Form>
            <Button size={"sm"} variant={"secondary"}>
              Message
            </Button>
            <Button size={"sm"} variant={"secondary"}>
              Kudos
            </Button>
          </div>
        )}
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
      <CommentView comments={comments} />
    </div>
  );
}

function Controls() {
  return <div>controls</div>;
}
