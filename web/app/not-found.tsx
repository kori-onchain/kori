import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-7 bg-ds-bg px-6 text-center">
      <svg className="h-14 w-12 text-ds-orange" viewBox="420 260 310 370" aria-hidden="true">
        <use href="#kori-k" />
      </svg>

      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-xs tracking-[0.3em] text-ds-orange">
          ERRO 404
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-ds-ink">
          Página não encontrada
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ds-dim">
          A página que você procura não existe, foi movida ou o link está
          incorreto.
        </p>
      </div>

      <Link
        href="/"
        className="rounded-xl bg-ds-orange px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        Voltar para a Home
      </Link>
    </main>
  )
}
