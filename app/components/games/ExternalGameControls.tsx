import { IGDBGame } from "@/features/search/igdb";
import { Button } from "../ui/button";
import { useFetcher, useSubmit } from "@remix-run/react";

interface ExternalGameControlsProps {
  game: IGDBGame;
}
export function ExternalGameControls({ game }: ExternalGameControlsProps) {
  const submit = useSubmit();
  const handleSave = () => {
    fetch("/api/search/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
  };
  return <Button onClick={handleSave}>Save</Button>;
}
