import { IGDBGame } from "@/features/search/igdb";
import { Button } from "../ui/button";
import { useFetcher } from "@remix-run/react";
import { Spinner } from "../ui/icons/Spinner";
import { useEffect } from "react";
import { toast } from "sonner";

interface ExternalGameControlsProps {
  game: IGDBGame;
}

export function ExternalGameControls({ game }: ExternalGameControlsProps) {
  const fetcher = useFetcher();

  useEffect(() => {
    toast.success("Successfully saved");
  }, [fetcher.data]);

  return (
    <fetcher.Form action="/search" method="post">
      <input type="hidden" name="json" value={JSON.stringify(game)} />
      <Button>
        {fetcher.state === "submitting" ? <Spinner className="animate-spin" /> : "Save"}
      </Button>
    </fetcher.Form>
  );
}
