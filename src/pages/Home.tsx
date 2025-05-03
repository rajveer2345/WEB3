import { useState, useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { toast } from 'react-hot-toast';
import Marquee from "react-fast-marquee";
import { FaQuestion } from "react-icons/fa";

// Assets
import background from "../assets/background.png";
import bitcoin from "../assets/bitcoin.svg";
import logo from "../assets/logo.png";

// Components
import Test from '../components/Test';
import Test2 from '../components/Test2';
import AdminControls from '../components/AdminControls';
import WinnerCard from '../components/WinnerCard';

// Contract configs
import {
    LOTTERY_ABI,
    LOTTERY_CONTRACT_ADDRESS,
    USDT_ABI,
    USDT_CONTRACT_ADDRESS
} from '../contract/details';

// Constants
const USDT_DECIMALS = 18n;
const TICKET_PRICE = 10n * 10n ** USDT_DECIMALS; // 10 USDT
const wagmiContractConfig: any = {
    abi: LOTTERY_ABI,
    address: LOTTERY_CONTRACT_ADDRESS
};

const Home = () => {
    // State management
    const [isLandingPage, setIsLandingPage] = useState(false);
    const [loading, setLoading] = useState(false);

    // Wagmi hooks
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const config = useConfig();

    // Contract read hooks
    const { data: ticketsLeft } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'RemainingTickets',
        query: {
            refetchInterval: 4000
        }
    }) as { data: bigint | undefined };

    const { data: expiration } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'expiration',
        query: {
            refetchInterval: 30000
        }
    }) as { data: bigint | undefined };

    const { data: lotteryOperator } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'lotteryOperator',
        query: {
            refetchInterval: 4000
        }
    }) as { data: `0x${string}` | undefined };

    const { data: currentWinningReward } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'CurrentWinningReward',
        query: {
            refetchInterval: 4000
        }
    }) as { data: bigint | undefined };

    const { data: userTickets } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'getTickets',
        query: {
            refetchInterval: 4000
        }
    }) as { data: bigint | undefined };


    const { data: lastWinner } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'lastWinner',
        query: {
            refetchInterval: 4000
        }
    }) as { data: `0x${string}` | undefined };

    const { data: winnings } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'winnings',
        args: address ? [address] : undefined,
        query: {
            refetchInterval: 4000
        }
    }) as { data: bigint | undefined };;

    const { data: operatorTotalCommission } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'operatorTotalCommission',
        query: {
            refetchInterval: 30000
        }
    }) as { data: bigint | undefined };

    // Transaction handlers
    const handleTransaction = useCallback(async (operation: any, actionFunction: any) => {
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        setLoading(true);
        const loadingToastId = toast.loading(`${operation} in progress...`);

        try {
            await actionFunction();
            toast.dismiss(loadingToastId);
            toast.success(`${operation} successful!`);
        } catch (error) {
            console.error(`${operation} failed:`, error);
            toast.dismiss(loadingToastId);
            toast.error(`${operation} failed. Please try again.`);
        } finally {
            setLoading(false);
        }
    }, [isConnected]);

    // Buy tickets function
    const buyTickets = useCallback(async (numTickets: any) => {
        handleTransaction('Buy tickets', async () => {
            const totalCost = BigInt(numTickets) * TICKET_PRICE;

            // Check allowance
            const allowance: any = await readContract(config, {
                address: USDT_CONTRACT_ADDRESS,
                abi: USDT_ABI,
                functionName: 'allowance',
                args: [address || "0x000", LOTTERY_CONTRACT_ADDRESS],
            });

            // Approve USDT if needed
            if (allowance < totalCost) {
                const approveToastId = toast.loading('Approving USDT...');
                try {
                    const approveTx = await writeContractAsync({
                        address: USDT_CONTRACT_ADDRESS,
                        abi: USDT_ABI,
                        functionName: 'approve',
                        args: [LOTTERY_CONTRACT_ADDRESS, totalCost],
                    });

                    await waitForTransactionReceipt(config, { hash: approveTx });
                    toast.dismiss(approveToastId);
                    toast.success('USDT Approved');
                } catch (error) {
                    toast.dismiss(approveToastId);
                    toast.error('USDT approval failed');
                    throw error; // Re-throw to be caught by the outer handler
                }
            }

            // Buy tickets
            const buyToastId = toast.loading('Buying tickets...');
            try {
                const buyTx: any = await writeContractAsync({
                    address: LOTTERY_CONTRACT_ADDRESS,
                    abi: LOTTERY_ABI,
                    functionName: 'BuyTickets',
                    args: [numTickets],
                });

                await waitForTransactionReceipt(config, { hash: buyTx });
                toast.dismiss(buyToastId);
            } catch (error) {
                toast.dismiss(buyToastId);
                throw error; // Re-throw to be caught by the outer handler
            }
        });
    }, [address, config, handleTransaction, writeContractAsync]);

    // Withdraw winnings function
    const withdrawWinnings = useCallback(async () => {
        handleTransaction('Withdraw winnings', async () => {
            const withdrawTx: any = await writeContractAsync({
                ...wagmiContractConfig,
                functionName: 'WithdrawWinnings',
            });


            await waitForTransactionReceipt(config, { hash: withdrawTx });
        });
    }, [config, handleTransaction, writeContractAsync]);

    // Draw winner function
    const drawWinner = useCallback(async () => {
        handleTransaction('Draw winner', async () => {
            const tx: any = await writeContractAsync({
                ...wagmiContractConfig,
                functionName: 'DrawWinnerTicket'
            });


            await waitForTransactionReceipt(config, { hash: tx });
        });
    }, [config, handleTransaction, writeContractAsync]);

    // Restart draw function
    const restartDraw = useCallback(async () => {
        handleTransaction('Restart draw', async () => {
            const tx: any = await writeContractAsync({
                ...wagmiContractConfig,
                functionName: 'restartDraw'
            });


            await waitForTransactionReceipt(config, { hash: tx });
        });
    }, [config, handleTransaction, writeContractAsync]);

    // Withdraw commission function
    const withdrawCommission = useCallback(async () => {
        handleTransaction('Withdraw commission', async () => {
            const withdrawTx: any = await writeContractAsync({
                ...wagmiContractConfig,
                functionName: 'WithdrawCommission',
            });


            await waitForTransactionReceipt(config, { hash: withdrawTx });
        });
    }, [config, handleTransaction, writeContractAsync]);

    // Refund all function
    const refundAll = useCallback(async () => {
        handleTransaction('Refund all', async () => {
            const refundTx: any = await writeContractAsync({
                ...wagmiContractConfig,
                functionName: 'RefundAll',
            });


            await waitForTransactionReceipt(config, { hash: refundTx });
        });
    }, [config, handleTransaction, writeContractAsync]);

    // UI Components
    const LandingPage = () => (
        <div
            style={{ backgroundImage: `url(${background})` }}
            className="w-full h-screen bg-center bg-cover flex flex-col justify-center items-center relative"
        >
            <img className='w-[220px] h-auto' src={bitcoin} alt="Bitcoin" />
            <h1 className='text-[32px] text-white font-bold leading-10 mt-5'>THE BLOCKJACK DRAW</h1>
            <p className='text-sm text-white font-normal'>Get started by logging in with Your MetaMask</p>

            <a className='text-white py-1 px-4 mt-6 bg-purple-400 rounded-lg' href="https://metamask.app.link/dapp/gameon-3ewd.onrender.com">
                connect on mobile
            </a>

            <button
                onClick={() => setIsLandingPage(false)}
                style={{
                    backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                }}
                className='px-6 py-3 text-xs font-semibold text-white rounded-[8px] mt-10 mb-14 cursor-pointer shadow-md'
            >
                Login with MetaMask
            </button>
        </div>
    );

    const Navbar = () => (
        <div className='w-full h-[60px]'>
            <div id="navbar" className='w-full h-full px-4 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <img className='w-9 h-9' src={logo} alt="Logo" />
                    <p className="text-[20px] font-bold bg-gradient-to-r from-[#6262D9] to-[#9D62D9] text-transparent bg-clip-text">
                        BlockJack
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    <appkit-button />

                    <div className='flex items-center justify-center'>
                        <button
                            style={{
                                backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                            }}
                            className='px-2 py-2 text-sm font-semibold text-white rounded-[8px] cursor-pointer shadow-md'
                        >
                            <FaQuestion size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const MainContent = () => (
        <div className='w-full flex flex-col items-center pt-4 pb-6 gap-8 overflow-clip px-4'>
            <Marquee className="text-[#f2f2fa] text-base font-normal w-full max-w-[800px]">
                Last winner: {lastWinner} <span className="text-2xl mr-10"> 🎊</span>
            </Marquee>

            {winnings !== undefined && winnings > 0 && (
                <WinnerCard winnings={winnings} withdrawWinnings={withdrawWinnings} />
            )}

            <Test
                remainingTickets={ticketsLeft}
                expiration={expiration}
                CurrentWinningReward={currentWinningReward}
            />

            {operatorTotalCommission !== undefined &&
                address === lotteryOperator && (
                    <AdminControls
                        operatorTotalCommission={operatorTotalCommission}
                        withdrawCommission={withdrawCommission}
                        drawWinner={drawWinner}
                        restartDraw={restartDraw}
                        refundAll={refundAll}
                    />
                )}

            <Test2
                getTickets={userTickets}
                address={address}
                buyTickets={buyTickets}
            />
        </div>
    );

    const AppContent = () => (
        <div className='w-full min-h-screen bg-[#161719] relative'>
            {loading && (
                <div className='bg-black/50 fixed inset-0 top-0 z-50 flex justify-center items-center'>
                    <span className="loader"></span>
                </div>
            )}

            <Navbar />
            <MainContent />
        </div>
    );

    return isLandingPage ? <LandingPage /> : <AppContent />;
};

export default Home;