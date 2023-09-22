import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ExploreSection({
  title,
  subtitle,
  children,
  link,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  link?: React.JSX.Element;
}) {
  return (
    <div className="mx-auto w-3/5">
      <div className="flex flex-row place-items-center justify-between">
        <h1 className="pb-3 font-cabin text-6xl font-bold">{title}</h1>
        {link}
      </div>
      <Separator />
      {subtitle && (
        <h1 className="pt-1 text-sm font-light text-foreground-muted">{subtitle}</h1>
      )}
      {children}
    </div>
  );
}

export const TopRatedLink = () => {
  return (
    <Button size={"bubble"} variant={"outline"}>
      See More
    </Button>
  );
};
