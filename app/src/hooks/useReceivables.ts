import { useState, useMemo, useCallback, useEffect, useRef } from "react";

export interface Receivable {
  id: string;
  description: string;
  dueDate: string;
  grossAmount: string;
  grossValue: number;
  netAmount: string;
  netValue: number;
  installments: string;
  status: "pendente" | "antecipado";
}

export interface AdvanceReceipt {
  count: number;
  gross: string;
  net: string;
  rate: string;
  date: string;
  protocol: string;
}

interface UseReceivablesReturn {
  receivables: Receivable[];
  isLoading: boolean;
  error: string | null;
  selected: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  allSelected: boolean;
  selectedSummary: { count: number; gross: string; net: string };
  totalGross: string;
  totalNet: string;
  advanceRate: string;
  confirmAdvance: () => void;
  showConfirmation: boolean;
  setShowConfirmation: (v: boolean) => void;
  isProcessing: boolean;
  receipt: AdvanceReceipt | null;
  dismissReceipt: () => void;
}

const MOCK_RECEIVABLES: Receivable[] = [
  {
    id: "1",
    description: "Venda #3821 — Tênis Air Pro",
    dueDate: "02 jun 2026",
    grossAmount: "R$ 1.200,00",
    grossValue: 1200,
    netAmount: "R$ 1.164,00",
    netValue: 1164,
    installments: "3x de R$ 400,00",
    status: "pendente",
  },
  {
    id: "2",
    description: "Venda #3822 — Camiseta Premium",
    dueDate: "08 jun 2026",
    grossAmount: "R$ 480,00",
    grossValue: 480,
    netAmount: "R$ 465,60",
    netValue: 465.6,
    installments: "2x de R$ 240,00",
    status: "pendente",
  },
  {
    id: "3",
    description: "Venda #3819 — Kit Skincare",
    dueDate: "15 jun 2026",
    grossAmount: "R$ 890,00",
    grossValue: 890,
    netAmount: "R$ 863,30",
    netValue: 863.3,
    installments: "4x de R$ 222,50",
    status: "pendente",
  },
  {
    id: "4",
    description: "Venda #3815 — Fone Bluetooth",
    dueDate: "22 jun 2026",
    grossAmount: "R$ 350,00",
    grossValue: 350,
    netAmount: "R$ 339,50",
    netValue: 339.5,
    installments: "1x de R$ 350,00",
    status: "pendente",
  },
  {
    id: "5",
    description: "Venda #3808 — Mochila Urban",
    dueDate: "30 jun 2026",
    grossAmount: "R$ 620,00",
    grossValue: 620,
    netAmount: "R$ 601,40",
    netValue: 601.4,
    installments: "2x de R$ 310,00",
    status: "pendente",
  },
];

const ADVANCE_RATE = "3% a.m.";

const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const generateProtocol = (): string => {
  const now = new Date();
  const date = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ANT-${date}-${rand}`;
};

export const useReceivables = (): UseReceivablesReturn => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<AdvanceReceipt | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReceivables(MOCK_RECEIVABLES);
      setIsLoading(false);
    }, 600);
    return () => {
      clearTimeout(timer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pendingReceivables = useMemo(
    () => receivables.filter((r) => r.status === "pendente"),
    [receivables],
  );

  const selectAll = useCallback(() => {
    setSelected((prev) =>
      prev.size === pendingReceivables.length
        ? new Set()
        : new Set(pendingReceivables.map((r) => r.id)),
    );
  }, [pendingReceivables]);

  const allSelected =
    selected.size === pendingReceivables.length && pendingReceivables.length > 0;

  const selectedSummary = useMemo(() => {
    const items = pendingReceivables.filter((r) => selected.has(r.id));
    const gross = items.reduce((sum, r) => sum + r.grossValue, 0);
    const net = items.reduce((sum, r) => sum + r.netValue, 0);
    return { count: items.length, gross: formatBRL(gross), net: formatBRL(net) };
  }, [pendingReceivables, selected]);

  const totalGross = useMemo(
    () => formatBRL(pendingReceivables.reduce((sum, r) => sum + r.grossValue, 0)),
    [pendingReceivables],
  );

  const totalNet = useMemo(
    () => formatBRL(pendingReceivables.reduce((sum, r) => sum + r.netValue, 0)),
    [pendingReceivables],
  );

  const confirmAdvance = useCallback(() => {
    setIsProcessing(true);
    const summary = { ...selectedSummary };
    const advancedIds = new Set(selected);

    timerRef.current = setTimeout(() => {
      setReceivables((prev) =>
        prev.map((r) =>
          advancedIds.has(r.id) ? { ...r, status: "antecipado" as const } : r,
        ),
      );

      const now = new Date();
      setReceipt({
        count: summary.count,
        gross: summary.gross,
        net: summary.net,
        rate: ADVANCE_RATE,
        date: `${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h")}`,
        protocol: generateProtocol(),
      });

      setSelected(new Set());
      setShowConfirmation(false);
      setIsProcessing(false);
    }, 1200);
  }, [selected, selectedSummary]);

  const dismissReceipt = useCallback(() => {
    setReceipt(null);
  }, []);

  return {
    receivables: pendingReceivables,
    isLoading,
    error,
    selected,
    toggleSelect,
    selectAll,
    allSelected,
    selectedSummary,
    totalGross,
    totalNet,
    advanceRate: ADVANCE_RATE,
    confirmAdvance,
    showConfirmation,
    setShowConfirmation,
    isProcessing,
    receipt,
    dismissReceipt,
  };
};
