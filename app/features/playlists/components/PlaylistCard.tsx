import { Link } from "@remix-run/react";
import { IGDBImage } from "@/components/games/types";
import { Button } from "@/components/ui/button";
import { PlaylistWithGames } from "../queries/get-playlists";
import { UserLink } from "@/features/profile/components/UserLink";

interface PlaylistCardProps {
  playlist: PlaylistWithGames;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const size: IGDBImage = "cover_big";
  return (
    <Link
      to={`/playlists/${playlist.id}`}
      className="h-80 w-full rounded-md bg-background-3"
    >
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
      <h1 className="px-3 py-2 font-semibold">{playlist.name}</h1>
      <div className="flex flex-row items-end gap-3 px-3 py-2 text-sm text-foreground/80">
        <span className="py-1">Created by</span>
        <UserLink username={playlist.user.username} userId={playlist.userId} />
      </div>
    </Link>
  );
}
