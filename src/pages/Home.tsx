import React, { useState } from 'react';
import background from "../assets/background.png";
import bitcoin from "../assets/bitcoin.svg";
import logo from "../assets/logo.png";
import Test from '../components/Test';
import Test2 from '../components/Test2';

const Home: React.FC = () => {
    const [home, setHome] = useState<boolean>(false);

    return (
        <div className="w-full min-h-screen">
            {!home ? (
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
                        onClick={() => setHome(true)}
                        style={{
                            backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                        }}
                        className='px-6 py-3 text-xs font-semibold text-white rounded-[8px] mt-10 mb-14 cursor-pointer shadow-md'
                    >
                        Login with MetaMask
                    </button>
                </div>
            ) : (
                <div className='w-full min-h-screen bg-[#161719]'>
                    {/* navbar */}
                    <div className='w-full h-[60px]'>
                        <div id="navbar" className='w-full h-full px-4 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <img className='w-10 h-10' src={logo} alt="Logo" />
                                <p className="text-[20px] font-bold bg-gradient-to-r from-[#6262D9] to-[#9D62D9] text-transparent bg-clip-text">
                                    BlockJack
                                </p>
                            </div>
                            <div className='flex items-center'>
                                {/* <button
                                    style={{
                                        backgroundImage: 'linear-gradient(190deg, #6262D9, #9D62D9)',
                                    }}
                                    className='px-8 py-[8px] text-sm font-semibold text-white rounded-[8px] cursor-pointer shadow-md'
                                >
                                    Logout
                                </button> */}
                                   <appkit-button />
                            </div>
                        </div>
                    </div>

                    {/* content */}
                    <div className='w-full flex flex-col items-center pt-8 pb-6 gap-8 overflow-clip px-4'>
                        <marquee className="text-[#f2f2fa] text-base font-normal w-full max-w-[800px]">
                            Last winner: 0x3D32b05544608F993c4666b3894c6B93b2A7C609 <span className="text-2xl"> 🎊</span>
                        </marquee>

                        <Test />
                        <Test2 />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
