import type { ComponentProps, ReactNode } from "react"
import { Download } from "lucide-react"

import { cn } from "@/lib/utils"

type GlossyOrangeButtonProps = ComponentProps<"a"> & {
  children: ReactNode
  icon?: ReactNode
  size?: "sm" | "md" | "lg"
  full?: boolean
}

export function GlossyOrangeButton({
  children,
  icon,
  size = "md",
  full = false,
  className,
  ...props
}: GlossyOrangeButtonProps) {
  return (
    <a
      className={cn(
        "glossy-orange-btn",
        size !== "md" && `glossy-orange-btn--${size}`,
        full && "glossy-orange-btn--full",
        className,
      )}
      {...props}
    >
      <span className="glossy-orange-btn__icon" aria-hidden="true">
        {icon ?? <Download />}
      </span>
      <span>{children}</span>
    </a>
  )
}
