// FollowLens mark: a camera lens whose aperture frames an eye (the "lens" that
// watches who follows). Uses currentColor for the ring and the accent token
// for the iris, so it adapts to light/dark and to the brand color.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="FollowLens"
      className={className}
    >
      {/* lens ring */}
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" />
      {/* aperture blades hint */}
      <path
        d="M16 4.5 A11.5 11.5 0 0 1 26.9 12.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* iris */}
      <circle cx="16" cy="16" r="6.2" fill="var(--accent)" />
      {/* catch-light / pupil highlight */}
      <circle cx="13.7" cy="13.7" r="1.9" fill="#fff" opacity="0.9" />
    </svg>
  );
}
