import { Separator } from "../ui/separator";
import { DragHandle } from "../ui/icons/DragHandle";
import { GameWithCoverAndGenres } from "./types";

interface GameListEntryProps {
  game: GameWithCoverAndGenres;
  children: React.ReactNode;
}
export function GameListEntry({ game, children }: GameListEntryProps) {
  return (
    <div>
      <div className="relative flex w-full flex-row items-center justify-between rounded-md p-3 hover:bg-accent/60">
        <div className="flex flex-row space-x-2">
          <DragHandle className="h-6 w-6" />
          <p className="cursor-pointer font-bold text-foreground">{game.title}</p>
        </div>
        <div className="w-fit">{children}</div>
      </div>
      <Separator />
    </div>
  );
}
