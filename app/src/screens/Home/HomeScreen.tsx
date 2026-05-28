import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { useTheme } from "@theme/ThemeProvider";
import { useHomeLogic } from "@hooks/useHomeLogic";
import { Header } from "@components/home/Header";
import { Balance } from "@components/home/Balance";
import { NftHoldings } from "@components/home/NftHoldings";
import { CreditCardSection } from "@components/home/CreditCardSection";
import { BottomMenu } from "@components/home/BottomMenu";
import { Transactions } from "@components/home/Transactions";
import { CardsScreen } from "@screens/Cards/CardsScreen";
import { InvestmentsScreen } from "@screens/Investments/InvestmentsScreen";
import { ExperiencesScreen } from "@screens/Experiences/ExperiencesScreen";
import { MerchantScreen } from "@screens/Merchant/MerchantScreen";
import { AntecipacoesScreen } from "@screens/Merchant/AntecipacoesScreen";

import { ContactsModal } from "@components/home/modals/ContactsModal";
import { AddContactModal } from "@components/home/modals/AddContactModal";
import { TransactionsModal } from "@components/home/modals/TransactionsModal";
import { ProfileModal } from "@components/home/modals/ProfileModal";
import { SendModal } from "@components/home/modals/SendModal";
import { IdentityNoticeDrawer } from "@components/home/drawers/IdentityNoticeDrawer";

