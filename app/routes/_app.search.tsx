import { auth } from "@/features/auth/helper.server";
import { saveExternalGameToDB } from "@/features/explore/queries/save-to-db";
import { getSearchResults } from "@/features/search/igdb";
import { IGDBGame, IGDBGameSchema } from "@/types/api/igdb";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { ExternalGameCardCover } from "@/components/games/ExternalGameCard";
import { ExternalGameControls } from "@/components/games/ExternalGameControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useDeferredValue, useEffect, useState } from "react";
import { Container } from "@/components/ui/layout/containers";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const payload = JSON.parse(body.get("json")!.toString());
  const session = await auth(request);

  try {
    const game = IGDBGameSchema.parse(payload);
    const savedGame = await saveExternalGameToDB(game, session.id);

    return json({ savedGame });
  } catch (err) {
    console.error("Error: Problem saving game to external database", err);

    return json("Error saving game to database..", { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // using the url to complete the query. There is a problem in that it will
  // search a blank string every time we visit this route, but that probably
  // isn't a big deal.
  const url = new URL(request.url);
  let query = url.searchParams.get("q");
  // this is just to send off a query so the page loads, I could probably handle this better
  if (!query) {
    query = "";
  }

  let results: IGDBGame[] = [];
  try {
    results = await getSearchResults(query);
  } catch (err) {
    console.error("Error: Problem getting search results", err);
    results = [];
  }
  return json({ results });
};

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

  const data = useLoaderData<typeof loader>();
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
