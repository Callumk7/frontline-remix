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

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-5" method="post">
      <input
        className="bg-background border"
        type="email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <input
        className="bg-background border"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Choose your password"
        required
      />
      <button className="bg-primary text-primary-foreground">Sign In</button>
    </form>
  );
}
