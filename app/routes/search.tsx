import { ExternalGameCardCover } from "@/components/games/ExternalGameCard";
import { ExternalGameControls } from "@/components/games/ExternalGameControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { auth } from "@/features/auth/helper.server";
import { saveExternalGameToDB } from "@/features/explore/queries/save-to-db";
import { IGDBGameSchema, getSearchResults } from "@/features/search/igdb";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

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
  const url = new URL(request.url);
  let query = url.searchParams.get("q");
  if (!query) {
    query = "";
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
