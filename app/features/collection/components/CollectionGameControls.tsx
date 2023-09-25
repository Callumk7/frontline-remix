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
import { useFetcher, useSubmit } from "@remix-run/react";
import { PlaylistWithGames } from "@/features/playlists/queries/get-playlists";
import { GameFromCollection } from "../queries/get-collection";

interface CollectionEntryControlsProps {
  game: GameFromCollection;
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
  const [isCompleted, setIsCompleted] = useState<boolean>(game.users[0].completed);
  const [isStarred, setIsStarred] = useState<boolean>(game.users[0].starred);
  const [isSelected, setIsSelected] = useState<boolean>(() =>
    selectedGames.some((gameId) => gameId !== game.gameId),
  );

  // Effect for ensuring that the controls instantly reflect that games are selected
  // when a user does a mass toggle
  useEffect(() => {
    setIsSelected(selectedGames.some((gameId) => gameId === game.gameId));
  }, [selectedGames, game]);

  const submit = useSubmit();
  const fetcher = useFetcher();

  // FIX: Handle invalidating the cache
  const handleAddToPlaylist = (playlistId: number) => {
    const payload = JSON.stringify([game.gameId]);
    submit(payload, {
      method: "post",
      action: `/playlists/${playlistId}`,
      encType: "application/json",
    });
  };

  const handleTogglePlayed = () => {
    fetcher.submit(
      {
        played: !isPlayed,
      },
      {
        method: "patch",
        action: `/collection/${game.gameId}`,
      },
    );

    setIsPlayed(!isPlayed);
  };

  const handleToggleCompleted = () => {
    fetcher.submit(
      {
        completed: !isCompleted,
      },
      {
        method: "patch",
        action: `/collection/${game.gameId}`,
      },
    );

    setIsCompleted(!isCompleted);
  };

  const handleToggleStarred = () => {
    fetcher.submit(
      {
        starred: !isStarred,
      },
      {
        method: "patch",
        action: `/collection/${game.gameId}`,
      },
    );

    setIsStarred(!isStarred);
  };

  return (
    <div className="flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1">
      <Checkbox
        className="ml-2 mr-1"
        checked={isSelected}
        onCheckedChange={() => {
          handleSelectedToggled(game.gameId);
          setIsSelected(!isSelected);
        }}
      />
      <Button variant={"ghost"} size={"icon"} onClick={handleTogglePlayed}>
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
            onCheckedChange={handleTogglePlayed}
          >
            Played
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isCompleted}
            onCheckedChange={handleToggleCompleted}
          >
            Completed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isStarred}
            onCheckedChange={handleToggleStarred}
          >
            Starred
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
