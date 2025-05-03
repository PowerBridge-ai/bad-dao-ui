/**
 * Truncates an Ethereum address for display
 * @param address The full Ethereum address
 * @returns Truncated address (e.g., 0x1234...5678)
 */
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};