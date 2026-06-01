import React from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "@components/home/Header";
import { CardsPanel } from "@components/cards/CardsPanel";

interface CardsScreenProps {
  userName?: string;
  cardsState: {
    cards: any[];
    currentInvoice?: any;
    currentInvoices?: any[];
    cardsLoading?: boolean;
    cardsError?: string | null;
    onchainStatus?: string;
    toggleFreeze: (id: string) => void | Promise<void>;
    toggleOnline?: (id: string) => void | Promise<void>;
    updateLimit?: (id: string, newLimit: number) => void | Promise<void>;
    regenerateVirtual?: (id: string) => void | Promise<void>;
    payCurrentInvoice?: (invoiceId?: string) => Promise<any>;
  };
  headerProps: any;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({
  userName,
  cardsState,
  headerProps,
}) => {
  return (
    <View style={styles.panelWrapper}>
      <View style={styles.headerWrap}>
        <View style={styles.headerLayer}>
          <Header {...headerProps} />
        </View>
      </View>
      <CardsPanel userName={userName} cardsState={cardsState} />
    </View>
  );
};

const styles = StyleSheet.create({
  panelWrapper: {
    flex: 1,
    paddingTop: 12,
  },
  headerWrap: {
    paddingHorizontal: 20,
  },
  headerLayer: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
});
export default CardsScreen;
