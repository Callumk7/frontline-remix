export const Tick = ({ className }: { className?: string }) => {
  return (
    <svg
      width="15"
      height="15"
      className={className}
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        d="m1 7l4.5 4.5L14 3"
      />
    </svg>
  );
};
