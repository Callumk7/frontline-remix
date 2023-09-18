import clsx from "clsx";
import { InputHTMLAttributes } from "react";

const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="text"
      className={clsx(
        className,
        "rounded-md border bg-inherit px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      {...props}
    />
  );
};

export { Input };
