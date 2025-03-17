
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBridgeOrder } from "@/hooks/useBridgeOrder";
import { useOrderStatusPolling } from "@/hooks/useOrderStatusPolling";
import { useBridgeDeepLink } from "@/hooks/useBridgeDeepLink";
import { SimulationHandler } from "@/components/bridge/SimulationHandler";
import { OrderParameterValidator } from "@/components/bridge/OrderParameterValidator";
import { ApiStatusMonitor } from "@/components/bridge/ApiStatusMonitor";
import { BridgeStatusRenderer } from "@/components/bridge/BridgeStatusRenderer";
import { toast } from "sonner";

const BridgeAwaitingDeposit = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token") || "";
  
  const [simulateSuccess, setSimulateSuccess] = useState(false);
  const [apiAttempted, setApiAttempted] = useState(false);
  const [transactionSaved, setTransactionSaved] = useState(false);
  const [statusCheckDebugInfo, setStatusCheckDebugInfo] = useState(null);
  
  // Load order details from the bridge API
  const { 
    orderDetails: originalOrderDetails, 
    loading, 
    error, 
    handleCopyAddress 
  } = useBridgeOrder(
    orderId, 
    token,
    true, // Always try to fetch from API
    true  // Force API check even if we have local data
  );
  
  const [orderDetails, setOrderDetails] = useState(originalOrderDetails);
  
  // Process deep links for transaction status updates
  useBridgeDeepLink();

  // Handle order completion
  const handleTransactionComplete = (details, apiResponse) => {
    console.log("Transaction complete callback triggered", {
      details,
      apiResponse,
      transactionSaved
    });
    
    // The actual saving logic is now in the CompletedTransactionSaver component
    // This function is just for additional logging or future extensibility
  };

  // Use custom hook for order status polling
  const { statusCheckError, checkOrderStatus } = useOrderStatusPolling({
    orderId,
    token,
    originalOrderDetails,
    setOrderDetails,
    onTransactionComplete: handleTransactionComplete,
    setStatusCheckDebugInfo
  });
  
  // Emergency handlers
  const handleEmergencyExchange = () => {
    toast.info("Initiating emergency exchange...", {
      description: "This feature is currently in development."
    });
    
    console.log("Emergency exchange requested for order:", orderId);
    
    // In the future, we would call an API endpoint here to handle the emergency exchange
  };
  
  const handleEmergencyRefund = () => {
    toast.info("Initiating emergency refund...", {
      description: "This feature is currently in development."
    });
    
    console.log("Emergency refund requested for order:", orderId);
    
    // In the future, we would call an API endpoint here to handle the emergency refund
  };

  return (
    <>
      <OrderParameterValidator orderId={orderId} token={token} />
      
      <ApiStatusMonitor
        apiAttempted={apiAttempted}
        setApiAttempted={setApiAttempted}
        loading={loading}
        error={error}
        orderDetails={orderDetails}
      />
      
      <SimulationHandler
        simulateSuccess={simulateSuccess}
        setSimulateSuccess={setSimulateSuccess}
        originalOrderDetails={originalOrderDetails}
        setOrderDetails={setOrderDetails}
      />
      
      <BridgeStatusRenderer
        loading={loading}
        error={error}
        orderDetails={orderDetails}
        handleCopyAddress={handleCopyAddress}
        statusCheckDebugInfo={statusCheckDebugInfo}
        simulateSuccess={simulateSuccess}
        originalOrderDetails={originalOrderDetails}
        token={token}
        transactionSaved={transactionSaved}
        setTransactionSaved={setTransactionSaved}
        checkOrderStatus={() => checkOrderStatus && checkOrderStatus(true)}
        onEmergencyExchange={handleEmergencyExchange}
        onEmergencyRefund={handleEmergencyRefund}
      />
    </>
  );
};

export default BridgeAwaitingDeposit;
