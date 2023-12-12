import { auth } from "@/features/auth/helper.server";
import { saveExternalGameToDB } from "@/features/explore/queries/save-to-db";
import { getSearchResults } from "@/features/search/igdb";
import { IGDBGame, IGDBGameSchema } from "@/types/api/igdb";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

export const searchAction = async ({ request }: ActionFunctionArgs) => {
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

export const searchLoader = async ({ request }: LoaderFunctionArgs) => {
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
