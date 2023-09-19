import { Link } from "@remix-run/react";
import { IGDBImage } from "@/components/games/types";
import { PlaylistWithGames } from "../fetching/get-playlists";
import { Button } from "@/components/ui/button";

interface PlaylistCardProps {
  playlist: PlaylistWithGames;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const size: IGDBImage = "cover_big";
  return (
    <Link to={`/playlists/${playlist.id}`} className="w-full rounded-md bg-slate-900">
      <div className="relative bottom-10 left-5 grid w-[136px] grid-cols-2 overflow-hidden rounded-md shadow-md">
        {playlist.games.slice(0, 4).map((game) => (
          <img
            key={game.gameId}
            src={`https://images.igdb.com/igdb/image/upload/t_${size}/${game.game.cover?.imageId}.jpg`}
            alt={game.game.title}
            width={68}
            height={96}
          />
        ))}
      </div>
      <h1 className="px-3 py-2 font-poppins font-semibold">{playlist.name}</h1>
      <div className="text-foreground/80 text-sm flex flex-row items-end gap-3 px-3 py-2">
        <span className="py-1">Created by</span>
        <Button size={"link"} variant={"link"}>
          {playlist.user.username}
        </Button>
      </div>
    </Link>
  );
}
