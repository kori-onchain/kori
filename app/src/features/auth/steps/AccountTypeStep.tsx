import React from "react";
import { Text, View } from "react-native";
import { ArrowRightIcon } from "../../../components/ds/icons";
import { AccountTypeCard } from "../components/AccountTypeCard";
import { AuthButton } from "../components/AuthButton";
import { AuthTopBar } from "../components/AuthTopBar";
import { AccountType } from "../types";

type AccountTypeStepProps = {
  selected: AccountType;
  onSelect: (type: AccountType) => void;
  onBack: () => void;
  onContinue: () => void;
};

export const AccountTypeStep: React.FC<AccountTypeStepProps> = ({
  selected,
  onSelect,
  onBack,
  onContinue,
}) => (
  <View className="flex-1 px-[22px] pb-6 pt-11">
    <AuthTopBar step="1 / 3" onBack={onBack} />
    <View className="mt-4">
      <Text className="font-sans-bold text-[23px] leading-[27px] tracking-[-0.6px] text-ink">
        Que tipo de conta?
      </Text>
      <Text className="mt-2 font-sans text-[13px] leading-5 text-ink-dim">
        Dá pra ter as duas e alternar quando quiser.
      </Text>
    </View>

    <View className="mt-7 gap-2.5">
      <AccountTypeCard type="PF" selected={selected === "PF"} onPress={() => onSelect("PF")} />
      <AccountTypeCard type="PJ" selected={selected === "PJ"} onPress={() => onSelect("PJ")} />
    </View>

    <View className="mt-auto">
      <AuthButton
        label="Continuar"
        onPress={onContinue}
        icon={<ArrowRightIcon size={17} color="#0a0a0a" />}
        iconPosition="right"
      />
    </View>
  </View>
);
