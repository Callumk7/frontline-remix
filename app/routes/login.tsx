import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { authenticator } from "@/services/auth.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

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
    <form className="mx-auto mt-10 flex w-80 flex-col gap-5" method="post">
      <Input
        className="border bg-background"
        type="email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <Input
        className="border bg-background"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Choose your password"
        required
      />
      <Button>Sign In</Button>
      <Button asChild variant={"outline"}>
        <Link to="/sign-up">Need an account?</Link>
      </Button>
    </form>
  );
}
