import { Separator } from "@/components/ui/separator";
import { Outlet } from "@remix-run/react";

export default function ProfileLayout() {
  return (
    <div className="mx-auto my-10 w-3/4">
      <Outlet />
    </div>
  );
}
