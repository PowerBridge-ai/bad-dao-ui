import { useAddress, useConnectionStatus, useDisconnect, useWallet } from "@thirdweb-dev/react";

export function useThirdwebWallet() {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();
  const wallet = useWallet();

  return {
    address,
    isConnected: connectionStatus === "connected",
    isConnecting: connectionStatus === "connecting",
    isDisconnected: connectionStatus === "disconnected",
    disconnect,
    wallet,
  };
}