import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";

interface UserLinkProps {
  username: string;
  userId: string;
}

export function UserLink({ username, userId }: UserLinkProps) {
  return (
    <Button asChild size={"link"} variant={"link"}>
      <Link to={`/profile/${userId}`}>{username}</Link>
    </Button>
  );
}
