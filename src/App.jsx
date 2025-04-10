import { useEffect, useState } from 'react';
import './App.css';
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS, USDT_ABI, USDT_CONTRACT_ADDRESS } from '../src/contract/details';
import Home from './pages/Home';
import Test from './components/Test';
import WalletConnectButton from './components/WalletConnectButton';

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState('');
  const [isOperator, setIsOperator] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [lotteryInfo, setLotteryInfo] = useState({
    ticketPrice: '10',
    ticketsLeft: 0,
    currentReward: '0',
    timeLeft: 0,
    lastWinner: 'None',
    lastWinnerAmount: '0',
    userWinnings: '0',
    operatorCommission: '0',
  });
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const [loading, setLoading] = useState({
    initapp: false,
    buyTickets: false,
    drawWinner: false,
    withdrawWinnings: false,
    withdrawCommission: false,
    refundAll: false,
    restartDraw: false,
  });
  const [refreshData, setRefreshData] = useState(0);

  const connectWallet = async () => {

    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_ABI, signer);



      const usdtxx = new Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
      const decimals = await usdtxx.decimals();
      console.log(decimals, "decimals");

      setState({ provider, signer, contract });
      setAccount(accounts[0]);

      const operator = await contract.lotteryOperator();
      setIsOperator(accounts[0].toLowerCase() === operator.toLowerCase());

      const handleAccountChange = (accounts) => {
        setAccount(accounts[0]);
        setIsOperator(accounts[0].toLowerCase() === operator.toLowerCase());
        setRefreshData((prev) => prev + 1);
      };

      window.ethereum.on('accountsChanged', handleAccountChange);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      };
    } catch (err) {
      console.log('Error connecting to wallet:', err);
    }
  };

  useEffect(() => {
    connectWallet();

    
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
          userWinnings,
        ] = await Promise.all([
          state.contract.RemainingTickets(),
          state.contract.CurrentWinningReward(),
          state.contract.operatorTotalCommission(),
          state.contract.lastWinner(),
          state.contract.lastWinnerAmount(),
          state.contract.expiration(),
          state.contract.IsWinner(),
          state.contract.checkWinningsAmount(),
        ]);

        const timeLeftInSeconds = Number(expiration) - Math.floor(Date.now() / 1000);

        setLotteryInfo({
          ticketPrice: '10', // Ideally dynamic
          ticketsLeft: Number(remainingTickets),
          currentReward: formatUnits(currentReward, 18),
          timeLeft: timeLeftInSeconds > 0 ? timeLeftInSeconds : 0,
          lastWinner:
            lastWinner === '0x0000000000000000000000000000000000000000' ? 'None' : lastWinner,
          lastWinnerAmount: formatUnits(lastWinnerAmount, 18),
          operatorCommission: formatUnits(operatorCommission, 18),
          userWinnings: formatUnits(userWinnings, 18),
        });

        setIsWinner(isWinner);
      } catch (error) {
        console.error('Error fetching lottery info:', error);
      }
    };

    fetchLotteryInfo();

    const interval = setInterval(() => {
      setLotteryInfo((prev) => ({
        ...prev,
        timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
      }));
    }, 1000);

    const dataInterval = setInterval(() => {
      fetchLotteryInfo();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(dataInterval);
    };
  }, [state.contract, refreshData, account]);

  ////////////// FUNCTIONS //////////////

  const buyTickets = async () => {
    if (!state.contract) return;
  
    setLoading((prev) => ({ ...prev, buyTickets: true }));
  
    try {
      const ticketCount = ticketsToBuy;
      const totalCost = parseUnits((10 * ticketCount).toString(), 18); // USDT has 6 decimals
  
      const usdt = new Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, state.signer);
  
      const approveTx = await usdt.approve(LOTTERY_CONTRACT_ADDRESS, totalCost);
      await approveTx.wait();
  
      const tx = await state.contract.BuyTickets(ticketCount);
      await tx.wait();
  
      setRefreshData((prev) => prev + 1);
      alert(`Successfully purchased ${ticketCount} ticket(s)!`);
    } catch (error) {
      console.log('Error buying tickets:', error.message);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, buyTickets: false }));
    }
  };
  

  const drawWinner = async () => {
    if (!state.contract) return;
    setLoading((prev) => ({ ...prev, drawWinner: true }));
    try {
      const tx = await state.contract.DrawWinnerTicket();
      await tx.wait();
      setRefreshData((prev) => prev + 1);
      alert('Winner successfully drawn!');
    } catch (error) {
      console.error('Error drawing winner:', error);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, drawWinner: false }));
    }
  };

  const withdrawWinnings = async () => {
    if (!state.contract) return;
    setLoading((prev) => ({ ...prev, withdrawWinnings: true }));
    try {
      const tx = await state.contract.WithdrawWinnings();
      await tx.wait();
      setRefreshData((prev) => prev + 1);
      alert('Winnings successfully withdrawn!');
    } catch (error) {
      console.error('Error withdrawing winnings:', error);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, withdrawWinnings: false }));
    }
  };

  const withdrawCommission = async () => {
    if (!state.contract) return;
    setLoading((prev) => ({ ...prev, withdrawCommission: true }));
    try {
      const tx = await state.contract.WithdrawCommission();
      await tx.wait();
      setRefreshData((prev) => prev + 1);
      alert('Commission successfully withdrawn!');
    } catch (error) {
      console.error('Error withdrawing commission:', error);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, withdrawCommission: false }));
    }
  };

  const refundAll = async () => {
    if (!state.contract) return;
    setLoading((prev) => ({ ...prev, refundAll: true }));
    try {
      const tx = await state.contract.RefundAll();
      await tx.wait();
      setRefreshData((prev) => prev + 1);
      alert('All tickets refunded!');
    } catch (error) {
      console.error('Error refunding tickets:', error);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, refundAll: false }));
    }
  };

  const restartDraw = async () => {
    if (!state.contract) return;
    setLoading((prev) => ({ ...prev, restartDraw: true }));
    try {
      const tx = await state.contract.restartDraw();
      await tx.wait();
      setRefreshData((prev) => prev + 1);
      alert('Lottery draw restarted!');
    } catch (error) {
      console.error('Error restarting draw:', error);
      alert(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setLoading((prev) => ({ ...prev, restartDraw: false }));
    }
  };

  ////////////// UI //////////////

  return (
    // <div className="h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
    //   <p className="text-xl font-semibold mb-4 break-words text-center">
    //     Connected as: {account}
    //   </p>

    //   {isOperator ? (
    //     <p className="text-green-600 text-2xl">👑 You are the Owner</p>
    //   ) : (
    //     <p className="text-blue-600 text-2xl">👤 You are a User</p>
    //   )}

    //   <div className="mt-6 space-y-2 text-center">
    //     <p>🎫 Ticket Price: {lotteryInfo.ticketPrice}</p>
    //     <p>🎫 Ticket to buy: {ticketsToBuy}</p>
    //     <p>🪙 Tickets Left: {lotteryInfo.ticketsLeft}</p>
    //     <p>💰 Current Reward: {lotteryInfo.currentReward}</p>
    //     <p>⏳ Time Left: {lotteryInfo.timeLeft}s</p>
    //     <p>🏆 Last Winner: {lotteryInfo.lastWinner}</p>
    //     <p>💸 Last Winner Amount: {lotteryInfo.lastWinnerAmount}</p>
    //     <p>💼 Operator Commission: {lotteryInfo.operatorCommission}</p>
    //     <p>🧾 Your Winnings: {lotteryInfo.userWinnings}</p>

    //     <button onClick={buyTickets} className='bg-green-300 rounded-xl p-4 hover:bg-green-500 cursor-pointer'>buy ticket</button>
    //   </div>
    // </div>
    // <Home/>
       <WalletConnectButton/>

  );
}

export default App;
