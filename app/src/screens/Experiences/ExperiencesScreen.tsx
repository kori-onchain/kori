import React from "react";
import { View, StyleSheet } from "react-native";
import { Header } from "@components/home/Header";
import { ExperiencesPanel } from "@components/experiences/ExperiencesPanel";

interface ExperiencesScreenProps {
  headerProps: any;
}

export const ExperiencesScreen: React.FC<ExperiencesScreenProps> = ({
  headerProps,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerLayer}>
        <Header {...headerProps} />
      </View>
      <ExperiencesPanel />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
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
