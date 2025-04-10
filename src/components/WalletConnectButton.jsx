import React, { useEffect, useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { modal } from "../walletConnectModel";

const WalletConnectButton = () => {
  const [signClient, setSignClient] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const initClient = async () => {
      const client = await SignClient.init({
        projectId: "7d6f241c232c23bca0f82b3038489ba3",
        metadata: {
          name: "My DApp",
          description: "DApp using WalletConnect v2",
          url: "https://gameon-3ewd.onrender.com",
          icons: ["/vite.svg"],
        },
      });

      setSignClient(client);
    };

    initClient();
  }, []);

  const connectWallet = async () => {
    if (!signClient) return;

    const { uri, approval } = await signClient.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
          chains: ["eip155:97"],
          events: ["accountsChanged", "chainChanged"],
        },
      },
    });

    if (uri) {
      await modal.openModal({ uri });
    }

    const session = await approval();
    modal.closeModal();

    const address = session.namespaces["eip155"].accounts[0].split(":")[2];
    setAccount(address);
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletConnectButton;
