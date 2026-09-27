import { useTheme } from '../hooks/useTheme'

// Both icons are always rendered and swapped with CSS, so the prerendered HTML
// is correct for either theme before JavaScript runs.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : theme === 'dark'}
      title="Toggle dark theme"
      className="grid size-11 place-items-center rounded-md border border-line bg-surface text-muted shadow-[inset_0_1px_0_var(--highlight)] transition-colors hover:text-text"
    >
      <svg viewBox="0 0 20 20" className="hidden size-[18px] dark:block" aria-hidden="true">
        <path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 20 20" className="block size-[18px] dark:hidden" aria-hidden="true">
        <circle cx="10" cy="10" r="3.6" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
        </g>
      </svg>
    </button>
  )
}
