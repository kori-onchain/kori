import React from 'react';
import { BiometricScreen } from '../FactoringDS';

interface InvestBiometricScreenProps {
  amountBRL: string;
  poolName: string;
  onComplete: () => void;
}

export const InvestBiometricScreen: React.FC<InvestBiometricScreenProps> = ({
  amountBRL,
  poolName,
  onComplete,
}) => {
  return (
    <BiometricScreen
      title="Confirmar depósito"
      subtitle={`R$ ${amountBRL} → Pool ${poolName}`}
      explanationItems={[
        'USDC vai pro vault do contrato',
        'Posição registrada on-chain',
        'Rendimento acumula automático',
      ]}
      onComplete={onComplete}
    />
  );
};
