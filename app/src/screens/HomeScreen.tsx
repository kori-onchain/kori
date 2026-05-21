import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { Balance } from '../components/Balance';
import { CryptoInvestments } from '../components/CryptoInvestments';
import { RecentContacts } from '../components/RecentContacts';
import { ContactsModal } from '../components/ContactsModal';
import { AddContactModal } from '../components/AddContactModal';
import { TransactionsModal } from '../components/TransactionsModal';
import { PromoBanner } from '../components/PromoBanner';
import { Transactions } from '../components/Transactions';
import { BottomMenu } from '../components/BottomMenu';
import { CardsPanel } from '../components/CardsPanel';
import { InvestmentsPanel } from '../components/InvestmentsPanel';
import { ExperiencesPanel } from '../components/ExperiencesPanel';
import { ProfileModal } from '../components/ProfileModal';
import { SendModal } from '../components/payment/SendModal';
import { PaymentIntent, PaymentScreen } from '../types/payment';
import { useContacts } from '../hooks/useContacts';
import { useModals } from '../hooks/useModals';

interface HomeScreenProps {
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: 'PF' | 'PJ';
  onSwitchAccount?: (newType: 'PF' | 'PJ') => void;
  onAddAccount?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogout,
  userName,
  username,
  accountType,
  onSwitchAccount,
  onAddAccount,
}) => {
  const { contacts, addContact } = useContacts();
  const { modals, open, close } = useModals();
  const [activeTab, setActiveTab] = useState('inicio');
  const [sendIntent, setSendIntent] = useState<Partial<PaymentIntent>>({});
  const [sendInitialScreen, setSendInitialScreen] = useState<PaymentScreen>('scan');

  const handleContactPress = (contact: any) => {
    setSendIntent({
      recipient: {
        type: 'id',
        displayName: contact.name || contact.walletId.replace('@', ''),
        userId: contact.walletId,
        isAnonymous: false,
        isFavorite: contact.isFavorite,
        id: contact.id,
      },
      currency: 'BRL',
    });
    setSendInitialScreen('amount');
    open('sendPayment');
  };

  const headerProps = {
    onLogout,
    userName,
    username,
    accountType,
    onSwitchAccount,
    onAddAccount,
    onProfilePress: () => open('profile'),
    onScanPress: () => {
      setSendIntent({}); // Reset intent para abrir no modo scanner puro
      setSendInitialScreen('scan');
      open('sendPayment');
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={true} />

      {activeTab === 'cartao' ? (
        <View style={styles.panelWrapper}>
          <Header {...headerProps} />
          <CardsPanel userName={userName} />
        </View>
      ) : activeTab === 'investimentos' ? (
        <View style={styles.panelWrapper}>
          <Header {...headerProps} />
          <InvestmentsPanel />
        </View>
      ) : activeTab === 'experiencias' ? (
        <View style={styles.panelWrapper}>
          <Header {...headerProps} />
          <ExperiencesPanel />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Header {...headerProps} />
          <Balance onSendPress={() => {
            setSendIntent({});
            setSendInitialScreen('manual');
            open('sendPayment');
          }} />
          <PromoBanner />
          <RecentContacts
            contacts={contacts.slice(0, 6)}
            onSeeAll={() => open('contacts')}
            onInvite={() => open('addContact')}
            onContactPress={handleContactPress}
          />
          <Transactions onSeeAll={() => open('transactions')} />
          <CryptoInvestments />
        </ScrollView>
      )}

      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      <ContactsModal
        visible={modals.contacts}
        contacts={contacts}
        onClose={() => close('contacts')}
        onAddPress={() => open('addContact')}
        onContactPress={(contact) => {
          close('contacts');
          handleContactPress(contact);
        }}
      />

      <AddContactModal
        visible={modals.addContact}
        onClose={() => close('addContact')}
        onSave={addContact}
      />

      <TransactionsModal
        visible={modals.transactions}
        onClose={() => close('transactions')}
      />

      <ProfileModal
        visible={modals.profile}
        onClose={() => close('profile')}
        userName={userName}
        accountType={accountType}
      />

      <SendModal
        visible={modals.sendPayment}
        onClose={() => close('sendPayment')}
        initialScreen={sendInitialScreen}
        initialIntent={sendIntent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 24,
  },
  panelWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
});
