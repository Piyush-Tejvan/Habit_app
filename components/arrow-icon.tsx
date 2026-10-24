export function ArrowIcon({ turn = "up" }: { turn?: "up" | "down" | "back" }) {
  return (
    <svg
      className={`arrow-icon arrow-${turn}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {turn === "down" ? (
        <path d="M6 4v12h13m-5-5 5 5-5 5" />
      ) : turn === "back" ? (
        <path d="M20 12H4m6-6-6 6 6 6" />
      ) : (
        <path d="M6 18 18 6M6 6h12v12" />
      )}
    </svg>
  );
}
