import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (session.id === params.userId) {
    console.log("redirect");
    return redirect("/profile");
  }

  const userData = await db.user.findFirst({
    where: {
      id: params.userId,
    },
  });

  return json({ session, userData });
};

export default function ProfilePage() {
  const { session, userData } = useLoaderData<typeof loader>();
  return (
    <div className="mt-10">
      <h1>{userData?.username}</h1>
    </div>
  );
}
