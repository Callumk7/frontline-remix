import clsx from "clsx";
import { GameWithCoverAndGenres, IGDBImage } from "./types";

interface GameCardCoverProps {
  game: GameWithCoverAndGenres;
  isSelected: boolean;
  children: React.ReactNode;
}

export function GameCardCover({ game, isSelected, children }: GameCardCoverProps) {
  const size: IGDBImage = "720p";

  let borderStyle = "border hover:border-foreground";
  if (isSelected) {
    borderStyle =
      "border border-lime-500/40 hover:border-lime-500 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40";
  } else if (game.aggregatedRating !== null && game.aggregatedRating > 95) {
    borderStyle =
      "border border-orange-500/40 hover:border-orange-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40";
  }

  let releaseDateStr = "";
  if (game.releaseDate === null) {
    releaseDateStr += "unknown release date..";
  } else {
    releaseDateStr = new Date(game.releaseDate * 1000).toDateString();
  }

  return (
    <div className="max-w-max">
      <div
        className={clsx(
          borderStyle,
          "relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground",
        )}
      >
        <img
          className="animate-in"
          src={`https://images.igdb.com/igdb/image/upload/t_${size}/${game.cover?.imageId}.jpg`}
          alt="cover image"
          width={720}
          height={1280}
        />
      </div>
      <div className="max-w-[720px] pt-3 animate-in">{children}</div>
    </div>
  );
}