interface HomeScreenProps {
  onLogout?: () => void;
  userName?: string;
  username?: string;
  accountType?: "PF" | "PJ";
  onSwitchAccount?: (newType: "PF" | "PJ") => void;
  onAddAccount?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> & {
  Container: React.FC<{ children: React.ReactNode; bg: string; barStyle: any }>;
  Content: React.FC<{
    activeTab: string;
    header: React.ReactNode;
    children: React.ReactNode;
  }>;
} = ({
  onLogout,
  userName,
  username,
  accountType,
  onSwitchAccount,
  onAddAccount,
}) => {
  const { scheme, t } = useTheme();
  const {
    contacts,
    addContact,
    modals,
    open,
    close,
    cards,
    toggleFreeze,
    transactions,
    activeTab,
    setActiveTab,
    sendIntent,
    sendInitialScreen,
    identity,
    pendingIdentity,
    isNoticeVisible,
    setIsNoticeVisible,
    reduceMotion,
    handleSelectIdentity,
    handleConfirmNotice,
    handleCancelNotice,
    handleContactPress,
    handleScanPress,
    handleSendManualPress,
    walletHashFull,
    walletHashShort,
    userHandle,
    balanceInteger,
    balanceDecimals,
    handleAdvanceCredited,
  } = useHomeLogic({ username, accountType });

  const headerProps = {
    onLogout,
    userName,
    username,
    accountType,
    onSwitchAccount,
    onAddAccount,
    onProfilePress: () => open("profile"),
    onScanPress: handleScanPress,
    identity,
    onSelectIdentity: handleSelectIdentity,
    userHandle,
    walletHashFull,
    walletHashShort,
  };

  const fadeUp = useMemo(() => {
    if (reduceMotion) return undefined;
    return (delay: number) =>
      FadeInDown.duration(550)
        .delay(delay)
        .easing(Easing.bezier(0.16, 1, 0.3, 1));
  }, [reduceMotion]);

  const entering = (delay: number) => (fadeUp ? fadeUp(delay) : undefined);

  return (
    <HomeScreen.Container bg={t.bg} barStyle={t.statusBar} key={scheme}>
      {activeTab === "cartao" && (
        <CardsScreen
          userName={userName}
          cardsState={{ cards, toggleFreeze }}
          headerProps={headerProps}
        />
      )}

      {activeTab === "investimentos" && (
        <InvestmentsScreen headerProps={headerProps} />
      )}

      {activeTab === "experiencias" && accountType === "PF" && (
        <ExperiencesScreen headerProps={headerProps} />
      )}

      {/* PJ: inicio = MerchantScreen (home com balance + dashboard) */}
      {accountType === "PJ" && activeTab === "inicio" && (
        <MerchantScreen
          headerProps={headerProps}
          onSendPress={handleSendManualPress}
          onSeeAllTransactions={() => open("transactions")}
          transactions={transactions}
          identity={identity}
          userHandle={userHandle}
          walletHashFull={walletHashFull}
          walletHashShort={walletHashShort}
          balanceInteger={balanceInteger}
          balanceDecimals={balanceDecimals}
        />
      )}

      {/* PJ: vitrine = EcommercePanel separado */}
      {accountType === "PJ" && activeTab === "vitrine" && (
        <MerchantScreen
          headerProps={headerProps}
          initialView="ecommerce"
          onSendPress={handleSendManualPress}
          onSeeAllTransactions={() => open("transactions")}
          transactions={transactions}
          identity={identity}
          userHandle={userHandle}
          walletHashFull={walletHashFull}
          walletHashShort={walletHashShort}
          balanceInteger={balanceInteger}
          balanceDecimals={balanceDecimals}
        />
      )}

      {/* PJ: antecipacao */}
      {accountType === "PJ" && activeTab === "antecipacao" && (
        <AntecipacoesScreen
          headerProps={headerProps}
          onAdvanceCredited={handleAdvanceCredited}
        />
      )}

     {activeTab === "inicio" && accountType === "PF" && (
        <ScrollView
          style={[styles.scroller, { backgroundColor: t.bg }]}
          contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
          bounces
          alwaysBounceVertical
          overScrollMode="always"
        >
          <Animated.View entering={entering(40)} style={styles.headerLayer}>
            <Header {...headerProps} />
          </Animated.View>

          <Balance
            identity={identity}
            pendingIdentity={pendingIdentity}
            userHandle={userHandle}
            walletHashFull={walletHashFull}
            walletHashShort={walletHashShort}
            balanceInteger={balanceInteger}
            balanceDecimals={balanceDecimals}
            balanceEntering={entering(120)}
            actionsEntering={entering(180)}
            onSendPress={handleSendManualPress}
            accountType={accountType}
            onSelectIdentity={handleSelectIdentity}
          />

          <Animated.View entering={entering(220)}>
            <NftHoldings onSeeAll={() => open("contacts")} />
          </Animated.View>

          <Animated.View entering={entering(260)}>
            <CreditCardSection
              userName={userName}
              cards={cards}
              onToggleLock={toggleFreeze}
              onSeeMore={() => setActiveTab("cartao")}
              onInvoicePress={() => setActiveTab("cartao")}
            />
          </Animated.View>

          <Animated.View entering={entering(320)}>
            <Transactions
              transactions={transactions}
              onSeeAll={() => open("transactions")}
            />
          </Animated.View>
        </ScrollView>
      )}

      <BottomMenu
        accountType={accountType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onScanPress={handleScanPress}
      />

      <ContactsModal
        visible={modals.contacts}
        contacts={contacts}
        onClose={() => close("contacts")}
        onAddPress={() => open("addContact")}
        onContactPress={(contact) => {
          close("contacts");
          handleContactPress(contact);
        }}
      />

      <AddContactModal
        visible={modals.addContact}
        onClose={() => close("addContact")}
        onSave={addContact}
      />

      <TransactionsModal
        visible={modals.transactions}
        onClose={() => close("transactions")}
      />

      <ProfileModal
        visible={modals.profile}
        onClose={() => close("profile")}
        onLogout={onLogout}
        userName={userName}
        username={username}
        accountType={accountType}
      />

      <SendModal
        visible={modals.sendPayment}
        onClose={() => close("sendPayment")}
        initialScreen={sendInitialScreen}
        initialIntent={sendIntent}
        contacts={contacts}
        onAddContact={addContact}
      />

      <IdentityNoticeDrawer
        visible={isNoticeVisible}
        onClose={handleCancelNotice}
        identityType={identity === "wallet" ? "userId" : "wallet"}
        onConfirm={handleConfirmNotice}
      />
    </HomeScreen.Container>
  );
};

const HomeScreenContainer: React.FC<{
  children: React.ReactNode;
  bg: string;
  barStyle: any;
}> = ({ children, bg, barStyle }) => (
  <View style={[styles.root, { backgroundColor: bg }]}>
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar barStyle={barStyle} backgroundColor={bg} translucent />
      {children}
    </SafeAreaView>
  </View>
);

const HomeScreenContent: React.FC<{
  activeTab: string;
  header: React.ReactNode;
  children: React.ReactNode;
}> = ({ header, children }) => (
  <View style={styles.panelWrapper}>
    <View style={styles.headerLayer}>{header}</View>
    {children}
  </View>
);

HomeScreen.Container = HomeScreenContainer;
HomeScreen.Content = HomeScreenContent;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scroller: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  panelWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerLayer: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
});
