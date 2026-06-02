export function SolanaIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 18" fill="currentColor" className="shrink-0">
      <path d="M5 2.5 L21.5 2.5 L19 5.2 L2.5 5.2 Z" />
      <path d="M2.5 7.6 L19 7.6 L21.5 10.3 L5 10.3 Z" />
      <path d="M5 12.8 L21.5 12.8 L19 15.5 L2.5 15.5 Z" />
    </svg>
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
