import { IGDBGame } from "@/features/search/igdb";
import clsx from "clsx";
import { IGDBImage } from "./types";

interface ExternalGameCardCoverProps {
  game: IGDBGame;
  isCompleted?: boolean;
  isSelected: boolean;
  children: React.ReactNode;
}

export function ExternalGameCardCover({ game, children }: ExternalGameCardCoverProps) {
  const size: IGDBImage = "720p";

  return (
    <div className="max-w-max">
      <div className="relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground">
        <img
          className="animate-in"
          src={`https://images.igdb.com/igdb/image/upload/t_${size}/${game.cover.image_id}.jpg`}
          alt="cover image"
          width={720}
          height={1280}
        />
      </div>
      <div className="max-w-[720px] pt-3 animate-in">{children}</div>
    </div>
  );
}
