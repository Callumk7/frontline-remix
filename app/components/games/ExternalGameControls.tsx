import { IGDBGame } from "@/features/search/igdb";
import { Button } from "../ui/button";

interface ExternalGameControlsProps {
  game: IGDBGame;
}
export function ExternalGameControls({ game }: ExternalGameControlsProps) {
  const handleSave = () => {
    fetch("/explore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  };
  return <Button onClick={handleSave}>Save</Button>;
}
