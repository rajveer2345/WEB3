import { useState } from 'react';
import ticket from "../assets/ticket.svg"

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
    <div className="relative flex items-center justify-center w-full max-w-[500]">
      {/* Multiple neon glow effects layered for depth */}

      
      {/* Card with stronger gradient border */}
      <div className="  rounded-xl w-full max-w-md relative z-10 shadow-lg">
        <div className="bg-gray-900 rounded-lg p-5 flex flex-col gap-4 w-full relative border border-[#6262D9]/50">
          
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
            <div className="flex flex-wrap justify-start gap-2">
              {Array.from({ length: userTickets }).map((_, index) => (
                <div 
                  key={index} 
                  className="relative bg-gray-800 text-gray-400 w-[60px] h-[60px] rounded flex items-center justify-center border border-gray-700"
                >
                    <div className='absolute inset-0'>
                        <img src={ticket} alt="" />
                    </div>

                    <div className='ablosute inset-0 flex justify-center items-center z-50 text-[#f2f2fa]/75 text-[24px] font-semibold'> {index + 1}</div>
                 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}