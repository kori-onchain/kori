import { useState } from "react";

export type SecurityMethod = "digital" | "facial" | "pin";

interface UseSecuritySetupLogicParams {
  userName: string;
  onComplete: (method: SecurityMethod | "none", pinCode?: string) => void;
}

export const useSecuritySetupLogic = ({ userName, onComplete }: UseSecuritySetupLogicParams) => {
  const [selectedMethod, setSelectedMethod] = useState<SecurityMethod>("digital");
  const [setupStep, setSetupStep] = useState<"select" | "simulating" | "pin_input">("select");
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState<string[]>([]);
  const [pinConfirm, setPinConfirm] = useState<string[]>([]);
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [pinError, setPinError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleSelectMethod = (method: SecurityMethod) => {
    setSelectedMethod(method);
    setPinError(null);
  };

  const handleNext = () => {
    if (selectedMethod === "pin") {
      setSetupStep("pin_input");
      setPinStep("enter");
      setPin([]);
    } else {
      setSetupStep("simulating");
      setScanProgress(0);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.2;
        setScanProgress(progress);
        if (progress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(selectedMethod);
          }, 600);
        }
      }, 300);
    }
  };

  const handleKeyPress = (num: string) => {
    setPinError(null);
    if (pin.length < 5) {
      const newPin = [...pin, num];
      setPin(newPin);

      if (newPin.length === 5) {
        if (pinStep === "enter") {
          setTimeout(() => {
            setPinStep("confirm");
            setPinConfirm(newPin);
            setPin([]);
          }, 300);
        } else {
          const matching = pinConfirm.every((val, index) => val === newPin[index]);
          if (matching) {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              onComplete("pin", newPin.join(""));
            }, 1000);
          } else {
            setTimeout(() => {
              setPinError("Os PINs inseridos não coincidem. Tente novamente.");
              setPinStep("enter");
              setPin([]);
              setPinConfirm([]);
            }, 300);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const firstName = userName ? userName.split(" ")[0] : "";

  const strings = {
    title: "Proteja sua Carteira",
    subtitle: `Olá ${firstName}, escolha uma das opções abaixo para ativar a proteção no seu app.`,
    buttonLabel: "Configurar Segurança",
    biometrics: {
      digitalTitle: "Biometria Digital",
      digitalDesc: "Utilize sua impressão digital para acessar o app de forma ultra rápida.",
      facialTitle: "Reconhecimento Facial",
      facialDesc: "Acesse sua conta em segundos apenas olhando para o seu dispositivo.",
      pinTitle: "PIN de Segurança",
      pinDesc: "Defina uma senha numérica exclusiva de 5 dígitos para autorizações.",
    },
    simulating: {
      activatingDigital: "Ativando Touch ID...",
      activatedDigital: "Biometria Ativada!",
      activatingFacial: "Ativando Face ID...",
      activatedFacial: "Reconhecimento Facial Ativado!",
      descSimulating: "Simulando a integração segura com os sensores biométricos do seu smartphone.",
      descActivated: "Sua carteira Kori está protegida com criptografia nativa de ponta.",
    },
    pinSetup: {
      enterTitle: "Defina seu PIN",
      confirmTitle: "Confirme seu PIN",
      enterDesc: "Crie uma senha numérica de 5 dígitos para acessos e transações.",
      confirmDesc: "Insira novamente a senha numérica para confirmação.",
    },
  };

  return {
    selectedMethod,
    setupStep,
    setSetupStep,
    loading,
    pin,
    pinStep,
    pinError,
    scanProgress,
    handleSelectMethod,
    handleNext,
    handleKeyPress,
    handleDelete,
    strings,
  };
};
