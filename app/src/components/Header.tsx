import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { fonts, radii } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { KoraLogo } from './ds/KoraLogo';
import { AccountSwitch } from './ds/AccountSwitch';
import {
  ChevronRightIcon,
  CopyIcon,
  KoraGlyph,
  SolanaIcon,
} from './ds/icons';

type IdentityKind = 'userId' | 'wallet';

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: 'PF' | 'PJ';
  onSwitchAccount?: (newType: 'PF' | 'PJ') => void;
  onAddAccount?: () => void;
  onProfilePress?: () => void;
  onScanPress?: () => void;
  /** Currently selected identity (User ID / Wallet) — drives the wallet line in BalanceHero. */
  identity?: IdentityKind;
  onSelectIdentity?: (id: IdentityKind) => void;
  userHandle?: string;
  walletHashFull?: string;
  walletHashShort?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Pedro Henrique',
  accountType = 'PF',
  onSwitchAccount,
  onProfilePress,
  identity = 'wallet',
  onSelectIdentity,
  userHandle = '@opedrooz',
  walletHashFull = '7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a',
  walletHashShort = '7nxB...4X1a',
}) => {
  const { t } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const baseName = userName
    .replace(' PJ', '')
    .replace(' PF', '')
    .replace(' Store', '')
    .replace(' Business', '')
    .replace(' Personal', '')
    .trim();
  const personalFirstName = baseName.split(' ')[0];
  const businessShortName = `${personalFirstName} Store`;

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'PH';

  const togglePopover = () => {
    setIsProfileDropdownOpen((v) => !v);
  };

  const copy = (text: string) => {
    Clipboard.setStringAsync(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <KoraLogo size={22} color={t.ink} />
        </View>

        <View style={styles.right}>
          <AccountSwitch
            initials={initials}
            expanded={isProfileDropdownOpen}
            onPress={togglePopover}
            isPJ={accountType === 'PJ'}
          />
        </View>
      </View>

      {isProfileDropdownOpen && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: t.bg2,
              borderColor: t.cardBorder,
              shadowColor: '#000',
              elevation: t.cardElevStrong,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: t.inkMute }]}>CONTA</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setIsProfileDropdownOpen(false);
              onProfilePress?.();
            }}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <KoraGlyph size={13} color={t.ink} />
            </View>
            <Text style={[styles.rowText, { color: t.ink }]} numberOfLines={1}>
              Ver perfil
            </Text>
            <ChevronRightIcon size={12} color={t.inkDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              accountType === 'PF' && { backgroundColor: t.bgElev },
            ]}
            onPress={() => {
              if (accountType !== 'PF') onSwitchAccount?.('PF');
              setIsProfileDropdownOpen(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.rowIcon} />
            <Text
              style={[
                styles.rowText,
                { color: accountType === 'PF' ? t.ink : t.inkDim },
                accountType === 'PF' && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {personalFirstName}
            </Text>
            {accountType === 'PF' && (
              <ChevronRightIcon size={12} color={t.orange} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              accountType === 'PJ' && { backgroundColor: t.bgElev },
            ]}
            onPress={() => {
              if (accountType !== 'PJ') onSwitchAccount?.('PJ');
              setIsProfileDropdownOpen(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.rowIcon} />
            <Text
              style={[
                styles.rowText,
                { color: accountType === 'PJ' ? t.ink : t.inkDim },
                accountType === 'PJ' && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {businessShortName}
            </Text>
            {accountType === 'PJ' && (
              <ChevronRightIcon size={12} color={t.orange} />
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: t.line }]} />
          <Text style={[styles.sectionLabel, { color: t.inkMute }]}>IDENTIDADE</Text>

          {/* USER ID */}
          <TouchableOpacity
            style={[
              styles.row,
              identity === 'userId' && { backgroundColor: t.bgElev },
            ]}
            onPress={() => onSelectIdentity?.('userId')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <KoraGlyph size={14} color={t.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={[styles.identityLabel, { color: t.inkMute }]}>
                USER ID
              </Text>
              <Text
                style={[styles.identityValue, { color: t.ink }]}
                numberOfLines={1}
              >
                {userHandle}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => copy(userHandle)}
              style={styles.copyBtn}
              activeOpacity={0.7}
            >
              <CopyIcon size={14} color={t.inkDim} strokeWidth={1.6} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* WALLET (Solana) */}
          <TouchableOpacity
            style={[
              styles.row,
              identity === 'wallet' && { backgroundColor: t.bgElev },
            ]}
            onPress={() => onSelectIdentity?.('wallet')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: t.bgElev, borderColor: t.line },
              ]}
            >
              <SolanaIcon width={14} height={11} color={t.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={[styles.identityLabel, { color: t.inkMute }]}>
                WALLET
              </Text>
              <Text
                style={[styles.identityValue, { color: t.ink }]}
                numberOfLines={1}
              >
                {walletHashShort}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => copy(walletHashFull)}
              style={styles.copyBtn}
              activeOpacity={0.7}
            >
              <CopyIcon size={14} color={t.inkDim} strokeWidth={1.6} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    position: 'relative',
    zIndex: 1000,
    elevation: 1000,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    zIndex: 1001,
    elevation: 1001,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 270,
    borderRadius: radii.card,
    padding: 10,
    borderWidth: 1,
    zIndex: 2000,
    elevation: 2000,
  },
  sectionLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 2,
    gap: 8,
  },
  rowIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  rowTextActive: {
    fontFamily: fonts.sans.semibold,
  },

  divider: {
    height: 1,
    marginVertical: 8,
  },

  identityText: {
    flex: 1,
  },
  identityLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.0,
  },
  identityValue: {
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    marginTop: 1,
    letterSpacing: 0.3,
  },
  copyBtn: {
    padding: 6,
  },
});
