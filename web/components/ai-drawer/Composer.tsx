"use client"

import { forwardRef, useState } from "react"
import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ComposerProps = {
  disabled?: boolean
  onSend: (text: string) => void
}

export const Composer = forwardRef<HTMLInputElement, ComposerProps>(
  function Composer({ disabled, onSend }, ref) {
    const [value, setValue] = useState("")

    function submit() {
      const text = value.trim()
      if (!text || disabled) return
      onSend(text)
      setValue("")
    }

    return (
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Pergunte qualquer coisa sobre a Kori…"
          aria-label="Mensagem para a IA"
          autoComplete="off"
          className="h-10 flex-1 rounded-full px-4 text-sm"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensagem"
          className="size-10 shrink-0 rounded-full border-transparent bg-gradient-to-b from-[#ff7a4d] to-[#e85620] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_-5px_rgba(255,107,61,0.55)] hover:opacity-90"
        >
          <ArrowUp className="size-[18px]" />
        </Button>
      </form>
    )
  },
)
