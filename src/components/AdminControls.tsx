import { Trophy, ArrowDown, RotateCcw, RotateCw } from 'lucide-react';

export default function AdminControls({operatorTotalCommission, withdrawCommission, drawWinner,  restartDraw, refundAll}) {
  const commissionAmount = 0.018;
  const currency = "USDT";

  function formatUSDT(amount: bigint) {
    const decimals = 18n; 
    const divisor = 10n ** decimals; 
    const formatted = Number(amount) / Number(divisor); 
    return formatted.toFixed(2); 
  }

  return (
    <div className="relative flex items-center justify-center w-full max-w-md">


      <div className="bg-gray-900 rounded-lg p-5 flex flex-col gap-4 w-full relative border border-[#6262D9]/50">

        {/* Title and Commission Info */}
        <div className="text-center mb-1">
          <h2 className="text-white text-lg font-medium">Admin Controls</h2>
          <p className="text-gray-300 text-sm mt-1">
            Total Commission to be withdrawn: {formatUSDT(operatorTotalCommission)} {currency}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Draw Winner Button */}
          <button onClick={drawWinner} className="bg-gray-800 rounded p-3 flex flex-col items-center justify-center hover:bg-gray-700 transition cursor-pointer">
            <Trophy size={20} className="text-gray-300 mb-1" />
            <p className="text-gray-300 text-xs text-center">Draw Winner</p>
          </button>

          {/* Withdraw Commission Button */}
          <button onClick={withdrawCommission} className="bg-gray-800 rounded p-3 flex flex-col items-center justify-center hover:bg-gray-700 transition cursor-pointer">
            <ArrowDown size={20} className="text-gray-300 mb-1" />
            <p className="text-gray-300 text-xs text-center">Withdraw Commission</p>
          </button>

          {/* Restart Draw Button */}
          <button onClick={restartDraw} className="bg-gray-800 rounded p-3 flex flex-col items-center justify-center hover:bg-gray-700 transition cursor-pointer">
            <RotateCcw size={20} className="text-gray-300 mb-1" />
            <p className="text-gray-300 text-xs text-center">Restart Draw</p>
          </button>

          {/* Refund All Button */}
          <button onClick={refundAll} className="bg-gray-800 rounded p-3 flex flex-col items-center justify-center hover:bg-gray-700 transition cursor-pointer">
            <RotateCw size={20} className="text-gray-300 mb-1" />
            <p className="text-gray-300 text-xs text-center">Refund All</p>
          </button>
        </div>
      </div>
    </div>
  );
}