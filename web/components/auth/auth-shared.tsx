import { Wallet } from "lucide-react"

import { cn } from "@/lib/utils"

export function SolanaIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 18" fill="currentColor" className="shrink-0">
      <path d="M5 2.5 L21.5 2.5 L19 5.2 L2.5 5.2 Z" />
      <path d="M2.5 7.6 L19 7.6 L21.5 10.3 L5 10.3 Z" />
      <path d="M5 12.8 L21.5 12.8 L19 15.5 L2.5 15.5 Z" />
    </svg>
  )
}

export function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" className="shrink-0">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0012 22z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 010-3.8V7.5H3.1a10 10 0 000 9l3.3-2.6z" fill="#FBBC05" />
      <path d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 003.1 7.5l3.3 2.6C7.2 7.7 9.4 6.1 12 6.1z" fill="#EA4335" />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z" />
    </svg>
  )
}

export function ProviderButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-ds-line bg-ds-bg-1 px-4 py-3 text-[13px] font-medium text-ds-ink transition-colors hover:border-ds-line-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AuthProviders() {
  return (
    <div className="flex flex-col gap-[9px]">
      <ProviderButton className="border-ds-sol/25 bg-gradient-to-b from-ds-sol/12 to-ds-sol/4">
        <Wallet className="size-[18px] text-ds-sol" />
        <span>Conectar carteira Solana</span>
        <span className="ml-auto rounded-full bg-ds-sol/12 px-[7px] py-[3px] font-mono text-[8px] text-ds-sol">
          WEB3
        </span>
      </ProviderButton>
      <ProviderButton>
        <GoogleIcon />
        Continuar com Google
      </ProviderButton>
      <ProviderButton>
        <GitHubIcon />
        Continuar com GitHub
      </ProviderButton>
    </div>
  )
}

export function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-ds-bg">
      {/* Foto só no tema escuro; no claro fica um wash suave */}
      <img
        src="/login-bg.png"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity dark:opacity-100"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_25%,rgba(255,107,61,0.10),transparent_60%)] dark:bg-gradient-to-b dark:from-[#060607]/45 dark:to-[#060607]/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_78%_at_50%_45%,transparent_50%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(ellipse_78%_78%_at_50%_45%,transparent_32%,rgba(0,0,0,0.62)_100%)]" />
    </div>
  )
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full max-w-[410px] rounded-[22px] border border-ds-line-2 bg-ds-elev/90 px-[34px] py-[38px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.22)] backdrop-blur-[20px] dark:bg-gradient-to-b dark:from-[rgba(28,28,33,0.92)] dark:to-[rgba(18,18,22,0.92)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-24px_rgba(0,0,0,0.85)]">
      {children}
    </div>
  )
}

export function AuthBrand() {
  return (
    <div className="mb-[26px] flex items-center justify-center gap-2.5">
      <svg width={24} height={29} className="text-ds-ink"><use href="#kori-k" /></svg>
      <span className="pl-[0.28em] text-[19px] font-bold uppercase tracking-[0.28em]">KORI</span>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-[22px] flex items-center gap-3.5">
      <span className="h-px flex-1 bg-ds-line" />
      <span className="font-mono text-[10px] tracking-[0.1em] text-ds-mute">OU</span>
      <span className="h-px flex-1 bg-ds-line" />
    </div>
  )
}

export function AuthFooter() {
  return (
    <div className="mt-6 text-center">
      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-ds-mute">
        powered by <SolanaIcon size={12} /> Solana
      </span>
      <div className="mt-3 text-[10px] leading-relaxed text-ds-faint">
        Ao continuar, você concorda com os{" "}
        <a href="#" className="text-ds-mute no-underline">Termos</a> e a{" "}
        <a href="#" className="text-ds-mute no-underline">Privacidade</a>.
      </div>
    </div>
  )
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em] text-ds-mute">
      {children}
    </label>
  )
}
