import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

interface ProfileLinkProps {
  userId: string,
  username: string,
}

export function ProfileLink({userId, username}: ProfileLinkProps) {
  return (
    <Button variant={"link"} size={"link"}>
      <Link to={`/profile/${userId}`}>{username}</Link>
    </Button>
  );
}
