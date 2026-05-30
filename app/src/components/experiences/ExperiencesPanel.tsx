import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReAnimated from "react-native-reanimated";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { useFadeUp } from "@hooks/useFadeUp";
import { Button } from "@components/layout/Button";
import { SoftCard } from "@components/layout/SoftCard";
import { fonts, radii } from "@theme/tokens";

/* ─── Assets ───────────────────────────────────────── */
const IMG = {
  concert:    { uri: "https://images.stockcake.com/public/3/d/1/3d182bb7-f9e3-4cd3-aae2-6c37874aef6e_large/epic-rock-concert-stockcake.jpg" },
  restaurant: { uri: "https://images.stockcake.com/public/7/e/7/7e74a438-e1a5-48ea-b3fd-3c1bf3a514dd_large/delicious-steak-on-grill-stockcake.jpg" },
  dj:         { uri: "https://images.stockcake.com/public/3/d/1/3d182bb7-f9e3-4cd3-aae2-6c37874aef6e_large/epic-rock-concert-stockcake.jpg" },
  finedining: { uri: "https://images.stockcake.com/public/3/d/1/3d182bb7-f9e3-4cd3-aae2-6c37874aef6e_large/epic-rock-concert-stockcake.jpg" },
};

/* ─── Types ────────────────────────────────────────── */
type Filter = "tudo" | "breve" | "show" | "restaurante";

interface Exp {
  id: string;
  title: string;
  subtitle: string;
  type: "show" | "restaurante";
  image: any;
  dateLabel: string;
  month: string;
  price: string;
  diaLabel: string;
  horaLabel: string;
  local: string;
  categoria: string;
  sobre: string;
  ctaLabel: string;
}

interface Ticket {
  id: string;
  exp: Exp;
  dynamicCode: string;
  qrValue: string;
  holderName: string;
}

/* ─── Dados ────────────────────────────────────────── */
const EXPERIENCES: Exp[] = [
  {
    id: "coldplay",
    title: "Coldplay World Tour",
    subtitle: "Estádio Maracanã, Rio de Janeiro",
    type: "show",
    image: IMG.concert,
    dateLabel: "9 Jan",
    month: "Jan",
    price: "R$ 490,00",
    diaLabel: "Sábado",
    horaLabel: "21h00",
    local: "Estádio Maracanã",
    categoria: "Show",
    sobre: "A icônica banda britânica retorna ao Brasil com a revolucionária turnê Music of the Spheres, com confetes biodegradáveis, pulseiras de LED e produção totalmente neutra em carbono. Uma noite inesquecível de música ao vivo sob o céu carioca.",
    ctaLabel: "Resgatar Ingresso",
  },
  {
    id: "fasano",
    title: "Fasano Al Mare",
    subtitle: "Ipanema, Rio de Janeiro",
    type: "restaurante",
    image: IMG.finedining,
    dateLabel: "22 Fev",
    month: "Fev",
    price: "Grátis",
    diaLabel: "Sábado",
    horaLabel: "20h30",
    local: "Hotel Fasano, Ipanema",
    categoria: "Alta Gastronomia",
    sobre: "Alta gastronomia italiana premiada com vista panorâmica para o mar de Ipanema. O Chef Luca Gozzani cria um menu sazonal que une tradição mediterrânea com os melhores ingredientes locais. Traje social obrigatório.",
    ctaLabel: "Reservar Mesa",
  },
  {
    id: "alok",
    title: "Alok — Sunset Sessions",
    subtitle: "Praia de Copacabana — Posto 3",
    type: "show",
    image: IMG.dj,
    dateLabel: "18 Jul",
    month: "Jul",
    price: "R$ 150,00",
    diaLabel: "Sexta-feira",
    horaLabel: "17h00",
    local: "Praia de Copacabana",
    categoria: "Festival",
    sobre: "O maior DJ do Brasil retorna às areias de Copacabana para uma apresentação histórica ao pôr do sol. Shows de laser 3D, projeção mapeada e batidas eletrônicas de tirar o fôlego.",
    ctaLabel: "Resgatar Ingresso",
  },
  {
    id: "cipriani",
    title: "Cipriani — Copa Palace",
    subtitle: "Copacabana Palace, Rio",
    type: "restaurante",
    image: IMG.restaurant,
    dateLabel: "4 Jun",
    month: "Jun",
    price: "Grátis",
    diaLabel: "Quarta-feira",
    horaLabel: "21h00",
    local: "Belmond Copacabana Palace",
    categoria: "Alta Gastronomia",
    sobre: "O lendário Cipriani, instalado no Belmond Copacabana Palace, serve refinada culinária italiana do norte em um ambiente Art Déco atemporal. Menu degustação completo com cave de vinhos excepcional.",
    ctaLabel: "Reservar Mesa",
  },
];

