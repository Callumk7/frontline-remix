import { Separator } from "@/components/ui/separator";
import { Outlet } from "@remix-run/react";

export default function ProfileLayout() {
  return (
    <div className="mx-auto my-10 w-3/4">
      <h1 className="pb-3 text-xl font-semibold text-foreground">Profile Information</h1>
      <Separator />
      <p className="pt-2 text-sm text-foreground/70">
        Here you can update your details like your username, name, or password
      </p>
      <Outlet />
    </div>
  );
}
