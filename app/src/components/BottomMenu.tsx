import React, { useState } from 'react';
import { BottomNav, BottomNavTab } from './ds/BottomNav';

interface BottomMenuProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onScanPress?: () => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  onScanPress,
}) => {
  const [internalActiveTab, internalSetActiveTab] = useState<string>('inicio');

  const activeTab = (externalActiveTab !== undefined
    ? externalActiveTab
    : internalActiveTab) as BottomNavTab;
  const setActiveTab = externalSetActiveTab ?? internalSetActiveTab;

  return (
    <BottomNav
      activeTab={activeTab}
      onChange={setActiveTab}
      onScanPress={onScanPress}
    />
  );
};
