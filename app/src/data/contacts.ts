export interface Contact {
  id: string;
  name: string | null;
  walletId: string;
  initials: string;
  isFavorite: boolean;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Maria Oliveira', initials: 'MO', walletId: '@mari_o', isFavorite: true },
  { id: '2', name: 'Lucas Silva', initials: 'LS', walletId: '@lucas_s', isFavorite: false },
  { id: '3', name: 'Rafael Rocha', initials: 'RR', walletId: '@rafa_r', isFavorite: true },
  { id: '4', name: null, walletId: '@anon-843', initials: 'A8', isFavorite: false },
  { id: '5', name: 'Beatriz Costa', initials: 'BC', walletId: '@bia_c', isFavorite: false },
  { id: '6', name: 'Gabriela Lima', initials: 'GL', walletId: '@gabi_l', isFavorite: true },
  { id: '7', name: 'Thiago Martins', initials: 'TM', walletId: '@thiago_m', isFavorite: false },
  { id: '8', name: 'Aline Fonseca', initials: 'AF', walletId: '@aline_f', isFavorite: false },
  { id: '9', name: 'Bruno Dias', initials: 'BD', walletId: '@bruno_d', isFavorite: true },
  { id: '10', name: 'Júlia Vieira', initials: 'JV', walletId: '@julia_v', isFavorite: false },
];
