import React from 'react';
import { BiometricScreen } from '../FactoringDS';

interface MerchantBiometricScreenProps {
  receivedBRL: string;
  onComplete: () => void;
}

export const MerchantBiometricScreen: React.FC<MerchantBiometricScreenProps> = ({
  receivedBRL,
  onComplete,
}) => {
  return (
    <BiometricScreen
      title="Confirmar"
      subtitle={`R$ ${receivedBRL} → Sua Conta`}
      explanationItems={[
        'Nota registrada no contrato',
        'Pool envia R$ 970 pra você',
        'Liquidação automática no vencimento',
      ]}
      onComplete={onComplete}
    />
  );
};
