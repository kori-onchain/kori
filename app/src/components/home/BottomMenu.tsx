import React, { useState } from "react";
import { BottomNav, BottomNavTab } from "@components/layout/BottomNav";

interface BottomMenuProps {
  accountType?: "PF" | "PJ";
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onScanPress?: () => void;
  onStorePress?: () => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
  accountType,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  onScanPress,
  onStorePress,
}) => {
  const [internalActiveTab, internalSetActiveTab] = useState<string>("inicio");

  const activeTab = (
    externalActiveTab !== undefined ? externalActiveTab : internalActiveTab
  ) as BottomNavTab;
  const setActiveTab = externalSetActiveTab ?? internalSetActiveTab;

  return (
    <BottomNav
      accountType={accountType}
      activeTab={activeTab}
      onChange={setActiveTab}
      onScanPress={onScanPress}
      onStorePress={onStorePress}
    />
  );
};
