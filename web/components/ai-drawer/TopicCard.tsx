import { ChevronRight } from "lucide-react"

import type { Topic } from "./types"

type TopicCardProps = {
  topic: Topic
  onSelect: (topic: Topic) => void
}

export function TopicCard({ topic, onSelect }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      className="group flex w-full items-center gap-3 rounded-xl border border-ds-line bg-ds-bg-1 px-3.5 py-3 text-left transition-colors hover:border-ds-line-2 hover:bg-ds-elev"
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-ds-line bg-ds-bg-2 text-ds-dim transition-colors group-hover:text-ds-ink">
        {topic.icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] font-medium text-ds-ink">
          {topic.title}
        </span>
        <span className="truncate text-xs text-ds-dim">{topic.subtitle}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-ds-mute transition-colors group-hover:text-ds-ink" />
    </button>
  )
}
