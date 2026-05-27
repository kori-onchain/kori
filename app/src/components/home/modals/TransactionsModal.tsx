import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@/icons";
import { SoftCard } from "@components/layout/SoftCard";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";

export interface TransactionItem {
  id: string;
  title: string;
  description: string;
  amount: string;
  rawAmount: number;
  isInflow: boolean;
  type:
    | "transfer"
    | "deposit"
    | "withdraw"
    | "invest"
    | "card"
    | "exchange"
    | "cc"
    | "other";
  initials?: string;
  isAnonymous?: boolean;
}

export interface DayGroup {
  id: string;
  date: string;
  dayLabel: string;
  balance: string;
  month: string;
  transactions: TransactionItem[];
}

const MONTH_FILTERS = [
  { id: "todos", label: "Todos os meses" },
  { id: "janeiro", label: "Janeiro" },
  { id: "fevereiro", label: "Fevereiro" },
  { id: "março", label: "Março" },
  { id: "abril", label: "Abril" },
  { id: "maio", label: "Maio" },
  { id: "junho", label: "Junho" },
  { id: "julho", label: "Julho" },
  { id: "agosto", label: "Agosto" },
  { id: "setembro", label: "Setembro" },
  { id: "outubro", label: "Outubro" },
  { id: "novembro", label: "Novembro" },
  { id: "dezembro", label: "Dezembro" },
];

const CATEGORY_FILTERS = [
  { id: "todas", label: "Todas as categorias" },
  { id: "transfer", label: "Transferências" },
  { id: "deposit", label: "Depósitos" },
  { id: "withdraw", label: "Saques" },
  { id: "invest", label: "Aplicações" },
  { id: "card", label: "Cartões" },
];

const TYPE_FILTERS = [
  { id: "todos", label: "Todos os fluxos" },
  { id: "inflow", label: "Entradas" },
  { id: "outflow", label: "Saídas" },
];

