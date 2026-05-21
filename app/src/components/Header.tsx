import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radii } from '../theme/tokens';
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
    onProfilePress?.();
    setIsProfileDropdownOpen((v) => !v);
  };

  const copy = (text: string) => {
    Clipboard.setStringAsync(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <KoraLogo size={22} color={colors.ink} />
        </View>

        <View style={styles.right}>
          <AccountSwitch
            initials={initials}
            expanded={isProfileDropdownOpen}
            onPress={togglePopover}
          />
        </View>
      </View>

      {isProfileDropdownOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.sectionLabel}>CONTA</Text>

          <TouchableOpacity
            style={[
              styles.row,
              accountType === 'PF' && styles.rowActive,
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
                accountType === 'PF' && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {personalFirstName}
            </Text>
            {accountType === 'PF' && (
              <ChevronRightIcon size={12} color={colors.orange} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.row,
              accountType === 'PJ' && styles.rowActive,
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
                accountType === 'PJ' && styles.rowTextActive,
              ]}
              numberOfLines={1}
            >
              {businessShortName}
            </Text>
            {accountType === 'PJ' && (
              <ChevronRightIcon size={12} color={colors.orange} />
            )}
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>IDENTIDADE</Text>

          {/* USER ID */}
          <TouchableOpacity
            style={[
              styles.row,
              identity === 'userId' && styles.rowActive,
            ]}
            onPress={() => onSelectIdentity?.('userId')}
            activeOpacity={0.85}
          >
            <View style={styles.rowIcon}>
              <KoraGlyph size={14} color={colors.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={styles.identityLabel}>USER ID</Text>
              <Text style={styles.identityValue} numberOfLines={1}>
                {userHandle}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => copy(userHandle)}
              style={styles.copyBtn}
              activeOpacity={0.7}
            >
              <CopyIcon size={14} color={colors.inkDim} strokeWidth={1.6} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* WALLET (Solana) */}
          <TouchableOpacity
            style={[
              styles.row,
              identity === 'wallet' && styles.rowActive,
            ]}
            onPress={() => onSelectIdentity?.('wallet')}
            activeOpacity={0.85}
          >
            <View style={styles.rowIcon}>
              <SolanaIcon width={14} height={11} color={colors.ink} />
            </View>
            <View style={styles.identityText}>
              <Text style={styles.identityLabel}>WALLET</Text>
              <Text style={styles.identityValue} numberOfLines={1}>
                {walletHashShort}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => copy(walletHashFull)}
              style={styles.copyBtn}
              activeOpacity={0.7}
            >
              <CopyIcon size={14} color={colors.inkDim} strokeWidth={1.6} />
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
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    zIndex: 100,
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
    backgroundColor: colors.bg2,
    width: 270,
    borderRadius: radii.card,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.line,
    elevation: 8,
    zIndex: 300,
  },
  sectionLabel: {
    color: colors.inkMute,
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
  rowActive: {
    backgroundColor: colors.bgElev,
  },
  rowIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.bgElev,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    color: colors.inkDim,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  rowTextActive: {
    color: colors.ink,
    fontFamily: fonts.sans.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 8,
  },

  identityText: {
    flex: 1,
  },
  identityLabel: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.0,
  },
  identityValue: {
    color: colors.ink,
    fontFamily: fonts.mono.medium,
    fontSize: 12,
    marginTop: 1,
    letterSpacing: 0.3,
  },
  copyBtn: {
    padding: 6,
  },
});
