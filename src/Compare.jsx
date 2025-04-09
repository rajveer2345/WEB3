import { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import abi from "./contract/Lottery.json";
import "./App.css";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("");
  const [isOperator, setIsOperator] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [lotteryInfo, setLotteryInfo] = useState({
    ticketPrice: "0.01",
    ticketsLeft: 0,
    currentReward: "0",
    timeLeft: 0,
    lastWinner: "None",
    lastWinnerAmount: "0",
    userWinnings: "0",
    operatorCommission: "0",
  });
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const [loading, setLoading] = useState({
    buyTickets: false,
    drawWinner: false,
    withdrawWinnings: false,
    withdrawCommission: false,
    refundAll: false,
    restartDraw: false,
  });
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x3549493B2B2d7Fa059131B7A391095b30bF0774c";
      const contractABI = abi.abi;

      if (!window.ethereum) {
        console.log("MetaMask is not installed!");
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);

        setState({ provider, signer, contract });
        setAccount(accounts[0]);

        // Check if user is the operator
        const operator = await contract.lotteryOperator();
        setIsOperator(accounts[0].toLowerCase() === operator.toLowerCase());

        console.log("Connected Account:", accounts[0]);

        // Set up metamask account change listener
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
          setIsOperator(accounts[0].toLowerCase() === operator.toLowerCase());
          setRefreshData(prev => prev + 1);
        });

      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    connectWallet();

    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  useEffect(() => {
    const fetchLotteryInfo = async () => {
      if (!state.contract) return;
      try {
        const [
          remainingTickets,
          currentReward,
          operatorCommission,
          lastWinner,
          lastWinnerAmount,
          expiration,
          isWinner,
          userWinnings
        ] = await Promise.all([
          state.contract.RemainingTickets(),
          state.contract.CurrentWinningReward(),
          state.contract.operatorTotalCommission(),
          state.contract.lastWinner(),
          state.contract.lastWinnerAmount(),
          state.contract.expiration(),
          state.contract.IsWinner(),
          state.contract.checkWinningsAmount()
        ]);

        const timeLeftInSeconds = Number(expiration) - Math.floor(Date.now() / 1000);

        setLotteryInfo({
          ticketPrice: "0.01", // From contract constant
          ticketsLeft: Number(remainingTickets),
          currentReward: formatEther(currentReward),
          timeLeft: timeLeftInSeconds > 0 ? timeLeftInSeconds : 0,
          lastWinner: lastWinner === "0x0000000000000000000000000000000000000000" ? "None" : lastWinner,
          lastWinnerAmount: formatEther(lastWinnerAmount),
          operatorCommission: formatEther(operatorCommission),
          userWinnings: formatEther(userWinnings)
        });

        setIsWinner(isWinner);

      } catch (error) {
        console.error("Error fetching lottery info:", error);
      }
    };

    fetchLotteryInfo();
    
    // Set up interval to update time left
    const interval = setInterval(() => {
      setLotteryInfo(prev => ({
        ...prev,
        timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0
      }));
    }, 1000);

    // Set up interval to refresh data
    const dataInterval = setInterval(() => {
      fetchLotteryInfo();
    }, 10000); // Refresh every 10 seconds

    return () => {
      clearInterval(interval);
      clearInterval(dataInterval);
    };
  }, [state.contract, refreshData, account]);

  const buyTickets = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, buyTickets: true }));
    
    try {
      const totalCost = parseEther((ticketsToBuy * 0.01).toString());
      const tx = await state.contract.BuyTickets({ value: totalCost });
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert(`Successfully purchased ${ticketsToBuy} tickets!`);
    } catch (error) {
      console.error("Error buying tickets:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, buyTickets: false }));
    }
  };

  const drawWinner = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, drawWinner: true }));
    
    try {
      const tx = await state.contract.DrawWinnerTicket();
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert("Winner successfully drawn!");
    } catch (error) {
      console.error("Error drawing winner:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, drawWinner: false }));
    }
  };

  const withdrawWinnings = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, withdrawWinnings: true }));
    
    try {
      const tx = await state.contract.WithdrawWinnings();
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert("Winnings successfully withdrawn!");
    } catch (error) {
      console.error("Error withdrawing winnings:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, withdrawWinnings: false }));
    }
  };

  const withdrawCommission = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, withdrawCommission: true }));
    
    try {
      const tx = await state.contract.WithdrawCommission();
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert("Commission successfully withdrawn!");
    } catch (error) {
      console.error("Error withdrawing commission:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, withdrawCommission: false }));
    }
  };

  const refundAll = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, refundAll: true }));
    
    try {
      const tx = await state.contract.RefundAll();
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert("All tickets refunded!");
    } catch (error) {
      console.error("Error refunding tickets:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, refundAll: false }));
    }
  };

  const restartDraw = async () => {
    if (!state.contract) return;
    
    setLoading(prev => ({ ...prev, restartDraw: true }));
    
    try {
      const tx = await state.contract.restartDraw();
      await tx.wait();
      setRefreshData(prev => prev + 1);
      alert("Lottery draw restarted!");
    } catch (error) {
      console.error("Error restarting draw:", error);
      alert(`Error: ${error.message || "Transaction failed"}`);
    } finally {
      setLoading(prev => ({ ...prev, restartDraw: false }));
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Expired";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatAddress = (address) => {
    if (address === "None") return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="App">
      <header className="lottery-header">
        <h1>Blockchain Lottery</h1>
        <p className="account-info">
          Connected: {account ? formatAddress(account) : "Not Connected"}
          {isOperator && <span className="operator-badge">Operator</span>}
        </p>
      </header>

      <div className="lottery-container">
        <div className="lottery-info-card">
          <h2>Lottery Information</h2>
          <div className="lottery-info">
            <div className="info-row">
              <span>Ticket Price:</span>
              <span>{lotteryInfo.ticketPrice} ETH</span>
            </div>
            <div className="info-row">
              <span>Tickets Left:</span>
              <span>{lotteryInfo.ticketsLeft} / 100</span>
            </div>
            <div className="info-row">
              <span>Current Prize Pool:</span>
              <span>{lotteryInfo.currentReward} ETH</span>
            </div>
            <div className="info-row">
              <span>Time Left:</span>
              <span className={lotteryInfo.timeLeft <= 0 ? "expired" : ""}>
                {formatTime(lotteryInfo.timeLeft)}
              </span>
            </div>
            <div className="info-row">
              <span>Last Winner:</span>
              <span>{formatAddress(lotteryInfo.lastWinner)}</span>
            </div>
            <div className="info-row">
              <span>Last Prize Amount:</span>
              <span>{lotteryInfo.lastWinnerAmount} ETH</span>
            </div>
          </div>
        </div>

        <div className="action-cards">
          {/* Player Section */}
          <div className="action-card">
            <h2>Buy Tickets</h2>
            <div className="ticket-controls">
              <button 
                className="ticket-btn"
                onClick={() => setTicketsToBuy(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="ticket-count">{ticketsToBuy}</span>
              <button 
                className="ticket-btn"
                onClick={() => setTicketsToBuy(prev => Math.min(lotteryInfo.ticketsLeft, prev + 1))}
              >
                +
              </button>
            </div>
            <p className="cost-display">
              Cost: {(ticketsToBuy * 0.01).toFixed(2)} ETH
            </p>
            <button 
              className="action-btn"
              onClick={buyTickets}
              disabled={loading.buyTickets || ticketsToBuy <= 0 || lotteryInfo.ticketsLeft <= 0}
            >
              {loading.buyTickets ? "Processing..." : "Buy Tickets"}
            </button>
          </div>

          {/* Winner Section */}
          {isWinner && (
            <div className="action-card winner-card">
              <h2>Claim Your Prize!</h2>
              <p className="winning-amount">
                You won: {lotteryInfo.userWinnings} ETH
              </p>
              <button 
                className="action-btn claim-btn"
                onClick={withdrawWinnings}
                disabled={loading.withdrawWinnings}
              >
                {loading.withdrawWinnings ? "Processing..." : "Withdraw Winnings"}
              </button>
            </div>
          )}

          {/* Operator Section */}
          {isOperator && (
            <div className="action-card operator-card">
              <h2>Operator Controls</h2>
              <div className="operator-actions">
                <div className="operator-info">
                  <p>Available Commission: {lotteryInfo.operatorCommission} ETH</p>
                </div>
                <button 
                  className="action-btn operator-btn"
                  onClick={drawWinner}
                  disabled={loading.drawWinner || lotteryInfo.ticketsLeft === 100}
                >
                  {loading.drawWinner ? "Processing..." : "Draw Winner"}
                </button>
                <button 
                  className="action-btn operator-btn"
                  onClick={withdrawCommission}
                  disabled={loading.withdrawCommission || Number(lotteryInfo.operatorCommission) === 0}
                >
                  {loading.withdrawCommission ? "Processing..." : "Withdraw Commission"}
                </button>
                <button 
                  className="action-btn operator-btn"
                  onClick={restartDraw}
                  disabled={loading.restartDraw || lotteryInfo.ticketsLeft !== 100}
                >
                  {loading.restartDraw ? "Processing..." : "Restart Draw"}
                </button>
              </div>
            </div>
          )}

          {/* Refund Section - only show when expired */}
          {lotteryInfo.timeLeft <= 0 && lotteryInfo.ticketsLeft < 100 && (
            <div className="action-card refund-card">
              <h2>Lottery Expired</h2>
              <p>The lottery has expired without a winner being drawn.</p>
              <button 
                className="action-btn refund-btn"
                onClick={refundAll}
                disabled={loading.refundAll}
              >
                {loading.refundAll ? "Processing..." : "Refund All Tickets"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;