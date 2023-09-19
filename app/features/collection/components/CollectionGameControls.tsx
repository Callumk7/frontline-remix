import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useEffect, useState } from "react";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Add } from "@/components/ui/icons/Add";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayFill } from "@/components/ui/icons/PlayFill";
import { PlayOutline } from "@/components/ui/icons/PlayOutline";
import { GameFromCollectionWithPlaylists } from "@/components/games/types";
import { useSubmit } from "@remix-run/react";
import { PlaylistWithGames } from "@/features/playlists/fetching/get-playlists";

interface CollectionEntryControlsProps {
  game: GameFromCollectionWithPlaylists;
  playlists: PlaylistWithGames[];
  selectedGames: number[];
  handleSelectedToggled: (gameId: number) => void;
}

export function CollectionEntryControls({
  game,
  playlists,
  selectedGames,
  handleSelectedToggled,
}: CollectionEntryControlsProps) {
  const [isPlayed, setIsPlayed] = useState<boolean>(game.users[0].played);
  const [isSelected, setIsSelected] = useState<boolean>(() =>
    selectedGames.some((gameId) => gameId !== game.gameId),
  );

  // Effect for ensuring that the controls instantly reflect that games are selected
  // when a user does a mass toggle
  useEffect(() => {
    setIsSelected(selectedGames.some((gameId) => gameId === game.gameId));
  }, [selectedGames, game]);

  const submit = useSubmit();

  const handleAddToPlaylist = (playlistId: number) => {
    const payload = JSON.stringify([game.gameId]);
    submit(payload, {
      method: "post",
      action: `/playlists/${playlistId}`,
      encType: "application/json",
    });
  };

  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border p-1">
      <Checkbox
        className="ml-2 mr-1"
        checked={isSelected}
        onCheckedChange={() => {
          handleSelectedToggled(game.gameId);
          setIsSelected(!isSelected);
        }}
      />
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          setIsPlayed(!isPlayed);
        }}
      >
        {isPlayed ? <PlayFill className="text-primary" /> : <PlayOutline />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Add />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {playlists.map((playlist, index) => {
            return (
              <DropdownMenuCheckboxItem
                key={index}
                checked={game.playlists.some((pl) => pl.playlistId === playlist.id)}
                onCheckedChange={() => handleAddToPlaylist(playlist.id)}
              >
                {playlist.name}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Game</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-destructive/80"
            onClick={() => console.log("delete pressed")}
          >
            <DeleteIcon className="mr-2 h-4 w-4" />
            <span>Delete from collection</span>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={isSelected}
            onCheckedChange={() => {
              handleSelectedToggled(game.gameId);
              setIsSelected(!isSelected);
            }}
          >
            Select game..
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isPlayed}
            onCheckedChange={() => {
              setIsPlayed(!isPlayed);
            }}
          >
            Played
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isPlayed}
            onCheckedChange={() => {
              setIsPlayed(!isPlayed);
            }}
          >
            Completed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isPlayed}
            onCheckedChange={() => {
              setIsPlayed(!isPlayed);
            }}
          >
            Starred
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
