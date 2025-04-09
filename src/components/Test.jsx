import { useState, useEffect } from 'react';

export default function Test() {
  // Simple countdown component
  const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
      days: 2,
      hours: 14,
      minutes: 35,
      seconds: 42
    });
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          } else if (prev.days > 0) {
            return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
          }
          return prev;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }, []);
    
    return (
      <div className="flex justify-between gap-2 text-white">

        <div className="bg-gray-800 px-2 py-3 rounded-lg text-center flex-1">
          <p className="text-3xl font-bold">{timeLeft.hours}</p>
          <p className="text-xs text-gray-400">Hours</p>
        </div>
        <div className="bg-gray-800 px-2 py-3  rounded-lg text-center flex-1">
          <p className="text-3xl font-bold">{timeLeft.minutes}</p>
          <p className="text-xs text-gray-400">Minutes</p>
        </div>
        <div className="bg-gray-800 px-2 py-3  rounded-lg text-center flex-1">
          <p className="text-3xl font-bold">{timeLeft.seconds}</p>
          <p className="text-xs text-gray-400">Seconds</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-[500px]">
      {/* Multiple neon glow effects layered for depth */}
      <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-20"></div>
      <div className="absolute inset-0 bg-purple-600 rounded-xl blur-xl opacity-20 rotate-12"></div>
      <div className="absolute inset-0 bg-blue-400 rounded-xl blur-2xl opacity-10"></div>
      <div className="absolute inset-0 bg-purple-500 rounded-xl blur-3xl opacity-10 -rotate-6"></div>
      
      {/* Card with stronger gradient border */}
      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl w-full max-w-md relative z-10 shadow-lg">
        <div className="bg-gray-900 rounded-lg p-5 flex flex-col gap-4 w-full relative">
          <h1 className="text-gray-50 text-3xl font-medium text-center">The Next Draw</h1>
          
          <div className="flex gap-2 text-gray-50 py-2">
            <div className="border border-gray-700 p-3 rounded-lg flex flex-col gap-1 items-start w-full bg-gray-800 bg-opacity-30">
              <p className="text-xs font-medium text-gray-400">Total Pool</p>
              <p className="text-2xl font-normal text-gray-50">100.00 <span className="text-blue-400 text-xl font-semibold">USDT</span></p>
            </div>
            <div className="border border-gray-700 p-3 rounded-lg flex flex-col gap-1 items-start w-full bg-gray-800 bg-opacity-30">
              <p className="text-xs font-medium text-gray-400">Tickets Remaining</p>
              <p className="text-2xl font-normal text-gray-50">100</p>
            </div>
          </div>

          <div className="w-full">
            <Countdown />
          </div>
        </div>
      </div>
      
      {/* Additional subtle glow effects */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-20"></div>
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-600 rounded-full blur-xl opacity-20"></div>
    </div>
  );
}