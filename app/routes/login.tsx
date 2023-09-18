import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { authenticator } from "@/services/auth.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

// TODO: add labels
// TODO: add client and server side validation
export default function LoginPage() {
  return (
    <form className="flex flex-col gap-5 w-80 mx-auto mt-10" method="post">
      <Input
        className="bg-background border"
        type="email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <Input
        className="bg-background border"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Choose your password"
        required
      />
      <Button>Sign In</Button>
    </form>
  );
}
