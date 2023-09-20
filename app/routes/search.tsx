import { ExternalGameCardCover } from "@/components/games/ExternalGameCard";
import { ExternalGameControls } from "@/components/games/ExternalGameControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { getSearchResults } from "@/features/search/igdb";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.json();
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  let query = url.searchParams.get("q");
  if (!query) {
    query = "slay the spire";
  }
  const results = await getSearchResults(query);
  return json({ results });
};

export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="relative top-16 mt-10 px-10">
      <form className="mx-auto mb-6 flex w-96 flex-row gap-2" method="get">
        <Input type="text" name="q" placeholder="Search for games" />
        <Button>search</Button>
      </form>
      <Outlet />
      <div className="mx-auto grid w-4/5 grid-cols-2 gap-4 md:w-full md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {data.results.map((result) => (
          <ExternalGameCardCover key={result.id} game={result} isSelected={false}>
            <ExternalGameControls game={result} />
          </ExternalGameCardCover>
        ))}
      </div>
    </div>
  );
}
