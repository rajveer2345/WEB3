import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // If no target date provided, use a demo date 1 hour from now
        const target = targetDate || new Date(Date.now() + 60 * 60 * 1000);

        const calculateTimeLeft = () => {
            const difference = target - new Date();

            if (difference <= 0) {
                setIsComplete(true);
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                hours: Math.floor((difference / (1000 * 60 * 60))),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Set up interval
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear interval on unmount
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex flex-col items-center w-full max-w-lg">
            <div className="w-full rounded-md text-center">
                <h2 className="text-[#f2f2fa] text-base mb-2 animate-bounce">
                    {isComplete ? "Ticket Sales have now CLOSED for this Draw!" : "Time left to Draw"}
                </h2>

                <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center ">
                        <div style={{
                            backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                        }} className=" w-24 h-24 flex items-center justify-center rounded-md border border-gray-700 ">
                            <span className="text-5xl text-gray-300 font-semibold">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[#cbcbcb] text-sm mt-2">HOURS</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div style={{
                            backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                        }} className="bg-gray-800 w-24 h-24 flex items-center justify-center rounded-md border border-gray-700">
                            <span className="text-5xl text-gray-300 font-semibold">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[#cbcbcb] text-sm mt-2">MINUTES</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div style={{
                            backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                        }} className="bg-gray-800 w-24 h-24 flex items-center justify-center rounded-md border border-gray-700">
                            <span className="text-5xl text-gray-300 font-semibold">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[#cbcbcb] text-sm mt-2">SECONDS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}