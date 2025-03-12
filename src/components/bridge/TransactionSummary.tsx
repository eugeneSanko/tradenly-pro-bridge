
import { ArrowRight } from "lucide-react";
import { AddressPlaceholder } from "./AddressPlaceholder";

interface TransactionSummaryProps {
  fromCurrency: string;
  toCurrency: string;
  fromCurrencyName?: string;
  toCurrencyName?: string;
  amount: string;
  destinationAddress: string;
  receiveAmount?: string;
  orderType?: "fixed" | "float";
  depositAddress?: string;
}

export const TransactionSummary = ({
  fromCurrency,
  toCurrency,
  fromCurrencyName,
  toCurrencyName,
  amount,
  destinationAddress,
  receiveAmount,
  orderType = "fixed",
  depositAddress = "",
}: TransactionSummaryProps) => {
  const getCurrencyIcon = (currency: string) => {
    const lowerCurrency = currency.toLowerCase();
    if (lowerCurrency === "btc") return "₿";
    if (lowerCurrency === "eth") return "Ξ";
    if (lowerCurrency === "sol") return "◎";
    return currency.toUpperCase().substring(0, 1);
  };

  const getCurrencyImageUrl = (currency: string) => {
    const lowerCurrency = currency.toLowerCase();

    if (lowerCurrency === "btc")
      return "https://ff.io/assets/images/coins/svg/btc.svg";
    if (lowerCurrency === "eth")
      return "https://ff.io/assets/images/coins/svg/eth_dark.svg";
    if (lowerCurrency === "sol")
      return "https://ff.io/assets/images/coins/svg/sol.svg";
    if (lowerCurrency === "usdt")
      return "https://ff.io/assets/images/coins/svg/usdt.svg";
    if (lowerCurrency === "usdc")
      return "https://ff.io/assets/images/coins/svg/usdceth.svg";
    if (lowerCurrency === "usdttrc")
      return "https://ff.io/assets/images/coins/svg/usdttrc.svg";

    return `https://ff.io/assets/images/coins/svg/${lowerCurrency}.svg`;
  };

  const getCurrencyColor = (currency: string) => {
    const lowerCurrency = currency.toLowerCase();
    if (lowerCurrency === "btc") return "bg-[#F7931A]";
    if (lowerCurrency === "eth") return "bg-[#627EEA]";
    if (lowerCurrency === "sol") return "bg-[#9945FF]";
    if (lowerCurrency === "usdt") return "bg-[#26A17B]";
    if (lowerCurrency === "usdc") return "bg-[#2775CA]";
    if (lowerCurrency === "usdttrc") return "bg-[#53AE94]";
    return "bg-[#0FA0CE]";
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Display both currency code and name when available
  const getDisplayCurrencyName = (code: string, name?: string) => {
    if (name && name !== code) {
      return `${code.toUpperCase()} - ${name}`;
    }
    return code.toUpperCase();
  };

  return (
    <div className="glass-card p-8 md:p-12 rounded-xl mb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/30 via-[#7a64ff]/20 to-transparent backdrop-blur-sm animate-pulse-subtle" />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative">
        <div className="flex-1 w-full md:w-auto ">
          <div className="text-sm text-gray-400 mb-3 md:text-right">
            YOU SEND
          </div>
          <div className="flex items-center gap-4 md:flex-row-reverse">
            <div
              className={`w-12 h-12 rounded-full ${getCurrencyColor(
                fromCurrency
              )} flex items-center justify-center text-lg font-bold text-white overflow-hidden`}
            >
              <img
                src={getCurrencyImageUrl(fromCurrency)}
                alt={fromCurrency}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerText =
                    getCurrencyIcon(fromCurrency);
                }}
              />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-2 md:text-right">
                {amount} {getDisplayCurrencyName(fromCurrency, fromCurrencyName)}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                Send funds:{" "}
                {depositAddress
                  ? formatAddress(depositAddress)
                  : "Generating address..."}
              </div>
            </div>
          </div>
        </div>

        <div className="w-16 h-16 md:w-12 md:h-12 rounded-full bg-secondary/20 flex items-center justify-center">
          <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-[#9b87f5]" />
        </div>

        <div className="flex-1 w-full md:w-auto">
          <div className="text-sm text-gray-400 mb-3">YOU RECEIVE</div>
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full ${getCurrencyColor(
                toCurrency
              )} flex items-center justify-center text-lg font-bold text-white overflow-hidden`}
            >
              <img
                src={getCurrencyImageUrl(toCurrency)}
                alt={toCurrency}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerText =
                    getCurrencyIcon(toCurrency);
                }}
              />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-2 ">
                {orderType === "float" && (
                  <span className="text-gray-400 mr-1">≈</span>
                )}
                {receiveAmount || ""} {getDisplayCurrencyName(toCurrency, toCurrencyName)}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                Receive at: {formatAddress(destinationAddress)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
