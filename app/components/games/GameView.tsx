export function GameViewCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-4/5 grid-cols-1 gap-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

export function GameViewList({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full flex-col">{children}</div>;
}
