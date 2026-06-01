import React from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "@components/home/Header";
import { InvestmentsPanel } from "@components/investments/InvestmentsPanel";

interface InvestmentsScreenProps {
  headerProps: any;
  onInvested?: (amountCents: number) => void;
}

export const InvestmentsScreen: React.FC<InvestmentsScreenProps> = ({
  headerProps,
  onInvested,
}) => {
  return (
    <View style={styles.panelWrapper}>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.headerLayer}>
          <Header {...headerProps} />
        </View>
      </View>
      <InvestmentsPanel onInvested={onInvested} />
    </View>
  );
};

const styles = StyleSheet.create({
  panelWrapper: {
    flex: 1,
    paddingTop: 12,
  },
  headerLayer: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },
});
export default InvestmentsScreen;
