import { useState, useCallback } from 'react';
import { Transaction, MOCK_TRANSACTIONS } from '../data/transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substring(7),
    };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  return { transactions, addTransaction };
};
