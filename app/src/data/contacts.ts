export type ContactChannel = 'pix' | 'kori';

export interface Contact {
  id: string;
  name: string | null;
  walletId: string;
  initials: string;
  isFavorite: boolean;
  channels: ContactChannel[];
  /** Chave PIX (CPF, e-mail, telefone ou aleatória) — presente se channels inclui 'pix' */
  pixKey?: string;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Maria Oliveira', initials: 'MO', walletId: '@mari_o', isFavorite: true, channels: ['pix', 'kori'], pixKey: 'maria.oliveira@email.com' },
  { id: '2', name: 'Lucas Silva', initials: 'LS', walletId: '@lucas_s', isFavorite: false, channels: ['kori'] },
  { id: '3', name: 'Rafael Rocha', initials: 'RR', walletId: '@rafa_r', isFavorite: true, channels: ['pix', 'kori'], pixKey: '123.456.789-00' },
  { id: '4', name: null, walletId: '@anon-843', initials: 'A8', isFavorite: false, channels: ['pix'], pixKey: '+5511999887766' },
  { id: '5', name: 'Beatriz Costa', initials: 'BC', walletId: '@bia_c', isFavorite: false, channels: ['pix', 'kori'], pixKey: 'beatriz.costa@email.com' },
  { id: '6', name: 'Gabriela Lima', initials: 'GL', walletId: '@gabi_l', isFavorite: true, channels: ['kori'] },
  { id: '7', name: 'Thiago Martins', initials: 'TM', walletId: '@thiago_m', isFavorite: false, channels: ['pix'], pixKey: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
  { id: '8', name: 'Aline Fonseca', initials: 'AF', walletId: '@aline_f', isFavorite: false, channels: ['pix', 'kori'], pixKey: 'aline.fonseca@email.com' },
  { id: '9', name: 'Bruno Dias', initials: 'BD', walletId: '@bruno_d', isFavorite: true, channels: ['kori'] },
  { id: '10', name: 'Júlia Vieira', initials: 'JV', walletId: '@julia_v', isFavorite: false, channels: ['pix', 'kori'], pixKey: '+5521988776655' },
];
