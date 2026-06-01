"use client"

export interface DemoNavItem {
  tab: string
  icon: string
  label: string
}

export function DemoNav({
  items,
  active,
  onSelect,
}: {
  items: DemoNavItem[]
  active: string
  onSelect: (tab: string) => void
}) {
  return (
    <div className="bnav">
      {items.map((i) => (
        <button
          key={i.tab}
          type="button"
          className={`nav${active === i.tab ? " act" : ""}`}
          onClick={() => onSelect(i.tab)}
          aria-pressed={active === i.tab}
        >
          <svg>
            <use href={`#${i.icon}`} />
          </svg>
          <span className="l">{i.label}</span>
        </button>
      ))}
    </div>
  )
}
