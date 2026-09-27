// The same mark is used for the favicon (public/favicon.svg).
export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" className="fill-surface stroke-line" strokeWidth="1" />
      <path
        d="M7.5 10.5 11 22l5-8.5 5 8.5 3.5-11.5"
        fill="none"
        className="stroke-accent"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
