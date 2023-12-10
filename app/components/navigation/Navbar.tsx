import { Link, NavLink } from "@remix-run/react";
import { Button } from "../ui/button";
import { UserData } from "@/services/auth.server";
import { ProfileLink } from "./ProfileLink";

const links = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/explore",
    name: "Explore",
  },
  {
    to: "/search",
    name: "Search",
  },
  {
    to: "/collection",
    name: "Collection",
  },
  {
    to: "/playlists",
    name: "Playlists",
  },
  {
    to: "/popular",
    name: "Popular",
  },
];

interface NavbarProps {
  session: UserData | null;
}

export function Navbar({ session }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 flex w-full flex-row items-center justify-between border bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex flex-row justify-start gap-4">
        {links.map((link) => (
          <NavLink key={link.name} to={link.to}>
            {({ isActive, isPending }) => (
              <Button variant={isActive ? "default" : "ghost"}>
                {isPending ? "loading" : link.name}
              </Button>
            )}
          </NavLink>
        ))}
      </div>
      {session ? (
        <form method="post" action="/logout" className="flex flex-row items-center gap-4">
          <ProfileLink userId={session.id} username={session.username} />
          <Button variant={"secondary"}>Logout</Button>
        </form>
      ) : (
        <NavLink to="/login">
          {({ isActive, isPending }) => (
            <Button variant={isActive ? "default" : "ghost"}>
              {isPending ? "loading" : "Login"}
            </Button>
          )}
        </NavLink>
      )}
    </nav>
  );
}
