import { useState } from "react";
import { Input } from "@/components/ui/form";
import { AddPlaylistDialog } from "@/features/playlists/components/AddPlaylistDialog";
import { Toggle } from "@/components/ui/toggle";
import { ChevronDown } from "@/components/ui/icons/ChevronDown";
import { PlaylistWithGames } from "@/features/playlists/queries/get-playlists";
import { useSubmit } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

interface CollectionViewMenuProps {
  userId: string;
  selectedGames: number[];
  playlists: PlaylistWithGames[];
  searchTerm: string;
  handleSelectAll: () => void;
  handleUnselectAll: () => void;
  handleSearchTermChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewIsCard: boolean;
  handleToggleView: () => void;
}

export function CollectionViewMenu({
  userId,
  selectedGames,
  playlists,
  searchTerm,
  handleSelectAll,
  handleUnselectAll,
  handleSearchTermChanged,
  viewIsCard,
  handleToggleView,
}: CollectionViewMenuProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Remix submit tool
  const submit = useSubmit();

  const handleBulkAddToPlaylist = (playlistId: number) => {
    const payload = JSON.stringify(selectedGames);
    submit(payload, {
      method: "post",
      action: `/playlists/${playlistId}`,
      encType: "application/json",
    });
  };

  return (
    <div className="flex flex-row space-x-6 self-start">
      <Input
        value={searchTerm}
        name="search"
        onChange={handleSearchTermChanged}
        placeholder="Search for a game"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <span className="mr-2">Menu</span> <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Bulk Manage</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={selectedGames.length > 0 ? handleUnselectAll : handleSelectAll}
          >
            {selectedGames.length > 0 ? "Deselect all" : "Select all"}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={selectedGames.length === 0}>
              <span>Add selected to Playlist..</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {playlists.map((playlist, index) => (
                <DropdownMenuItem
                  id={String(playlist.id)}
                  key={index}
                  onClick={() => handleBulkAddToPlaylist(playlist.id)}
                >
                  {playlist.name}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Create Playlist..
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => console.log("delete selected games")}
            className="focus-visible:bg-destructive/80"
          >
            Remove selected from Collection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Toggle
        pressed={!viewIsCard}
        variant={"outline"}
        onPressedChange={handleToggleView}
        aria-label="view"
      >
        <span className="w-max">
          Switch View
        </span>
      </Toggle>

      <AddPlaylistDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        userId={userId}
      />
    </div>
  );
}