const INITIAL_GROUPS: DayGroup[] = [
  {
    id: "g12",
    date: "28/12/2026",
    dayLabel: "Seg, 28/12/2026",
    balance: "Saldo R$ 29.845,20",
    month: "Dezembro",
    transactions: [
      {
        id: "t12",
        title: "Compra no Cartão",
        description: "Supermercado Kori",
        amount: "-R$ 152,40",
        rawAmount: -152.4,
        isInflow: false,
        type: "card",
        initials: "CR",
      },
    ],
  },
  {
    id: "g11",
    date: "15/11/2026",
    dayLabel: "Sex, 15/11/2026",
    balance: "Saldo R$ 29.692,80",
    month: "Novembro",
    transactions: [
      {
        id: "t11",
        title: "Lucas Silva - Transf",
        description: "@lucas_s",
        amount: "R$ 1.200,00",
        rawAmount: 1200.0,
        isInflow: true,
        type: "transfer",
        initials: "LS",
      },
    ],
  },
  {
    id: "g10",
    date: "12/10/2026",
    dayLabel: "Seg, 12/10/2026",
    balance: "Saldo R$ 28.492,80",
    month: "Outubro",
    transactions: [
      {
        id: "t10",
        title: "Desconhecido - Transf",
        description: "0x7a2d...3b9e",
        amount: "R$ 4.500,00",
        rawAmount: 4500.0,
        isInflow: true,
        type: "transfer",
        isAnonymous: true,
      },
    ],
  },
  {
    id: "g9",
    date: "08/09/2026",
    dayLabel: "Ter, 08/09/2026",
    balance: "Saldo R$ 23.992,80",
    month: "Setembro",
    transactions: [
      {
        id: "t9",
        title: "Resgate Aplicação",
        description: "CDB Kori Liquidez Diária",
        amount: "R$ 3.000,00",
        rawAmount: 3000.0,
        isInflow: true,
        type: "invest",
        initials: "AP",
      },
    ],
  },
  {
    id: "g8",
    date: "20/08/2026",
    dayLabel: "Qui, 20/08/2026",
    balance: "Saldo R$ 20.992,80",
    month: "Agosto",
    transactions: [
      {
        id: "t8_aug",
        title: "Saque - Banco24Horas",
        description: "Terminais Autocred",
        amount: "-R$ 400,00",
        rawAmount: -400.0,
        isInflow: false,
        type: "withdraw",
        initials: "SQ",
      },
    ],
  },
  {
    id: "g7",
    date: "10/07/2026",
    dayLabel: "Qua, 10/07/2026",
    balance: "Saldo R$ 24.249,55",
    month: "Julho",
    transactions: [
      {
        id: "t8",
        title: "Desconhecido - Transf",
        description: "0x9c3d...f8e2",
        amount: "R$ 5.830,45",
        rawAmount: 5830.45,
        isInflow: true,
        type: "deposit",
        isAnonymous: true,
      },
    ],
  },
  {
    id: "g6",
    date: "15/06/2026",
    dayLabel: "Seg, 15/06/2026",
    balance: "Saldo R$ 21.419,10",
    month: "Junho",
    transactions: [
      {
        id: "t7",
        title: "Câmbio BRL -> USD",
        description: "Conversão de saldo Kori",
        amount: "-R$ 2.450,80",
        rawAmount: -2450.8,
        isInflow: false,
        type: "invest",
        initials: "KO",
      },
    ],
  },
  {
    id: "g5",
    date: "18/05/2026",
    dayLabel: "Seg, 18/05/2026",
    balance: "Saldo R$ 24.574,13",
    month: "Maio",
    transactions: [
      {
        id: "t1",
        title: "Lucas Silva - Transf",
        description: "@lucas_s",
        amount: "R$ 78,43",
        rawAmount: 78.43,
        isInflow: true,
        type: "transfer",
        initials: "LS",
      },
    ],
  },
  {
    id: "g4",
    date: "16/05/2026",
    dayLabel: "Sab, 16/05/2026",
    balance: "Saldo R$ 24.495,70",
    month: "Maio",
    transactions: [
      {
        id: "t2",
        title: "Maria Oliveira - Transf",
        description: "@mari_o",
        amount: "R$ 246,15",
        rawAmount: 246.15,
        isInflow: true,
        type: "transfer",
        initials: "MO",
      },
    ],
  },
  {
    id: "g3",
    date: "20/04/2026",
    dayLabel: "Seg, 20/04/2026",
    balance: "Saldo R$ 20.870,00",
    month: "Abril",
    transactions: [
      {
        id: "t4",
        title: "Maria Oliveira - Transf",
        description: "@mari_o",
        amount: "R$ 412,67",
        rawAmount: 412.67,
        isInflow: true,
        type: "transfer",
        initials: "MO",
      },
    ],
  },
  {
    id: "g2",
    date: "12/03/2026",
    dayLabel: "Qui, 12/03/2026",
    balance: "Saldo R$ 20.457,33",
    month: "Março",
    transactions: [
      {
        id: "t3",
        title: "Desconhecido - Transf",
        description: "0x3a9b...7c1e",
        amount: "-R$ 19,84",
        rawAmount: -19.84,
        isInflow: false,
        type: "transfer",
        isAnonymous: true,
      },
    ],
  },
  {
    id: "g1_feb",
    date: "05/02/2026",
    dayLabel: "Qui, 05/02/2026",
    balance: "Saldo R$ 20.477,17",
    month: "Fevereiro",
    transactions: [
      {
        id: "t6",
        title: "Rafael Rocha - Transf",
        description: "@rafa_r",
        amount: "-R$ 41,72",
        rawAmount: -41.72,
        isInflow: false,
        type: "transfer",
        initials: "RR",
      },
    ],
  },
  {
    id: "g1_jan",
    date: "15/01/2026",
    dayLabel: "Seg, 15/01/2026",
    balance: "Saldo R$ 20.518,89",
    month: "Janeiro",
    transactions: [
      {
        id: "t5",
        title: "Maria Oliveira - Transf",
        description: "@mari_o",
        amount: "-R$ 523,89",
        rawAmount: -523.89,
        isInflow: false,
        type: "transfer",
        initials: "MO",
      },
    ],
  },
];

