const AppPageHeader = ({ eyebrow, title, description, actions }) => (
  <header className="border-b border-slate-200/60 pb-10 md:pb-11">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="min-w-0 max-w-3xl">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600/90">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-[1.65rem] font-semibold leading-[1.2] tracking-tight text-slate-900 sm:text-[1.75rem] md:text-[2rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-[15px] leading-7 text-slate-500 md:text-base md:leading-8">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  </header>
);

export default AppPageHeader;
