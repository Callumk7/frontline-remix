import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useEffect, useRef, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Rating } from "@/components/ui/icons/Rating";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CollectionEntryControlsProps {
  userId: string;
  game: GameFromCollection;
  playlists: PlaylistWithGames[];
  selectedGames: number[];
  handleSelectedToggled: (gameId: number) => void;
}

export function CollectionEntryControls({
  userId,
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

  // useState to track the input on the player rating slider, and the timerRef to setup
  // a delay, so that we can minimise the number of requests we make to the db with mutations
  const [rating, setRating] = useState<number>(
    game.users[0].playerRating ? game.users[0].playerRating : 0,
  );
  const timerRef = useRef<number | null>(null);

  // See note above, timer for the rating slider
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleRatingChange = (v: number[]) => {
    const newRating = v[0];
    setRating(newRating);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      fetcher.submit(
        { rating: rating },
        { method: "patch", action: `/collection/${game.gameId}` },
      );
    }, 1000);
  };

  // Effect for ensuring that the controls instantly reflect that games are selected
  // when a user does a mass toggle
  useEffect(() => {
    setIsSelected(selectedGames.some((gameId) => gameId === game.gameId));
  }, [selectedGames, game]);

  // Remix hooks for submitting forms
  const submit = useSubmit();
  const fetcher = useFetcher();

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

  const handleDelete = () => {
    fetcher.submit(
      {
        userId: userId,
      },
      {
        method: "delete",
        action: `/collection/${game.gameId}`,
      },
    );
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

      <AddToPlaylistDropdown
        playlists={playlists}
        game={game}
        handleAddToPlaylist={handleAddToPlaylist}
      />

      <CollectionDropdownMenu
        gameId={game.gameId}
        userId={userId}
        isPlayed={isPlayed}
        isCompleted={isCompleted}
        isStarred={isStarred}
        handleToggleStarred={handleToggleStarred}
        handleTogglePlayed={handleTogglePlayed}
        handleToggleCompleted={handleToggleCompleted}
        handleDelete={handleDelete}
      />

      <Popover>
        <PopoverTrigger>
          <Rating />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rating">Your Rating</Label>
            <Slider id="rating" value={[rating]} onValueChange={handleRatingChange} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface AddToPlaylistDropdownProps {
  playlists: PlaylistWithGames[];
  game: GameFromCollection;
  handleAddToPlaylist: (PlaylistId: number) => void;
}

function AddToPlaylistDropdown({
  playlists,
  game,
  handleAddToPlaylist,
}: AddToPlaylistDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Add />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
  );
}

interface CollectionDropdownMenuProps {
  gameId: number;
  userId: string;
  isPlayed: boolean;
  handleTogglePlayed: () => void;
  isCompleted: boolean;
  handleToggleCompleted: () => void;
  isStarred: boolean;
  handleToggleStarred: () => void;
  handleDelete: () => void;
}

function CollectionDropdownMenu({
  isPlayed,
  handleTogglePlayed,
  isCompleted,
  handleToggleCompleted,
  isStarred,
  handleToggleStarred,
  handleDelete
}: CollectionDropdownMenuProps) {

  return (
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
          onClick={handleDelete}
        >
          <DeleteIcon className="mr-2 h-4 w-4" />
          <span>Delete from collection</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Game Status</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={isPlayed} onCheckedChange={handleTogglePlayed}>
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
  );
}
