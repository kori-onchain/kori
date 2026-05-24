import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Copy,
  CreditCard,
  EyeOff,
  Home,
  Landmark,
  LineChart,
  QrCode,
  Search,
  Send,
  Shield,
  Sparkles,
  WalletCards,
} from "lucide-react"

import styles from "./dashboard-shell.module.css"

const transactions = [
  {
    name: "Lucas Silva",
    detail: "@lucas_s",
    amount: "+ R$ 78,43",
    type: "Entrada",
    inflow: true,
  },
  {
    name: "Cartao virtual",
    detail: "Supermercado Kora",
    amount: "- R$ 152,40",
    type: "Cartao",
    inflow: false,
  },
  {
    name: "Wallet anonima",
    detail: "0x7a2d...3b9e",
    amount: "+ R$ 4.500,00",
    type: "Solana",
    inflow: true,
    anonymous: true,
  },
  {
    name: "CDB Kora",
    detail: "Resgate liquidez diaria",
    amount: "+ R$ 3.000,00",
    type: "Invest",
    inflow: true,
  },
]

const contacts = ["LS", "MO", "RR", "JV", "AN"]

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`${styles.softCard} ${className}`}>{children}</div>
}

export function DashboardShell() {
  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>K</div>
          <span>Kora</span>
        </div>

        <nav className={styles.nav}>
          <a className={styles.navItemActive} href="#">
            <Home size={18} />
            Inicio
          </a>
          <a className={styles.navItem} href="#">
            <CreditCard size={18} />
            Cartao
          </a>
          <a className={styles.navItem} href="#">
            <LineChart size={18} />
            Invest
          </a>
          <a className={styles.navItem} href="#">
            <Compass size={18} />
            Experiencias
          </a>
        </nav>

        <SoftCard className={styles.scanCard}>
          <QrCode size={22} />
          <div>
            <strong>Escanear</strong>
            <span>QR, link ou carteira</span>
          </div>
        </SoftCard>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.search}>
            <Search size={17} />
            <span>Buscar transacoes, contatos ou carteiras</span>
          </div>

          <div className={styles.topActions}>
            <button className={styles.iconButton} aria-label="Notificacoes">
              <Bell size={18} />
            </button>
            <button className={styles.accountSwitch}>
              <span className={styles.accountAvatar}>PH</span>
              <span>Pedro Store</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.mainColumn}>
            <SoftCard className={styles.balanceHero}>
              <div className={styles.balanceTop}>
                <div>
                  <p className={styles.kicker}>TOTAL BALANCE</p>
                  <div className={styles.balanceValue}>
                    R$ 29.845<span>,20</span>
                  </div>
                </div>
                <div className={styles.identityPill}>
                  <WalletCards size={15} />
                  7nxB...4X1a
                  <Copy size={13} />
                </div>
              </div>

              <div className={styles.heroActions}>
                <button className={styles.primaryButton}>
                  <Send size={16} />
                  Enviar
                </button>
                <button className={styles.softButton}>
                  <ArrowDownLeft size={16} />
                  Receber
                </button>
                <button className={styles.softButton}>
                  <QrCode size={16} />
                  Escanear
                </button>
              </div>

              <div className={styles.stats}>
                <div>
                  <span>APY MEDIO</span>
                  <strong>13,8%</strong>
                </div>
                <div>
                  <span>NIVEL</span>
                  <strong>Founder</strong>
                </div>
                <div>
                  <span>WEB3</span>
                  <strong>Ativo</strong>
                </div>
              </div>
            </SoftCard>

            <div className={styles.cardsRow}>
              <SoftCard className={styles.virtualCard}>
                <div className={styles.cardHeader}>
                  <Shield size={16} />
                  <span>KORA VIRTUAL</span>
                </div>
                <div className={styles.cardNumber}>5421 9843 7261 8294</div>
                <div className={styles.cardFooter}>
                  <span>PEDRO HENRIQUE</span>
                  <span>08/29</span>
                </div>
              </SoftCard>

              <SoftCard className={styles.yieldCard}>
                <p className={styles.kicker}>INVESTIMENTOS</p>
                <div className={styles.yieldValue}>R$ 8.240,10</div>
                <div className={styles.chart}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </SoftCard>
            </div>

            <SoftCard className={styles.transactions}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.kicker}>MOVIMENTACAO</p>
                  <h2>Transacoes recentes</h2>
                </div>
                <button className={styles.textButton}>
                  Ver tudo <ArrowUpRight size={14} />
                </button>
              </div>

              <div className={styles.transactionList}>
                {transactions.map((item) => (
                  <div className={styles.transactionRow} key={item.name}>
                    <div className={styles.transactionIcon}>
                      {item.anonymous ? <EyeOff size={16} /> : item.name.slice(0, 2)}
                    </div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <div className={styles.transactionMeta}>
                      <strong className={item.inflow ? styles.inflow : undefined}>
                        {item.amount}
                      </strong>
                      <span>{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SoftCard>
          </section>

          <aside className={styles.sideColumn}>
            <SoftCard className={styles.contactsCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.kicker}>CONTATOS</p>
                  <h2>Recentes</h2>
                </div>
                <button className={styles.iconButtonSmall}>
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className={styles.contacts}>
                {contacts.map((contact) => (
                  <button className={styles.contact} key={contact}>
                    {contact}
                  </button>
                ))}
              </div>
            </SoftCard>

            <SoftCard className={styles.securityCard}>
              <div className={styles.securityIcon}>
                <BadgeCheck size={22} />
              </div>
              <h2>Carteira protegida</h2>
              <p>PIN, biometria e identidade Solana ativos nesta sessao.</p>
              <div className={styles.securityRows}>
                <span>
                  <Shield size={14} />
                  Biometria
                </span>
                <strong>Live</strong>
              </div>
              <div className={styles.securityRows}>
                <span>
                  <Landmark size={14} />
                  Conta PJ
                </span>
                <strong>Ativa</strong>
              </div>
            </SoftCard>

            <SoftCard className={styles.rewardCard}>
              <Sparkles size={19} />
              <div>
                <p className={styles.kicker}>RECOMPENSA</p>
                <strong>+240 XP</strong>
                <span>Complete uma transferencia hoje.</span>
              </div>
            </SoftCard>

            <SoftCard className={styles.limitsCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.kicker}>LIMITE MENSAL</p>
                  <h2>Cartao</h2>
                </div>
                <CircleDollarSign size={18} />
              </div>
              <div className={styles.progressTrack}>
                <span />
              </div>
              <p>R$ 1.842 usados de R$ 5.000</p>
            </SoftCard>
          </aside>
        </div>
      </section>
    </main>
  )
}
