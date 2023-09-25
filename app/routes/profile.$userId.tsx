import { authenticator } from "@/services/auth.server";
import { db } from "@/util/db/db.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
  const {  userData } = useLoaderData<typeof loader>();
  return (
    <div className="mt-10">
      <h1>{userData?.username}</h1>
    </div>
  );
}
