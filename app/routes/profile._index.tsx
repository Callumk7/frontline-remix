import { Button } from "@/components/ui/button";
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ session });
};

export default function ProfileFallback() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <div className="my-6">
      <Button asChild>
        <Link to={`/profile/${session.id}`}>Go to profile</Link>
      </Button>
    </div>
  );
}
