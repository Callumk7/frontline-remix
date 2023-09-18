import { Link, NavLink } from "@remix-run/react";
import { Button } from "../ui/button";

const links = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/login",
    name: "Login",
  },
  {
    to: "/explore",
    name: "Explore",
  },
  {
    to: "/collection",
    name: "Collection",
  },
  {
    to: "/playlists",
    name: "Playlists",
  },
];

interface NavbarProps {
  username: string;
}

export function Navbar({ username }: NavbarProps) {
  return (
    <nav className="flex flex-row px-6 py-4 justify-between items-center border w-full">
      <div className="flex flex-row justify-start gap-4">
        {links.map((link) => (
          <NavLink to={link.to}>
            {({ isActive, isPending }) => (
              <Button variant={isActive ? "default" : "ghost"}>
                {isPending ? "loading" : link.name}
              </Button>
            )}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-row items-center gap-4">
        <p>username</p>
        <form method="post" action="/logout">
          <Button variant={"secondary"}>Logout</Button>
        </form>
      </div>
    </nav>
  );
}
