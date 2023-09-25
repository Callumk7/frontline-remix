import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import { ChevronDown } from "../ui/icons/ChevronDown";

interface GameViewFilterProps {
  filterOnPlayed: boolean;
  filterOnCompleted: boolean;
  filterOnStarred: boolean;
  filterOnRated: boolean;
  filterOnUnrated: boolean;
  handleToggleFilterOnPlayed: () => void;
  handleToggleFilterOnCompleted: () => void;
  handleToggleFilterOnStarred: () => void;
  handleToggleFilterOnRated: () => void;
  handleToggleFilterOnUnrated: () => void;
}

export function GameViewFilter({
  filterOnPlayed,
  filterOnCompleted,
  filterOnStarred,
  filterOnRated,
  filterOnUnrated,
  handleToggleFilterOnPlayed,
  handleToggleFilterOnCompleted,
  handleToggleFilterOnStarred,
  handleToggleFilterOnRated,
  handleToggleFilterOnUnrated,
}: GameViewFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <span className="mr-2">Filter</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={filterOnPlayed}
          onCheckedChange={handleToggleFilterOnPlayed}
        >
          Played
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOnRated}
          onCheckedChange={handleToggleFilterOnRated}
        >
          Rated
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOnUnrated}
          onCheckedChange={handleToggleFilterOnUnrated}
        >
          Unrated
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOnCompleted}
          onCheckedChange={handleToggleFilterOnCompleted}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOnStarred}
          onCheckedChange={handleToggleFilterOnStarred}
        >
          Starred
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
