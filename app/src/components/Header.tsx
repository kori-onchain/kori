import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Image,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../constants/colors';

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: 'PF' | 'PJ';
  onSwitchAccount?: (newType: 'PF' | 'PJ') => void;
  onAddAccount?: () => void;
  onProfilePress?: () => void;
  onScanPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLogout,
  userName = 'Pedro Henrique',
  username = 'opedrooz',
  accountType = 'PF',
  onSwitchAccount,
  onAddAccount,
  onProfilePress,
  onScanPress,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<'userId' | 'wallet'>('userId');

  const userId = username;
  const walletHashFull = '7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a';
  const walletHashMin = `${walletHashFull.substring(0, 4)}...${walletHashFull.substring(walletHashFull.length - 4)}`;

  const baseName = userName
    .replace(' PJ', '')
    .replace(' PF', '')
    .replace(' Store', '')
    .replace(' Business', '')
    .replace(' Personal', '')
    .trim();
  const personalFirstName = baseName.split(' ')[0];
  const businessShortName = `${personalFirstName} Store`;

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setIsWalletDropdownOpen(false);
  };

  const handleSelect = (item: 'userId' | 'wallet') => {
    setSelectedItem(item);
    setIsWalletDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.profileWrapper}>
          <View style={styles.profileRowContainer}>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => {
                onProfilePress?.();
                setIsProfileDropdownOpen(false);
                setIsWalletDropdownOpen(false);
              }}
              activeOpacity={0.8}
            >
              {accountType === 'PF' ? (
                <LinearGradient
                  colors={['#7C3AED', '#4F46E5', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileGradient}
                >
                  <Text style={styles.profileTextGradient}>
                    {userName
                      ? userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                      : 'PH'}
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.profileText}>
                  {userName
                    ? userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'PH'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileChevronBtn}
              onPress={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsWalletDropdownOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Feather
                name={isProfileDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {isProfileDropdownOpen && (
            <View style={styles.profileDropdownMenu}>
              <TouchableOpacity
                style={[styles.accountOption, accountType === 'PF' && styles.accountOptionActive]}
                onPress={() => {
                  if (accountType !== 'PF') onSwitchAccount?.('PF');
                  setIsProfileDropdownOpen(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.accountIconCircle}>
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color={accountType === 'PF' ? COLORS.text : COLORS.textSecondary}
                  />
                </View>
                <Text
                  style={[styles.accountOptionText, accountType === 'PF' && styles.accountOptionTextActive]}
                  numberOfLines={1}
                >
                  {personalFirstName}
                </Text>
                {accountType === 'PF' && <Feather name="check" size={12} color={COLORS.primary} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.accountOption, accountType === 'PJ' && styles.accountOptionActive]}
                onPress={() => {
                  if (accountType !== 'PJ') onSwitchAccount?.('PJ');
                  setIsProfileDropdownOpen(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.accountIconCircle}>
                  <Ionicons
                    name="business-outline"
                    size={12}
                    color={accountType === 'PJ' ? COLORS.text : COLORS.textSecondary}
                  />
                </View>
                <Text
                  style={[styles.accountOptionText, accountType === 'PJ' && styles.accountOptionTextActive]}
                  numberOfLines={1}
                >
                  {businessShortName}
                </Text>
                {accountType === 'PJ' && <Feather name="check" size={12} color={COLORS.primary} />}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => {
              setIsWalletDropdownOpen(!isWalletDropdownOpen);
              setIsProfileDropdownOpen(false);
            }}
            activeOpacity={0.7}
          >
            {selectedItem === 'userId' ? (
              <Feather name="at-sign" size={16} color={COLORS.textSecondary} style={styles.walletIcon} />
            ) : (
              <Ionicons name="wallet-outline" size={16} color={COLORS.textSecondary} style={styles.walletIcon} />
            )}
            <Text style={styles.dropdownText}>
              {selectedItem === 'userId' ? userId : walletHashMin}
            </Text>
            <Feather
              name={isWalletDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={COLORS.textSecondary}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          {isWalletDropdownOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect('userId')}>
                <View style={styles.itemHeader}>
                  <Text style={styles.dropdownLabel}>User ID</Text>
                  {selectedItem === 'userId' && <Feather name="check" size={14} color={COLORS.primary} />}
                </View>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <View style={styles.koraLogo}>
                      <Text style={styles.koraLogoText}>K</Text>
                    </View>
                  </View>
                  <Text style={styles.dropdownValue}>@{userId}</Text>
                  <TouchableOpacity onPress={() => handleCopy(userId)} style={styles.copyBtn}>
                    <Feather name="copy" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.walletExplanation}>
                  Esta carteira está associada à sua identidade pública. Seu nome de usuário ficará visível a ambas as partes ao enviar ou receber valores.
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect('wallet')}>
                <View style={styles.itemHeader}>
                  <Text style={styles.dropdownLabel}>Wallet</Text>
                  {selectedItem === 'wallet' && <Feather name="check" size={14} color={COLORS.primary} />}
                </View>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={{ uri: 'https://cryptologos.cc/logos/solana-sol-logo.png' }}
                      style={styles.solanaLogo}
                    />
                  </View>
                  <Text style={styles.dropdownValueFull} numberOfLines={1} ellipsizeMode="middle">
                    {walletHashFull}
                  </Text>
                  <TouchableOpacity onPress={() => handleCopy(walletHashFull)} style={styles.copyBtn}>
                    <Feather name="copy" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.walletExplanation}>
                  Esta carteira utiliza um endereço criptográfico descentralizado. Garante anonimato absoluto, sem revelar dados de identidade em nenhuma transação.
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.scannerBtn} onPress={onScanPress} activeOpacity={0.7}>
          <MaterialCommunityIcons name="qrcode-scan" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 40,
    zIndex: 100,
  },
  profileWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 200,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextGradient: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scannerBtn: {
    position: 'absolute',
    right: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  centerContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletIcon: {
    marginRight: 6,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 6,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    backgroundColor: COLORS.surface,
    width: 320,
    left: '50%',
    marginLeft: -160,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 4,
  },
  walletExplanation: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 6,
    marginLeft: 40,
    opacity: 0.85,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
  },
  koraLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  koraLogoText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  solanaLogo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  dropdownValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownValueFull: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyBtn: {
    padding: 8,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  profileDropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    backgroundColor: COLORS.surface,
    width: 210,
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 300,
  },
  accountIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 4,
  },
  accountOptionActive: {
    backgroundColor: '#111111',
  },
  accountOptionText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  accountOptionTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  profileRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  profileChevronBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
