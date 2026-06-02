type DrawerTriggerProps = {
  label: string
  expanded: boolean
  onClick: () => void
}

export function DrawerTrigger({ label, expanded, onClick }: DrawerTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-label={label}
      className="inline-flex items-center gap-2.5 rounded-full border border-ds-line-2 bg-ds-bg-2 py-2 pr-4 pl-2 text-sm font-medium text-ds-ink shadow-lg shadow-black/40 transition-colors hover:bg-ds-elev"
    >
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-b from-[#ff7a4d] to-[#e85620] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
        <svg className="h-[15px] w-[13px] text-white">
          <use href="#kori-k" />
        </svg>
      </span>
      {label}
    </button>
  )
}
