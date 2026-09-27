export function SectionHeading({ id, title, children }) {
  return (
    <div className="max-w-[48rem] pt-24 sm:pt-32">
      <h2
        id={id}
        className="display text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[-0.045em]"
      >
        {title}
      </h2>
      {children && <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-muted">{children}</p>}
    </div>
  )
}
