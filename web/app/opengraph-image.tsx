import { ImageResponse } from "next/og"

export const alt = "Kori — A ponte entre capital global e economia local"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="92" height="110" viewBox="420 260 310 370">
            <path
              d="M687.256 312.792L687.761 313.037C688.903 315.6 688.347 361.277 688.339 367.642C652.186 405.264 616.554 443.385 581.454 481.992C596.939 497.772 613.443 513.652 629.23 529.243L721.187 620.099C694.536 620.373 667.338 620.067 640.644 620.039L619.604 620.015C615.524 616.35 611.238 612.134 607.351 608.236C572.133 572.923 534.645 539.223 499.818 503.592C561.731 439.438 624.213 375.836 687.256 312.792Z"
              fill="#ff6b3d"
            />
            <path
              d="M534.163 269.695C535.193 272.855 535.005 300.957 535.035 306.33C535.232 347.907 535.157 389.485 534.81 431.061C499.36 468.415 464.208 506.052 429.359 543.968C427.97 541.752 428.245 525.221 428.252 521.631L428.336 488.556L428.251 378.795C444.034 361.651 460.488 345.217 476.753 328.524L534.163 269.695Z"
              fill="#ff6b3d"
            />
          </svg>
          <span style={{ color: "#fafafa", fontSize: 60, fontWeight: 800, letterSpacing: -2 }}>
            KORI
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              color: "#fafafa",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 940,
              letterSpacing: -1.5,
            }}
          >
            A ponte entre capital global e economia local.
          </span>
          <span style={{ color: "#9a9a9e", fontSize: 30, maxWidth: 900 }}>
            Pagamentos, yield local e recebíveis tokenizados na Solana. Web3 invisível.
          </span>
        </div>

        {/* Rodapé */}
        <div style={{ display: "flex", alignItems: "center", color: "#ff6b3d", fontSize: 24, fontWeight: 600 }}>
          Built on Solana · Hackanation 2026 · Devnet
        </div>
      </div>
    ),
    { ...size },
  )
}
