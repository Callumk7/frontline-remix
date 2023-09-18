import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { ChevronDown } from "@/components/ui/icons/ChevronDown";
import { SortOption } from "@/features/collection/hooks/sorting";

const sortOptions: { value: SortOption; name: string }[] = [
  {
    value: "nameAsc",
    name: "Name Ascending",
  },
  {
    value: "nameDesc",
    name: "Name Descending",
  },
  {
    value: "rating",
    name: "Rating",
  },
  {
    value: "releaseDateAsc",
    name: "Release Date Ascending",
  },
  {
    value: "releaseDateDesc",
    name: "Release Date Descending",
  },
];

interface GameSortProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export function GameViewSort({ sortOption, setSortOption }: GameSortProps) {
  // content
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <span className="mr-2">Sort by</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={sortOption}>
          {sortOptions.map((option, index) => (
            <DropdownMenuRadioItem
              key={index}
              value={option.value}
              onSelect={() => setSortOption(option.value)}
            >
              {option.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
