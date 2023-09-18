import { GameCardCover } from "./GameCard";
import { GameFromCollectionWithPlaylists } from "./types";

type ControlComponentType<P extends object> = (
  props: P & { game: GameFromCollectionWithPlaylists },
) => JSX.Element;

interface CoverViewProps<P extends object, T extends GameFromCollectionWithPlaylists> {
  games: T[];
  ControlComponent: ControlComponentType<P>;
  controlProps: P;
  selectedGames: number[];
}
export function GameView<P extends object, T extends GameFromCollectionWithPlaylists>({
  games,
  ControlComponent,
  controlProps,
  selectedGames,
}: CoverViewProps<P, T>) {
  if (games.length === 0) {
    return <div className="w-full text-center text-4xl">🫠 no games found</div>;
  }
  return (
    <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {games.map((game) => (
        <GameCardCover
          key={game.id}
          game={game}
          isSelected={selectedGames.includes(game.id)}
        >
          <ControlComponent game={game} {...controlProps} />
        </GameCardCover>
      ))}
    </div>
  );
}
