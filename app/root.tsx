import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import styles from "./tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Navbar } from "./components/navigation/Navbar";
import { Toaster } from "sonner";
import { authenticator } from "./services/auth.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request);

  return json({ session });
};

export default function App() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background p-0 text-foreground">
        <div className="relative top-16">
          <Navbar session={session} />
          <Outlet />
          <Toaster
            toastOptions={{
              className: "toast",
            }}
          />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
