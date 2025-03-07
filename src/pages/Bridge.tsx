
import { useBridge } from "@/contexts/BridgeContext";
import { BridgeHeader } from "@/components/bridge/BridgeHeader";
import { BridgeForm } from "@/components/bridge/BridgeForm";
import { FAQSection } from "@/components/bridge/FAQSection";
import { useEffect } from "react";

const Bridge = () => {
  const { isLoadingCurrencies, availableCurrencies, refreshCurrencies } = useBridge();

  useEffect(() => {
    // Fetch currencies when the component mounts
    refreshCurrencies();
    console.log("Bridge component mounted, fetching currencies...");
  }, [refreshCurrencies]);

  useEffect(() => {
    // Log currencies when they're loaded
    if (availableCurrencies.length > 0) {
      console.log("Currencies loaded:", availableCurrencies.length);
    }
  }, [availableCurrencies]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-16 sm:pt-24 px-4 sm:px-8 pb-16 sm:pb-24">
      <div className="max-w-3xl mx-auto">
        <BridgeHeader />
        <BridgeForm />
        <FAQSection />
      </div>
    </div>
  );
};

export default Bridge;
