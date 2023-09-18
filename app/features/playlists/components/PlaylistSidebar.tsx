import { Button } from "@/components/ui/button";
import { Add } from "@/components/ui/icons/Add";
import { useState } from "react";
import { AddPlaylistDialog } from "./AddPlaylistDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "@/components/ui/icons/ChevronRight";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import { Link } from "@remix-run/react";
import { PlaylistWithGames } from "../fetching/get-playlists";

interface PlaylistSidebarProps {
  userId: string;
  playlists: PlaylistWithGames[];
  // TODO: add user information to playlist type
  followedPlaylists: PlaylistWithGames[];
}

export function PlaylistSidebar({
  userId,
  playlists,
  followedPlaylists,
}: PlaylistSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="mb-5 flex h-full min-h-[80vh] w-1/4 min-w-[256px] flex-col gap-2 justify-self-start rounded-lg border px-3 animate-in">
        <Button
          onClick={() => setDialogOpen(true)}
          className="mx-4 my-6"
          variant={"secondary"}
        >
          <span className="mr-1">Add Playlist</span> <Add />
        </Button>
        <Collapsible defaultOpen>
          <CollapsibleTrigger>
            <div className="flex space-x-2">
              <h1 className="font-poppins font-semibold text-primary">My Playlists</h1>
              <ChevronRight className="text-primary" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {playlists &&
              playlists.map((playlist, index) => (
                <PlaylistEntry key={index} playlist={playlist} userId={userId} />
              ))}
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen>
          <CollapsibleTrigger>
            <div className="flex space-x-2">
              <h1 className="font-poppins font-semibold text-primary">Following</h1>
              <ChevronRight className="text-primary" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {followedPlaylists &&
              followedPlaylists.map((playlist, index) => (
                <PlaylistEntry key={index} playlist={playlist} userId={userId} />
              ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
      <AddPlaylistDialog
        userId={userId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}

interface PlaylistEntryProps {
  playlist: PlaylistWithGames;
  userId: string;
}

function PlaylistEntry({ playlist, userId }: PlaylistEntryProps) {
  return (
    <Link
      to={`/playlists/${playlist.id}`}
      className="relative m-1 mb-2 flex flex-col place-items-start justify-start rounded-md p-1 hover:bg-background-90"
    >
      <div className="px-2 py-1 text-sm font-medium text-foreground">{playlist.name}</div>
      <div className="inset-3 flex flex-row space-x-4">
        <p className="px-2 text-xs  text-foreground/60">{playlist.user.username}</p>
        <p className=" text-xs  text-foreground/60">
          {playlist.games ? playlist.games.length : 0}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="absolute right-2 top-2" size={"icon"} variant={"outline"}>
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem onClick={() => console.log("delete clicked")}>
            Delete Playlist
          </DropdownMenuItem>
          <DropdownMenuItem>Rename...</DropdownMenuItem>
          <DropdownMenuItem>Share...</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}
