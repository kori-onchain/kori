import { useState, useCallback } from 'react';
import { Contact, MOCK_CONTACTS } from '../data/contacts';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const addContact = useCallback((name: string, walletId: string) => {
    const raw = name || walletId.replace('@', '');
    const initials = raw
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'UN';

    const newContact: Contact = {
      id: Math.random().toString(36).substring(7),
      name: name || null,
      walletId,
      initials,
      isFavorite: false,
    };

    setContacts((prev) => [newContact, ...prev]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  }, []);

  return { contacts, addContact, toggleFavorite };
};
