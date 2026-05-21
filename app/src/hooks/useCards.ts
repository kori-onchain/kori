import { useState, useCallback } from 'react';
import { Card, MOCK_CARDS } from '../data/cards';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);

  const toggleFreeze = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  }, []);

  const toggleOnline = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOnlineEnabled: !c.isOnlineEnabled } : c))
    );
  }, []);

  const updateLimit = useCallback((id: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, limitTotal: newLimit } : c))
    );
  }, []);

  const regenerateVirtual = useCallback((id: string) => {
    const block1 = Math.floor(1000 + Math.random() * 9000).toString();
    const block2 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCvv = Math.floor(100 + Math.random() * 900).toString();

    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              cardNumber: `5421 ${block1} ${block2} ${c.last4}`,
              cvv: newCvv,
            }
          : c
      )
    );
  }, []);

  return { cards, toggleFreeze, toggleOnline, updateLimit, regenerateVirtual };
};
