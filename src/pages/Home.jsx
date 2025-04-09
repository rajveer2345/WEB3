import React, { useState } from 'react';
import background from "../assets/background.png";
import bitcoin from "../assets/bitcoin.svg";
import Lottie from "lottie-react";
import animationData from "../assets/animal.json";
import logo from "../assets/logo.png";
import Countdown from '../components/Countdown';
import Test from '../components/Test';
import Test2 from '../components/Test2';

function Home() {
    const [home, setHome] = useState(false)
    return (
        <div className="w-full min-h-screen">
            {
                !home ? <div
                    style={{ backgroundImage: `url(${background})` }}
                    className="w-full h-screen bg-center bg-cover flex flex-col justify-center items-center relative"
                >


                    <img className='w-[220px] h-auto' src={bitcoin} alt="" />

                    {/* <div className="w-64 h-64"> <Lottie animationData={animationData} loop={true} /></div> */}


                    <h1 className='text-[32px] text-white font-bold leading-10 mt-5'>THE BLOCKJACK DRAW</h1>
                    <p className='text-sm text-white font-normal'>Get started by logging in with Your MetaMask</p>

                    <button onClick={() => { setHome(true) }} style={{
                        backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                    }} className='px-6 py-3 text-xs font-semibold text-white rounded-[8px] mt-10 mb-14 cursor-pointer shadow-md'> Login with MetaMask

                    </button>



                </div> :
                    <div className='w-full min-h-screen bg-[#161719]'>

                        {/* navbar */}
                        <div className='w-full h-[60px]'>
                            <div id="navbar" className='w-full h-full px-4 flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <img className='w-10 h-10' src={logo} alt="" />
                                    <p className="text-[20px] font-bold bg-gradient-to-r from-[#6262D9] to-[#9D62D9] text-transparent bg-clip-text">
                                        BlockJack
                                    </p>
                                </div>
                                <div className='flex items-center'>

                                    <button style={{
                                        backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                                    }} className='px-8 py-[8px] text-sm font-semibold text-white rounded-[8px] cursor-pointer shadow-md'> Logout

                                    </button>



                                </div>

                            </div>
                        </div>

                        {/* counter */}
                        <div className='w-full flex flex-col items-center pt-10 pb-6 gap-8 overflow-clip'>

                        <marquee className="text-[#f2f2fa] text-base font-normal w-full max-w-[800px]">Last winner: 0x3D32b05544608F993c4666b3894c6B93b2A7C609 <span className="text-2xl"> 🎊</span></marquee>


                                {/* <div className="bg-[#161719] rounded-xl p-5 flex flex-col gap-4 w-full relative">
                                 

                                    <h1 className='text-[#f2f2fa] text-[32px] font-medium text-center'>The Next Draw</h1>

                                    <div className='flex gap-2 text-[#f2f2fa] py-2'>
                                        <div className='border border-[#f2f2fa] p-3 rounded-[8px] text-[#f2f2fa] flex flex-col gap-1 items-start w-full'>
                                            <p className='text-xs font-medium text-[#cbcbcb]'>Total Pool</p>
                                            <p className='text-[22px] font-normal text-[#f2f2fa]'>{"100.00"} <span className='text-[#0090FF] text-xl font-semibold'> USDT</span></p>
                                        </div>
                                        <div className='border border-[#f2f2fa] p-3 rounded-[8px] text-[#f2f2fa] flex flex-col gap-1 items-start w-full'>
                                            <p className='text-xs font-medium text-[#cbcbcb]'>Tickets Remaining</p>
                                            <p className='text-[22px] font-normal text-[#f2f2fa]'>{"100"}</p>
                                        </div>


                                    </div>


                                    <div className='w-full'>

                                        <Countdown />

                                    </div>



                                </div> */}

                                <Test/>
                                <Test2/>

                              

                        </div>



                    </div>
            }



        </div>
    );
}

export default Home;
