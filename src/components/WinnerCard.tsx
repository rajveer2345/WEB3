import { Star } from 'lucide-react';

type WinnerCardProps = {
  winnings: bigint;
  withdrawWinnings: () => void;
};


export default function WinnerCard({winnings, withdrawWinnings}:WinnerCardProps) {
  const winnerName = "Congratulations! You are the winner";
  const currency = "USDT";

  function formatUSDT(amount: bigint) {
    const decimals = 18n; 
    const divisor = 10n ** decimals; 
    const formatted = Number(amount) / Number(divisor); 
    return formatted.toFixed(2); 
  }
  

  return (
    <div className="relative flex items-center justify-center w-full max-w-md mx-auto h-24">
     
      
      {/* Card with gradient border matching your UI style */}
      <div className={`p-[2px] bg-gradient-to-r from-yellow-500 to-pink-500 rounded-xl w-full max-w-md relative`}>
        <div className="bg-gray-900 rounded-lg flex flex-col justify-center items-center w-full h-full relative py-3 px-4">
          
          {/* Content with star animations like in your UI */}
          <div className="flex items-center justify-center w-full">
            <Star 
              size={20} 
              className={`text-yellow-400 mr-2 transition-all duration-300 animate-bounce`} 
            />
            <h2 className="text-yellow-400 font-bold text-lg animate-bounce text-center leading-6">{winnerName}</h2>
            <Star 
              size={20} 
              className={`text-yellow-400 ml-2 transition-all duration-300 animate-bounce `} 
            />
          </div>
          
          {/* Winnings amount - using proper green to match UI */}
          <p className="text-white text-center mb-1">
            Total Winnings: <span className="font-medium text-green-400">{formatUSDT(winnings)} {currency}</span>
          </p>
          
          {/* CTA Button - orange to match your UI */}
          <button onClick={withdrawWinnings} className="text-black text-sm font-medium bg-yellow-500 hover:bg-yellow-400 px-4 py-1 rounded-md transition-all duration-300 mt-1 hover:shadow-lg hover:shadow-yellow-500/30">
            Click here to withdraw
          </button>
        </div>
      </div>
    </div>
  );
}