import { createNewUser } from "@/services/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const username = body.get("username") as string;
  const email = body.get("email") as string;
  const password = body.get("password") as string;

  const newUser = await createNewUser(username, email, password);
  console.log(newUser?.username);
  return null;
};

export default function SignUpPage() {
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
        type="text"
        name="username"
        placeholder="Enter your user name"
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
      <button className="bg-primary text-primary-foreground">Create Account</button>
    </form>
  );
}