/* ─── Helpers ─────────────────────────────────────── */
const { width } = Dimensions.get("window");

const genCode = () => {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seg = () => `${L[Math.random()*26|0]}${L[Math.random()*26|0]}${L[Math.random()*26|0]}`;
  return `${seg()}-${seg()}`;
};

/* ══════════════════════════════════════════════════════
   TELA DE INGRESSO (detalhe)
   ══════════════════════════════════════════════════════ */
const TicketScreen: React.FC<{ ticket: Ticket; onBack: () => void }> = ({ ticket, onBack }) => {
  const { t } = useTheme();
  const { exp } = ticket;
  const [code,  setCode]  = useState(ticket.dynamicCode);
  const [qrVal, setQrVal] = useState(ticket.qrValue);
  const [secs,  setSecs]  = useState(30);
  const timerAnim = useRef(new Animated.Value(1)).current;

  const refresh = () => {
    const c = genCode();
    setCode(c);
    setQrVal(`kori://acesso?ingresso=${ticket.id}&codigo=${c}&ts=${Date.now()}`);
    setSecs(30);
    timerAnim.setValue(1);
    Animated.timing(timerAnim, { toValue: 0, duration: 30000, useNativeDriver: false }).start();
  };

  useEffect(() => {
    refresh();
    const tick   = setInterval(() => setSecs((s) => (s <= 1 ? 30 : s - 1)), 1000);
    const rotate = setInterval(refresh, 30000);
    return () => { clearInterval(tick); clearInterval(rotate); };
  }, []);

  return (
    <View style={[tks.container, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={tks.header}>
        <TouchableOpacity onPress={onBack} style={[tks.headerBtn, { backgroundColor: t.bgElev }]}>
          <Feather name="chevron-left" size={20} color={t.ink} />
        </TouchableOpacity>
        <Text style={[tks.headerTitle, { color: t.ink }]}>Ingresso</Text>
        <TouchableOpacity
          style={[tks.headerBtn, { backgroundColor: t.bgElev }]}
          onPress={() => Share.share({ message: `Meu ingresso Kori: ${exp.title} — ${exp.local}` })}
        >
          <Feather name="share-2" size={16} color={t.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Card de ingresso físico */}
        <View style={[tks.card, { backgroundColor: t.bg2, borderColor: t.line }]}>

          {/* Topo: imagem hero */}
          <Image source={exp.image} style={tks.heroImg} resizeMode="cover" />

          {/* Linha pontilhada com entalhes */}
          <View style={tks.notchRow}>
            <View style={[tks.notchL, { backgroundColor: t.bg }]} />
            <View style={[tks.dashed, { borderColor: t.line }]} />
            <View style={[tks.notchR, { backgroundColor: t.bg }]} />
          </View>

          {/* Infos do ingresso */}
          <View style={tks.infoSection}>
            <Text style={[tks.dataHora, { color: t.inkMute }]}>
              {exp.dateLabel} às {exp.horaLabel}
            </Text>
            <Text style={[tks.titulo, { color: t.ink }]}>{exp.title}</Text>
            <Text style={[tks.subtitulo, { color: t.inkDim }]}>{exp.local}</Text>

            {/* Grid: Data / Horário / Local / Categoria */}
            <View style={tks.grid}>
              <View style={tks.gridCell}>
                <Text style={[tks.gridLabel, { color: t.inkMute }]}>Data</Text>
                <Text style={[tks.gridVal,   { color: t.ink }]}>{exp.dateLabel}, 2026</Text>
              </View>
              <View style={[tks.gridCell, tks.gridRight]}>
                <Text style={[tks.gridLabel, { color: t.inkMute }]}>Horário</Text>
                <Text style={[tks.gridVal,   { color: t.ink }]}>{exp.horaLabel}</Text>
              </View>
              <View style={[tks.gridCell, { marginTop: 14 }]}>
                <Text style={[tks.gridLabel, { color: t.inkMute }]}>Local</Text>
                <Text style={[tks.gridVal,   { color: t.ink }]}>{exp.local}</Text>
              </View>
              <View style={[tks.gridCell, tks.gridRight, { marginTop: 14 }]}>
                <Text style={[tks.gridLabel, { color: t.inkMute }]}>Categoria</Text>
                <Text style={[tks.gridVal,   { color: t.ink }]}>{exp.categoria}</Text>
              </View>
            </View>
          </View>

          {/* Linha separadora */}
          <View style={[tks.divLine, { backgroundColor: t.line }]} />

          {/* Área do QR Code dinâmico */}
          <View style={tks.qrSection}>
            <Text style={[tks.qrLabel, { color: t.inkMute }]}>Código de Acesso</Text>

            <View style={tks.qrBox}>
              <QRCode value={qrVal} size={180} color="#000000" backgroundColor="#ffffff" />
            </View>

            <Text style={[tks.holderName, { color: t.ink }]}>{ticket.holderName}</Text>
            <Text style={[tks.holderHint, { color: t.inkMute }]}>
              Apresente este QR code na entrada
            </Text>

            {/* Código + timer */}
            <View style={[tks.codeRow, { backgroundColor: t.bgElev, borderColor: t.line }]}>
              <Text style={[tks.codeText, { color: t.ink }]}>{code}</Text>
              <View style={tks.timerWrap}>
                <View style={[tks.timerTrack, { backgroundColor: t.inkFaint }]}>
                  <Animated.View
                    style={[tks.timerFill, {
                      backgroundColor: t.orange,
                      width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
                    }]}
                  />
                </View>
                <Text style={[tks.timerText, { color: t.inkMute }]}>{secs}s</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão fechar */}
      <TouchableOpacity
        style={[tks.closeBtn, { backgroundColor: t.orange }]}
        onPress={onBack}
        activeOpacity={0.85}
      >
        <Feather name="x" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

/* ══════════════════════════════════════════════════════
   TELA DE DETALHES DO EVENTO
   ══════════════════════════════════════════════════════ */
const DetailScreen: React.FC<{
  exp: Exp;
  onBack: () => void;
  onConfirm: (ticket: Ticket) => void;
}> = ({ exp, onBack, onConfirm }) => {
  const { t } = useTheme();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleCta = () => {
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("done");
      const code = genCode();
      const ticket: Ticket = {
        id: `tkt_${Date.now()}`,
        exp,
        dynamicCode: code,
        qrValue: `kori://acesso?exp=${exp.id}&codigo=${code}`,
        holderName: "Pedro Henrique",
      };
      setTimeout(() => onConfirm(ticket), 600);
    }, 2000);
  };

  return (
    <View style={[ds.screen, { backgroundColor: t.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Header */}
        <View style={ds.hdr}>
          <TouchableOpacity onPress={onBack} style={[ds.hdrBtn, { backgroundColor: t.bgElev }]}>
            <Feather name="chevron-left" size={20} color={t.ink} />
          </TouchableOpacity>
          <Text style={[ds.hdrTitle, { color: t.ink }]} numberOfLines={1}>{exp.title}</Text>
          <TouchableOpacity
            style={[ds.hdrBtn, { backgroundColor: t.bgElev }]}
            onPress={() => Share.share({ message: exp.title })}
          >
            <Feather name="share-2" size={16} color={t.ink} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <Image source={exp.image} style={ds.hero} resizeMode="cover" />

        {/* Artista / Local */}
        <View style={ds.artistRow}>
          <View style={[ds.avatar, { backgroundColor: t.bgElev, borderColor: t.orange }]}>
            <Feather name={exp.type === "show" ? "music" : "map-pin"} size={18} color={t.orange} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[ds.artistName, { color: t.ink }]}>{exp.title}</Text>
            <Text style={[ds.artistSub,  { color: t.inkMute }]}>{exp.subtitle}</Text>
          </View>
        </View>

        {/* Pílulas de info */}
        <View style={ds.pills}>
          <View style={[ds.pill, { backgroundColor: t.bgElev, borderColor: t.line }]}>
            <Feather name={exp.type === "show" ? "tag" : "coffee"} size={15} color={t.ink} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[ds.pillLabel, { color: t.inkMute }]}>
                {exp.type === "show" ? "Ingresso" : "Reserva"}
              </Text>
              <Text style={[ds.pillVal, { color: t.ink }]}>{exp.price}</Text>
            </View>
          </View>
          <View style={[ds.pill, { backgroundColor: t.bgElev, borderColor: t.line }]}>
            <Feather name="clock" size={15} color={t.ink} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[ds.pillLabel, { color: t.inkMute }]}>{exp.diaLabel}</Text>
              <Text style={[ds.pillVal,   { color: t.ink }]}>{exp.horaLabel}</Text>
            </View>
          </View>
        </View>

        {/* Sobre */}
        <Text style={[ds.aboutTitle, { color: t.ink }]}>Sobre o Evento</Text>
        <Text style={[ds.aboutBody,  { color: t.inkDim }]}>{exp.sobre}</Text>
      </ScrollView>

      {/* CTA fixo no rodapé */}
      <View style={[ds.ctaBar, { backgroundColor: t.bg, borderTopColor: t.line }]}>
        <View style={[ds.ctaIcon, { backgroundColor: t.bgElev }]}>
          <Feather name={exp.type === "show" ? "tag" : "calendar"} size={20} color={t.ink} />
        </View>
        <TouchableOpacity
          style={[ds.ctaBtn, { backgroundColor: t.ink, opacity: status === "loading" ? 0.7 : 1 }]}
          onPress={handleCta}
          activeOpacity={0.85}
        >
          <Text style={[ds.ctaText, { color: t.bg }]}>
            {status === "loading" ? "Processando..." : status === "done" ? "Concluído ✓" : exp.ctaLabel}
          </Text>
          {status === "idle" && (
            <View style={{ flexDirection: "row", marginLeft: 4 }}>
              <Feather name="chevron-right" size={18} color={t.bg} />
              <Feather name="chevron-right" size={18} color={t.bg} style={{ marginLeft: -8 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ══════════════════════════════════════════════════════
   TELA PRINCIPAL (Lista)
   ══════════════════════════════════════════════════════ */
export const ExperiencesPanel: React.FC = () => {
  const { t } = useTheme();
  const entering = useFadeUp();
  const [filtro,    setFiltro]    = useState<Filter>("breve");
  const [busca,     setBusca]     = useState("");
  const [detalhe,   setDetalhe]   = useState<Exp | null>(null);
  const [ticket,    setTicket]    = useState<Ticket | null>(null);
  const [meusIngs,  setMeusIngs]  = useState<Ticket[]>([]);
  const [abaAtiva,  setAbaAtiva]  = useState<"explorar" | "ingressos">("explorar");

  const visiveis = useMemo(() => {
    let lista = EXPERIENCES;
    if (filtro === "show")        lista = lista.filter((e) => e.type === "show");
    if (filtro === "restaurante") lista = lista.filter((e) => e.type === "restaurante");
    if (busca) lista = lista.filter((e) =>
      e.title.toLowerCase().includes(busca.toLowerCase()) ||
      e.subtitle.toLowerCase().includes(busca.toLowerCase())
    );
    return lista;
  }, [filtro, busca]);

  /* ── Detalhe ── */
  if (ticket && abaAtiva === "ingressos") {
    return <TicketScreen ticket={ticket} onBack={() => setTicket(null)} />;
  }
  if (ticket) {
    return <TicketScreen ticket={ticket} onBack={() => setTicket(null)} />;
  }
  if (detalhe) {
    return (
      <DetailScreen
        exp={detalhe}
        onBack={() => setDetalhe(null)}
        onConfirm={(tkt) => {
          setMeusIngs((prev) => [tkt, ...prev]);
          setDetalhe(null);
          setAbaAtiva("ingressos");
          setTicket(tkt);
        }}
      />
    );
  }

  /* ── Lista principal ── */
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Saudação */}
      <ReAnimated.View entering={entering(60)}>
        <View style={ls.greetBlock}>
          <Text style={[ls.greetSmall, { color: t.inkDim }]}>Olá, explorador</Text>
          <Text style={[ls.greetBig,   { color: t.ink }]}>Escolha sua próxima{"\n"}experiência</Text>
        </View>
      </ReAnimated.View>

      {/* Barra de busca */}
      <ReAnimated.View entering={entering(120)} style={{ marginBottom: 24 }}>
      <SoftCard radius={radii.pill} padding={0}>
        <View style={ls.searchBar}>
          <Feather name="search" size={16} color={t.inkMute} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar evento ou restaurante"
            placeholderTextColor={t.inkMute}
            style={[ls.searchInput, { color: t.ink }]}
            autoCorrect={false}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Feather name="x" size={16} color={t.inkMute} />
            </TouchableOpacity>
          )}
        </View>
      </SoftCard>
      </ReAnimated.View>

      {/* Filtros de categoria */}
      <ReAnimated.View entering={entering(180)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ls.filtersRow}>
        {([
          { id: "tudo",        label: "Tudo" },
          { id: "breve",       label: "Em Breve" },
          { id: "show",        label: "Shows" },
          { id: "restaurante", label: "Restaurantes" },
        ] as const).map((f) => {
          const ativo = filtro === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFiltro(f.id)}
              style={[ls.filterPill, ativo ? { backgroundColor: t.ink } : { backgroundColor: "transparent" }]}
            >
              <Text style={[ls.filterText, { color: ativo ? t.bg : t.inkMute }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </ReAnimated.View>

      {/* ─── ABA: MEUS INGRESSOS ─── */}
      {meusIngs.length > 0 && (
        <ReAnimated.View entering={entering(240)} style={ls.mySection}>
          <Text style={[ls.mySectionTitle, { color: t.ink }]}>Meus Ingressos</Text>

          {meusIngs.map((tkt) => (
            <TouchableOpacity key={tkt.id} activeOpacity={0.85} onPress={() => setTicket(tkt)}>
              {/* Card estilo ticket físico (igual à imagem de referência) */}
              <View style={[ls.ticketCard, { backgroundColor: t.bg2, borderColor: t.line }]}>
                {/* Entalhe esquerdo */}
                <View style={[ls.notchTicketL, { backgroundColor: t.bg }]} />
                {/* Entalhe direito */}
                <View style={[ls.notchTicketR, { backgroundColor: t.bg }]} />

                {/* Imagem quadrada */}
                <Image source={tkt.exp.image} style={ls.ticketThumb} resizeMode="cover" />

                {/* Conteúdo */}
                <View style={ls.ticketBody}>
                  <Text style={[ls.ticketDate, { color: t.orange }]}>
                    {tkt.exp.dateLabel} às {tkt.exp.horaLabel}
                  </Text>
                  <Text style={[ls.ticketTitle, { color: t.ink }]} numberOfLines={2}>
                    {tkt.exp.title}
                  </Text>
                  <View style={ls.ticketLocalRow}>
                    <Feather name="map-pin" size={11} color={t.inkMute} />
                    <Text style={[ls.ticketLocal, { color: t.inkMute }]} numberOfLines={1}>
                      {tkt.exp.local}
                    </Text>
                  </View>
                </View>

                {/* Ícone QR */}
                <View style={[ls.qrIconBox, { backgroundColor: t.bgElev, borderColor: t.line }]}>
                  <Feather name="grid" size={18} color={t.ink} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ReAnimated.View>
      )}

      {/* ─── CARDS DE EVENTOS ─── */}
      <ReAnimated.View entering={entering(300)}>
      <Text style={[ls.sectionLabel, { color: t.ink, marginBottom: 12 }]}>
        {visiveis.length > 0 ? "Eventos Disponíveis" : "Nenhum evento encontrado"}
      </Text>

      <View style={ls.cardList}>
        {visiveis.map((exp) => (
          <TouchableOpacity key={exp.id} activeOpacity={0.92} onPress={() => setDetalhe(exp)}>
            <View style={[ls.eventCard, { borderColor: t.line }]}>
              <Image source={exp.image} style={ls.eventCardImage} resizeMode="cover" />
              <View style={ls.eventCardOverlay} />

              {/* Badge de data */}
              <View style={[ls.dateBadge, { backgroundColor: t.bgElev }]}>
                <Text style={[ls.dateBadgeDay, { color: t.ink }]}>{exp.dateLabel.split(" ")[0]}</Text>
                <Text style={[ls.dateBadgeMon, { color: t.orange }]}>{exp.month}</Text>
              </View>

              {/* Barra inferior */}
              <View style={[ls.eventBottom, { backgroundColor: "rgba(10,10,10,0.84)" }]}>
                <View style={[ls.eventAvatar, { backgroundColor: t.bgElev, borderColor: t.orange }]}>
                  <Feather name={exp.type === "show" ? "music" : "map-pin"} size={14} color={t.orange} />
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={[ls.eventTitle, { color: "#fff" }]} numberOfLines={1}>{exp.title}</Text>
                  <Text style={[ls.eventSub,   { color: "rgba(255,255,255,0.7)" }]} numberOfLines={1}>{exp.subtitle}</Text>
                </View>
                <Button label="Ver" variant="primary" style={ls.verBtn} labelStyle={ls.verBtnText} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      </ReAnimated.View>
    </ScrollView>
  );
};

/* ─── Estilos ─────────────────────────────────────── */
const ls = StyleSheet.create({
  greetBlock: { marginBottom: 24 },
  greetSmall: { fontFamily: fonts.sans.semibold, fontSize: 13 },
  greetBig:   { fontFamily: fonts.sans.bold, fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 4 },

  searchBar: {
    flexDirection: "row", alignItems: "center", height: 48,
    paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans.medium, fontSize: 14 },

  filtersRow: { gap: 12, paddingRight: 8, marginBottom: 24 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill },
  filterText: { fontFamily: fonts.sans.bold, fontSize: 13 },

  /* Meus Ingressos */
  mySection:     { marginBottom: 24 },
  mySectionTitle: { fontFamily: fonts.sans.bold, fontSize: 18, fontWeight: "800", marginBottom: 14, letterSpacing: -0.3 },

  /* Card tipo ticket físico (referência) */
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
    height: 88,
    position: "relative",
  },
  notchTicketL: {
    position: "absolute",
    width: 18, height: 18, borderRadius: 9,
    left: -9, top: "50%", marginTop: -9, zIndex: 3,
  },
  notchTicketR: {
    position: "absolute",
    width: 18, height: 18, borderRadius: 9,
    right: -9, top: "50%", marginTop: -9, zIndex: 3,
  },
  ticketThumb:   { width: 88, height: "100%", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  ticketBody:    { flex: 1, paddingHorizontal: 14, paddingVertical: 10, justifyContent: "center" },
  ticketDate:    { fontFamily: fonts.mono.semibold, fontSize: 9, letterSpacing: 0.3, marginBottom: 3 },
  ticketTitle:   { fontFamily: fonts.sans.bold, fontSize: 14, fontWeight: "700", marginBottom: 5 },
  ticketLocalRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ticketLocal:   { fontFamily: fonts.sans.semibold, fontSize: 11, flex: 1 },
  qrIconBox: {
    width: 38, height: 38, borderRadius: 10, borderWidth: 1,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },

  sectionLabel: { fontFamily: fonts.sans.bold, fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },

  /* Cards de eventos */
  cardList:  { gap: 14 },
  eventCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden", height: 240, position: "relative" },
  eventCardImage:   { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  eventCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.32)" },
  dateBadge: { position: "absolute", top: 14, right: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignItems: "center" },
  dateBadgeDay: { fontFamily: fonts.sans.bold, fontSize: 16, fontWeight: "900" },
  dateBadgeMon: { fontFamily: fonts.sans.bold, fontSize: 11, textTransform: "uppercase" },
  eventBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 14,
    borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
  },
  eventAvatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  eventTitle:  { fontFamily: fonts.sans.bold, fontSize: 13, fontWeight: "700" },
  eventSub:    { fontFamily: fonts.sans.semibold, fontSize: 11, marginTop: 1 },
  verBtn:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill },
  verBtnText:  { fontFamily: fonts.sans.bold, fontSize: 12 },
});

const ds = StyleSheet.create({
  screen:    { flex: 1 },
  hdr:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 16 },
  hdrBtn:    { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  hdrTitle:  { fontFamily: fonts.sans.bold, fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center", marginHorizontal: 8 },
  hero:      { width: "100%", height: 240, borderRadius: 18, overflow: "hidden", marginBottom: 20 },
  artistRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar:    { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  artistName: { fontFamily: fonts.sans.bold, fontSize: 15, fontWeight: "700" },
  artistSub:  { fontFamily: fonts.sans.semibold, fontSize: 12, marginTop: 2 },
  pills:      { flexDirection: "row", gap: 12, marginBottom: 22 },
  pill: {
    flex: 1, flexDirection: "row", alignItems: "center",
    borderRadius: radii.btn, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
  },
  pillLabel: { fontFamily: fonts.mono.medium, fontSize: 10 },
  pillVal:   { fontFamily: fonts.sans.bold, fontSize: 14, fontWeight: "700", marginTop: 2 },
  aboutTitle: { fontFamily: fonts.sans.bold, fontSize: 17, fontWeight: "800", marginBottom: 10 },
  aboutBody:  { fontFamily: fonts.sans.medium, fontSize: 13, lineHeight: 20 },
  ctaBar: {
    position: "absolute", bottom: 0, left: -20, right: -20,
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 20, paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 32 : 18,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaIcon:   { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  ctaBtn:    { flex: 1, height: 50, borderRadius: radii.pill, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  ctaText:   { fontFamily: fonts.sans.bold, fontSize: 15, fontWeight: "700" },
});

const tks = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingBottom: 16,
  },
  headerBtn:   { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: fonts.sans.bold, fontSize: 16, fontWeight: "700" },

  card:   { borderRadius: 20, borderWidth: 1, overflow: "hidden", marginBottom: 24 },
  heroImg: { width: "100%", height: 200 },

  notchRow:  { flexDirection: "row", alignItems: "center", height: 20, position: "relative" },
  notchL:    { position: "absolute", width: 20, height: 20, borderRadius: 10, left: -10, zIndex: 2 },
  notchR:    { position: "absolute", width: 20, height: 20, borderRadius: 10, right: -10, zIndex: 2 },
  dashed:    { flex: 1, marginHorizontal: 10, borderTopWidth: 1, borderStyle: "dashed", borderRadius: 1 },

  infoSection: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 },
  dataHora:    { fontFamily: fonts.mono.medium, fontSize: 11, marginBottom: 6 },
  titulo:      { fontFamily: fonts.sans.bold, fontSize: 20, fontWeight: "900", letterSpacing: -0.4, marginBottom: 4 },
  subtitulo:   { fontFamily: fonts.sans.semibold, fontSize: 12, marginBottom: 16 },

  grid:      { flexDirection: "row", flexWrap: "wrap" },
  gridCell:  { width: "50%" },
  gridRight: { alignItems: "flex-end" },
  gridLabel: { fontFamily: fonts.mono.medium, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 },
  gridVal:   { fontFamily: fonts.sans.bold, fontSize: 13, fontWeight: "700", marginTop: 3 },

  divLine:   { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },

  qrSection:  { alignItems: "center", paddingVertical: 26, paddingHorizontal: 20 },
  qrLabel:    { fontFamily: fonts.mono.semibold, fontSize: 9, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 18 },
  qrBox:      { backgroundColor: "#ffffff", borderRadius: 16, padding: 14, marginBottom: 18 },

  holderName: { fontFamily: fonts.sans.bold, fontSize: 17, fontWeight: "800", letterSpacing: -0.3, marginBottom: 6 },
  holderHint: { fontFamily: fonts.sans.medium, fontSize: 12, marginBottom: 18, textAlign: "center" },

  codeRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    width: "100%", borderRadius: radii.btn, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  codeText:   { fontFamily: fonts.mono.semibold, fontSize: 18, letterSpacing: 3 },
  timerWrap:  { flexDirection: "row", alignItems: "center", gap: 8 },
  timerTrack: { width: 70, height: 4, borderRadius: 2, overflow: "hidden" },
  timerFill:  { height: "100%", borderRadius: 2 },
  timerText:  { fontFamily: fonts.mono.medium, fontSize: 11, width: 26, textAlign: "right" },

  closeBtn: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 36 : 24,
    alignSelf: "center",
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
