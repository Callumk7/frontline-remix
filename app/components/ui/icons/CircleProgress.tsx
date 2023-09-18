export const CircleProgress = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M12 21.997c-5.523 0-10-4.478-10-10c0-5.523 4.477-10 10-10s10 4.477 10 10c0 5.522-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm0-2v-12a6 6 0 0 1 0 12Z"
      />
    </svg>
  );
};
