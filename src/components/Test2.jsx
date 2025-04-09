import { useState } from 'react';

export default function Test2() {
  const [ticketCount, setTicketCount] = useState(1);
  const pricePerTicket = 0.01;
  const serviceFee = 0.001;
  const currency = "MATIC";
  const userTickets = 8;
  
  const totalCost = (ticketCount * pricePerTicket).toFixed(2);
  
  // Handle ticket count changes
  const handleIncreaseTicket = () => {
    setTicketCount(prev => prev + 1);
  };
  
  const handleDecreaseTicket = () => {
    if (ticketCount > 1) {
      setTicketCount(prev => prev - 1);
    }
  };
  
  return (
    <div className="relative flex items-center justify-center w-full max-w-lg p-8">
      {/* Multiple neon glow effects layered for depth */}
      <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-20"></div>
      <div className="absolute inset-0 bg-purple-600 rounded-xl blur-xl opacity-20 rotate-12"></div>
      <div className="absolute inset-0 bg-blue-400 rounded-xl blur-2xl opacity-10"></div>
      <div className="absolute inset-0 bg-purple-500 rounded-xl blur-3xl opacity-10 -rotate-6"></div>
      
      {/* Card with stronger gradient border */}
      <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl w-full max-w-md relative z-10 shadow-lg">
        <div className="bg-gray-900 rounded-lg p-5 flex flex-col gap-4 w-full relative">
          
          {/* Ticket Price Info */}
          <div className="flex justify-between items-center text-gray-50 border-b border-gray-800 pb-3">
            <p className="text-gray-400">Price per ticket</p>
            <p className="font-medium">{pricePerTicket} {currency}</p>
          </div>
          
          {/* Ticket Counter */}
          <div className="flex justify-between items-center text-gray-50">
            <p className="text-gray-50 font-medium">TICKETS</p>
            <div className="flex items-center">
              <p className="text-xl font-medium px-4">{ticketCount}</p>
            </div>
          </div>
          
          {/* Cost Calculation */}
          <div className="text-gray-50 mt-2">
            <div className="flex justify-between items-center">
              <p className="text-green-400 font-medium">Total cost of tickets</p>
              <p className="font-medium text-green-400">{totalCost} {currency}</p>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <p className="text-gray-400">+ Service Fees</p>
              <p className="text-gray-400">{serviceFee} {currency}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-400">+ Network Fees</p>
              <p className="text-gray-400">TBC</p>
            </div>
          </div>
          
          {/* Purchase Button */}
          <button className="w-full bg-gray-700 text-white py-3 rounded-md mt-3 hover:bg-gray-600 transition duration-200">
            Buy {ticketCount} {ticketCount > 1 ? 'tickets' : 'ticket'} for {totalCost} {currency}
          </button>
          
          {/* User Tickets Display */}
          <div className="mt-3">
            <p className="text-gray-300 mb-3">You have {userTickets} Tickets in this draw</p>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: userTickets }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800 text-gray-400 w-8 h-8 rounded flex items-center justify-center border border-gray-700"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional subtle glow effects */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-xl opacity-20"></div>
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-600 rounded-full blur-xl opacity-20"></div>
    </div>
  );
}