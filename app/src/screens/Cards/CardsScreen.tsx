import React from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "@components/home/Header";
import { CardsPanel } from "@components/cards/CardsPanel";

interface CardsScreenProps {
  userName?: string;
  cardsState: {
    cards: any[];
    toggleFreeze: (id: string) => void;
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
      <View style={styles.headerLayer}>
        <Header {...headerProps} />
      </View>
      <CardsPanel userName={userName} cardsState={cardsState} />
    </View>
  );
};

const styles = StyleSheet.create({
  panelWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerLayer: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
});
export default CardsScreen;
