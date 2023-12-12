import { ExternalGameCardCover } from "@/components/games/ExternalGameCard";
import { ExternalGameControls } from "@/components/games/ExternalGameControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useDeferredValue, useEffect, useState } from "react";
import { searchLoader, searchAction } from "./handlers";
import { Container } from "@/components/ui/layout/containers";

export { searchLoader as loader, searchAction as action };

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    return searchParams.get("q") || "";
  });

  // Should really understand how this works..
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    setSearchParams({ q: deferredValue });
  }, [deferredValue, setSearchParams]);

  const data = useLoaderData<typeof searchLoader>();
  return (
    <Container>
      <form
        className="mx-auto mb-6 flex w-96 flex-row gap-2"
        method="get"
      >
        <Input
          type="text"
          name="q"
          value={value}
          placeholder="Search for games"
          onChange={(e) => setValue(e.target.value)}
        />
        <Button>search</Button>
      </form>
      {data.results.length === 0 && (
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold">No results found</h2>
          <p className="text-lg">Try searching for something else</p>
        </div>
      )}
      <div className="mx-auto grid w-4/5 grid-cols-2 gap-4 md:w-full md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data.results.map((result) => (
          <ExternalGameCardCover
            key={result.id}
            game={result}
            isSelected={false}
          >
            <ExternalGameControls game={result} />
          </ExternalGameCardCover>
        ))}
      </div>
    </Container>
  );
}
