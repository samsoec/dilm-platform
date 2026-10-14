export function Mark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      className="dil-mark"
      height={size}
      viewBox="0 0 16 16"
      width={size}
    >
      <rect
        fill="currentColor"
        height="9"
        rx="1.5"
        transform="rotate(45 8 8)"
        width="9"
        x="3.5"
        y="3.5"
      />
    </svg>
  );
}
