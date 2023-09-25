import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";
import { Input } from "@/components/ui/form";
import { AddPlaylistDialog } from "@/features/playlists/components/AddPlaylistDialog";
import { Toggle } from "@/components/ui/toggle";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { ChevronDown } from "@/components/ui/icons/ChevronDown";
import { PlaylistWithGames } from "@/features/playlists/queries/get-playlists";
import { useSubmit } from "@remix-run/react";

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
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <span className="mr-2">Menu</span> <ChevronDown />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Bulk Manage</MenubarLabel>
            <MenubarSeparator />

            <MenubarItem
              onClick={selectedGames.length > 0 ? handleUnselectAll : handleSelectAll}
            >
              {selectedGames.length > 0 ? "Deselect all" : "Select all"}
            </MenubarItem>

            <MenubarSub>
              <MenubarSubTrigger disabled={selectedGames.length === 0}>
                <span>Add selected to Playlist..</span>
              </MenubarSubTrigger>
              <MenubarSubContent>
                {playlists.map((playlist, index) => (
                  <MenubarItem
                    id={String(playlist.id)}
                    key={index}
                    onClick={() => handleBulkAddToPlaylist(playlist.id)}
                  >
                    {playlist.name}
                  </MenubarItem>
                ))}

                <MenubarSeparator />

                <MenubarItem onClick={() => setDialogOpen(true)}>
                  Create Playlist..
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            <MenubarItem
              onClick={() => console.log("delete selected games")}
              className="focus-visible:bg-destructive/80"
            >
              Remove selected from Collection
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Toggle
        pressed={!viewIsCard}
        variant={"outline"}
        onPressedChange={handleToggleView}
        aria-label="view"
      >
        <MenuIcon />
      </Toggle>

      <AddPlaylistDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        userId={userId}
      />
    </div>
  );
}
