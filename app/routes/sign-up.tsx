import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { createNewUser } from "@/services/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { redirect } from "remix-typedjson";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const username = body.get("username") as string;
  const email = body.get("email") as string;
  const password = body.get("password") as string;

  const newUser = await createNewUser(username, email, password);
  console.log(newUser?.username);
  return redirect("/login");
};

export default function SignUpPage() {
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
        type="text"
        name="username"
        placeholder="Enter your user name"
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
      <Button>Create Account</Button>
      <Button asChild variant={"outline"}>
        <Link to="/login">Already have an account?</Link>
      </Button>
    </form>
  );
}
