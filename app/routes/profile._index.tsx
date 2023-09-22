import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authenticator } from "@/services/auth.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ session });
};

export default function EditProfilePage() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <div className="mt-10">
      <h1 className="pb-3 text-xl font-semibold text-foreground">Profile Information</h1>
      <Separator />
      <p className="pt-2 text-sm text-foreground/70">
        Here you can update your details like your username, name, or password
      </p>
      <form>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="username">username</Label>
            <Input type="text" id="username" placeholder={session.username} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">email</Label>
            <Input type="email" id="email" placeholder={session.email} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">name</Label>
            <Input type="text" id="name" placeholder={session.name} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="password">password</Label>
            <Input type="password" id="password" placeholder="Update password" />
          </div>
        </div>
        <div className="py-6">
          <Button>Update Profile</Button>
        </div>
      </form>
    </div>
  );
}
