import { GameWithCoverAndGenres } from "@/components/games/types";
import { Switch } from "@radix-ui/react-switch";
import { GameFromPlaylist } from "../queries/get-playlist-games";
interface PlaylistGameControlsProps {
  game: GameFromPlaylist;
}
export function PlaylistControls({ game }: PlaylistGameControlsProps) {
  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <Switch checked={game.users[0].played} />
    </div>
  );
}
