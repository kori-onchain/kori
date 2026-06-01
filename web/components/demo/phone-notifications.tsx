"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ToastTone = "in" | "warn" | "neutral"

export interface Toast {
  id: number
  title: string
  body: string
  icon?: string
  tone?: ToastTone
}

export type PushToast = (toast: Omit<Toast, "id">) => void

/**
 * Fila de notificações por celular. Cada push agenda um auto-dismiss e
 * limpa seus timers no unmount (evita leaks em navegação / StrictMode).
 */
export function usePhoneNotifications(max = 3, dismissMs = 4200) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const idRef = useRef(0)

  const push = useCallback<PushToast>(
    (toast) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev.slice(-(max - 1)), { ...toast, id }])
      const handle = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        timers.current.delete(handle)
      }, dismissMs)
      timers.current.add(handle)
    },
    [max, dismissMs],
  )

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  return { toasts, push }
}

export function NotificationLayer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-layer" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.icon ? (
            <div className={`toast-ic${t.tone ? ` ${t.tone}` : ""}`}>
              <svg>
                <use href={`#${t.icon}`} />
              </svg>
            </div>
          ) : null}
          <div className="toast-txt">
            <div className="t">{t.title}</div>
            <div className="b">{t.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
