import { useState, useCallback } from 'react';

interface ModalState {
  contacts: boolean;
  addContact: boolean;
  transactions: boolean;
  profile: boolean;
  sendPayment: boolean;
  investModal: boolean;
  anticipationModal: boolean;
}

export const useModals = () => {
  const [modals, setModals] = useState<ModalState>({
    contacts: false,
    addContact: false,
    transactions: false,
    profile: false,
    sendPayment: false,
    investModal: false,
    anticipationModal: false,
  });

  const open = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  }, []);

  const close = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  }, []);

  return { modals, open, close };
};
