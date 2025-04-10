import { WalletConnectModal } from "@walletconnect/modal";

const projectId = "7d6f241c232c23bca0f82b3038489ba3"; // Get it from https://cloud.walletconnect.com
const chains = ["eip155:97"]; // Ethereum Mainnet

export const modal = new WalletConnectModal({
  projectId,
  chains,
  themeMode: "light", // or "dark"
});
