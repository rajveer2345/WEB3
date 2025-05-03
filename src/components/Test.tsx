import { useState, useEffect } from 'react';

interface TestProps {
  getTickets: any;
  getWinningsForAddress: any;
  checkWinningsAmount: any;
  remainingTickets:any;
  CurrentWinningReward:any;
  expiration:any
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  expiration: bigint; 
}

const Countdown = ({ expiration }: CountdownProps) => {
  const calculateTimeLeft = () => {
    const now = BigInt(Math.floor(Date.now() / 1000)); // current time in seconds
    const diff = expiration > now ? expiration - now : 0n;

    const totalSeconds = Number(diff); // safe to convert since diff will be small
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiration]); // in case expiration changes dynamically

  return (
    <div className="flex justify-between gap-2 text-white">
      <div className="bg-gray-800 px-2 py-3 rounded-lg text-center flex-1">
        <p className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
        <p className="text-xs text-gray-400">Hours</p>
      </div>
      <div className="bg-gray-800 px-2 py-3 rounded-lg text-center flex-1">
        <p className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
        <p className="text-xs text-gray-400">Minutes</p>
      </div>
      <div className="bg-gray-800 px-2 py-3 rounded-lg text-center flex-1">
        <p className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</p>
        <p className="text-xs text-gray-400">Seconds</p>
      </div>
    </div>
  );
};


export default function Test({ getTickets, getWinningsForAddress, checkWinningsAmount, remainingTickets, CurrentWinningReward, expiration }: TestProps) {
  function formatUSDT(amount: bigint) {
    const decimals = 18n; 
    const divisor = 10n ** decimals; 
    const formatted = Number(amount) / Number(divisor); 
    return formatted.toFixed(2); 
  }

  return (
    <div className="relative flex items-center justify-center w-full max-w-[500px]">
      {/* Background glow layers */}
      <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-20"></div>
      <div className="absolute inset-0 bg-purple-600 rounded-xl blur-xl opacity-20 rotate-3"></div>
      <div className="absolute inset-0 bg-blue-400 rounded-xl blur-2xl opacity-10"></div>
      <div className="absolute inset-0 bg-purple-500 rounded-xl blur-3xl opacity-10 -rotate-3"></div>

      {/* Card */}
      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl w-full max-w-md relative z-10 shadow-lg">
        <div className="bg-gray-900 rounded-lg p-5 flex flex-col gap-4 w-full relative">
          <h1 className="text-gray-50 text-3xl font-medium text-center">The Next Draw</h1>

          <div className="flex gap-2 text-gray-50 py-2">
            <div className="border border-gray-700 p-3 rounded-lg flex flex-col gap-1 items-start w-full bg-gray-800 bg-opacity-30">
              <p className="text-xs font-medium text-gray-400">Total Pool</p>
              <p className="text-2xl font-normal text-gray-50">{formatUSDT(CurrentWinningReward)}<span className="text-blue-400 text-xl font-semibold">USDT</span></p>
            </div>
            <div className="border border-gray-700 p-3 rounded-lg flex flex-col gap-1 items-start w-full bg-gray-800 bg-opacity-30">
              <p className="text-xs font-medium text-gray-400">Tickets Remaining</p>
              <p className="text-2xl font-normal text-gray-50">{remainingTickets}</p>
            </div>
          </div>

          <div className="w-full">
            <Countdown expiration={expiration}/>
          </div>
        </div>
      </div>

      {/* Extra glows */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-20"></div>
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-600 rounded-full blur-xl opacity-20"></div>
    </div>
  );
}