interface TransactionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TransactionsModal: React.FC<TransactionsModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [hideBalances, setHideBalances] = useState(false);

  // Estados dos Filtros
  const [activeMonth, setActiveMonth] = useState<string>("todos");
  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [activeType, setActiveType] = useState<string>("todos");
  const [activeDropdown, setActiveDropdown] = useState<
    "month" | "category" | "type" | null
  >(null);

  const toggleHideBalances = () => {
    setHideBalances(!hideBalances);
  };

  // Helpers para os labels dos filtros
  const getMonthLabel = () => {
    if (activeMonth === "todos") return "Período";
    return MONTH_FILTERS.find((m) => m.id === activeMonth)?.label || "Período";
  };

  const getCategoryLabel = () => {
    if (activeCategory === "todas") return "Categorias";
    return (
      CATEGORY_FILTERS.find((c) => c.id === activeCategory)?.label ||
      "Categorias"
    );
  };

  const getTypeLabel = () => {
    if (activeType === "todos") return "Tipos de transação";
    return (
      TYPE_FILTERS.find((t) => t.id === activeType)?.label ||
      "Tipos de transação"
    );
  };

  // OPTIMIZE: Filtragem dinâmica de grupos e transações em tempo real
  const filteredGroups = INITIAL_GROUPS.map((group) => {
    const filteredTx = group.transactions.filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMonth =
        activeMonth === "todos" || group.month.toLowerCase() === activeMonth;
      const matchesCategory =
        activeCategory === "todas" || tx.type === activeCategory;
      const matchesType =
        activeType === "todos" ||
        (activeType === "inflow" ? tx.isInflow : !tx.isInflow);

      return matchesSearch && matchesMonth && matchesCategory && matchesType;
    });

    return {
      ...group,
      transactions: filteredTx,
    };
  }).filter((group) => group.transactions.length > 0);

  const monthHeadersRendered: { [key: string]: boolean } = {};

  const renderTransactionRow = (tx: TransactionItem) => (
    <TouchableOpacity
      key={tx.id}
      style={styles.transactionRow}
      activeOpacity={0.75}
    >
      <SoftCard radius={22} padding={0} flat style={styles.iconCircle}>
        <View style={styles.iconCircleInner}>
          {tx.isAnonymous ? (
            <Feather name="eye-off" size={18} color={t.inkMute} />
          ) : (
            <Text style={[styles.avatarText, { color: t.ink }]}>
              {tx.initials || "TR"}
            </Text>
          )}
        </View>
      </SoftCard>

      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitleText, { color: t.ink }]}>
          {tx.title}
        </Text>
        <Text
          style={[styles.transactionDescText, { color: t.inkMute }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {tx.description}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[styles.amountText, { color: tx.isInflow ? t.green : t.ink }]}
        >
          {hideBalances ? "•••••" : tx.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGroupItem = ({
    item: group,
    index,
  }: {
    item: DayGroup;
    index: number;
  }) => {
    const showMonthHeader = !monthHeadersRendered[group.month];
    if (showMonthHeader) {
      monthHeadersRendered[group.month] = true;
    }

    return (
      <View style={styles.groupContainer}>
        {index > 0 && !showMonthHeader && (
          <View style={[styles.separatorLine, { backgroundColor: t.line }]} />
        )}

        {showMonthHeader && (
          <View>
            {index > 0 && (
              <View
                style={[styles.separatorLine, { backgroundColor: t.line }]}
              />
            )}
            <Text style={[styles.monthHeaderTitle, { color: t.ink }]}>
              {group.month}
            </Text>
          </View>
        )}

        {/* Cabeçalho do Dia */}
        <View style={styles.dayHeaderRow}>
          <Text style={[styles.dayLabelText, { color: t.inkMute }]}>
            {group.dayLabel}
          </Text>
          <Text style={[styles.dayBalanceText, { color: t.inkMute }]}>
            {hideBalances ? "Saldo R$ •••••" : group.balance}
          </Text>
        </View>

        {/* Lista de Transações do Dia */}
        <View style={styles.transactionsListContainer}>
          {group.transactions.map(renderTransactionRow)}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
        <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />

        {/* Cabeçalho superior */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.headerBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={24} color={t.ink} />
            </TouchableOpacity>
            <Text style={[styles.headerTitleText, { color: t.ink }]}>
              Transações
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        {/* Barra de Pesquisa */}
        <SoftCard
          radius={radii.pill}
          padding={0}
          flat
          style={styles.searchCard}
        >
          <View style={styles.searchBarContainer}>
            <Feather
              name="search"
              size={18}
              color={t.inkMute}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Pesquisar"
              placeholderTextColor={t.inkMute}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: t.ink }]}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={t.inkMute} />
              </TouchableOpacity>
            )}
          </View>
        </SoftCard>

        {/* Seletores Dropdown de Filtros Avançados */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dropdownsScroll}
          >
            {/* Dropdown 1: Período */}
            <TouchableOpacity
              style={[
                styles.dropdownTrigger,
                {
                  backgroundColor:
                    activeDropdown === "month" ? t.bgElev : t.bg2,
                  borderColor: activeMonth !== "todos" ? t.green : t.cardBorder,
                },
                activeMonth !== "todos" && { borderWidth: 1 },
              ]}
              onPress={() =>
                setActiveDropdown(activeDropdown === "month" ? null : "month")
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  { color: activeMonth !== "todos" ? t.green : t.ink },
                ]}
                numberOfLines={1}
              >
                {getMonthLabel()}
              </Text>
              <Feather
                name="chevron-down"
                size={14}
                color={activeMonth !== "todos" ? t.green : t.inkMute}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            {/* Dropdown 2: Categorias */}
            <TouchableOpacity
              style={[
                styles.dropdownTrigger,
                {
                  backgroundColor:
                    activeDropdown === "category" ? t.bgElev : t.bg2,
                  borderColor:
                    activeCategory !== "todas" ? t.green : t.cardBorder,
                },
                activeCategory !== "todas" && { borderWidth: 1 },
              ]}
              onPress={() =>
                setActiveDropdown(
                  activeDropdown === "category" ? null : "category",
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  { color: activeCategory !== "todas" ? t.green : t.ink },
                ]}
                numberOfLines={1}
              >
                {getCategoryLabel()}
              </Text>
              <Feather
                name="chevron-down"
                size={14}
                color={activeCategory !== "todas" ? t.green : t.inkMute}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            {/* Dropdown 3: Tipos de transação */}
            <TouchableOpacity
              style={[
                styles.dropdownTrigger,
                {
                  backgroundColor: activeDropdown === "type" ? t.bgElev : t.bg2,
                  borderColor: activeType !== "todos" ? t.green : t.cardBorder,
                },
                activeType !== "todos" && { borderWidth: 1 },
              ]}
              onPress={() =>
                setActiveDropdown(activeDropdown === "type" ? null : "type")
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  { color: activeType !== "todos" ? t.green : t.ink },
                ]}
                numberOfLines={1}
              >
                {getTypeLabel()}
              </Text>
              <Feather
                name="chevron-down"
                size={14}
                color={activeType !== "todos" ? t.green : t.inkMute}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </ScrollView>

          {/* Painel Flutuante do Dropdown Ativo */}
          {activeDropdown && (
            <View
              style={[
                styles.optionsOverlay,
                {
                  backgroundColor: t.bg2,
                  borderColor: t.cardBorder,
                  shadowColor: "#000",
                },
                activeDropdown === "month" && { left: 0 },
                activeDropdown === "category" && { left: 80 },
                activeDropdown === "type" && { right: 0 },
              ]}
            >
              <ScrollView
                style={styles.optionsScrollView}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {activeDropdown === "month" &&
                  MONTH_FILTERS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionItem,
                        { borderBottomColor: t.line },
                        activeMonth === item.id && {
                          backgroundColor: t.bgElev,
                        },
                      ]}
                      onPress={() => {
                        setActiveMonth(item.id);
                        setActiveDropdown(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              activeMonth === item.id ? t.green : t.inkMute,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {activeMonth === item.id && (
                        <Feather name="check" size={14} color={t.green} />
                      )}
                    </TouchableOpacity>
                  ))}

                {activeDropdown === "category" &&
                  CATEGORY_FILTERS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionItem,
                        { borderBottomColor: t.line },
                        activeCategory === item.id && {
                          backgroundColor: t.bgElev,
                        },
                      ]}
                      onPress={() => {
                        setActiveCategory(item.id);
                        setActiveDropdown(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              activeCategory === item.id ? t.green : t.inkMute,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {activeCategory === item.id && (
                        <Feather name="check" size={14} color={t.green} />
                      )}
                    </TouchableOpacity>
                  ))}

                {activeDropdown === "type" &&
                  TYPE_FILTERS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionItem,
                        { borderBottomColor: t.line },
                        activeType === item.id && { backgroundColor: t.bgElev },
                      ]}
                      onPress={() => {
                        setActiveType(item.id);
                        setActiveDropdown(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: activeType === item.id ? t.green : t.inkMute,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {activeType === item.id && (
                        <Feather name="check" size={14} color={t.green} />
                      )}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Listagem de Transações Agrupadas */}
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather
                name="list"
                size={48}
                color={t.inkFaint}
                style={{ marginBottom: 12 }}
              />
              <Text style={[styles.emptyText, { color: t.inkMute }]}>
                Nenhuma transação encontrada
              </Text>
            </View>
          }
        />

        {/* Backdrop absoluto para fechar dropdown ao clicar fora */}
        {activeDropdown && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setActiveDropdown(null)}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: Platform.OS === "android" ? 24 : 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitleText: {
    fontSize: 20,
    fontFamily: fonts.sans.bold,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  headerBtn: {
    padding: 4,
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: 18,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    padding: 0,
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 12,
    zIndex: 999, // Ensure dropdown options overlap everything
    position: "relative",
  },
  dropdownsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 20,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontFamily: fonts.sans.semibold,
  },
  optionsOverlay: {
    position: "absolute",
    top: 48,
    width: 220,
    borderRadius: radii.card,
    borderWidth: 1,
    maxHeight: 280,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
    overflow: "hidden",
  },
  optionsScrollView: {
    paddingVertical: 6,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: 13.5,
    fontFamily: fonts.sans.medium,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  groupContainer: {
    marginBottom: 24,
  },
  monthHeaderTitle: {
    fontSize: 20,
    fontFamily: fonts.sans.bold,
    marginBottom: 16,
    marginTop: 6,
  },
  dayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 6,
  },
  separatorLine: {
    height: 1,
    marginVertical: 16,
  },
  dayLabelText: {
    fontSize: 12,
    fontFamily: fonts.mono.medium,
  },
  dayBalanceText: {
    fontSize: 12.5,
    fontFamily: fonts.mono.medium,
  },
  transactionsListContainer: {
    gap: 4,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    marginRight: 14,
  },
  iconCircleInner: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: "center",
  },
  transactionTitleText: {
    fontSize: 14.5,
    fontFamily: fonts.sans.semibold,
    marginBottom: 3,
  },
  transactionDescText: {
    fontSize: 12,
    fontFamily: fonts.sans.medium,
  },
  amountContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amountText: {
    fontSize: 14,
    fontFamily: fonts.mono.semibold,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.sans.semibold,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 98,
  },
});
