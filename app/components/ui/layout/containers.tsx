import clsx from "clsx";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={clsx(className, "mx-auto mt-10 w-4/5")} {...props}>
      {children}
    </div>
  );
}

export function GridContainer({ children, className, ...props }: ContainerProps) {
  return (
    <div className={clsx(className, "grid grid-cols-4 gap-2")} {...props}>
      {children}
    </div>
  );
}
